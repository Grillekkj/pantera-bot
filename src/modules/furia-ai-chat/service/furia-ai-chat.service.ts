import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuriaAiChatEntity } from '../entity/furia-ai-chat.entity';
import { Repository } from 'typeorm';
import {
  FURIA_AI_PLAYER_IDENTIFIER,
  FURIA_AI_PROMPT,
  IGetByNickname,
} from './furia-ai-chat.struct';
import { WhatsappClientService } from 'src/infra/whatsapp-client/service/whatsapp-client.service';
import { GeminiClientService } from 'src/infra/gemini-client/service/gemini-client.service';
import { Client } from 'whatsapp-web.js';
import { SubmenuHandler } from 'src/common/message-handler/submenu-handler.interface';

@Injectable()
export class FuriaAiChatService implements SubmenuHandler {
  private readonly LOGGER = new Logger(FuriaAiChatService.name);
  private readonly chatHistories: Map<string, string[]> = new Map();
  private readonly WHATSAPP_CLIENT: Client;

  constructor(
    @InjectRepository(FuriaAiChatEntity)
    private readonly furiaAiChatRepository: Repository<FuriaAiChatEntity>,
    private readonly whatsappClientService: WhatsappClientService,
    private readonly geminiClientService: GeminiClientService,
  ) {
    this.WHATSAPP_CLIENT = this.whatsappClientService.getClient();
  }

  async handleMessage(message: any): Promise<void> {
    const user = await this.whatsappClientService.getUserById({
      id: message.from,
    });

    switch (user?.step) {
      case null:
        await this.handleStepZero(message);
        break;
      case 1:
        await this.handleStepOne(message);
        break;
      case 2:
        await this.handleStepTwo(message, user);
        break;
    }
  }

  private async handleStepZero(message: any): Promise<void> {
    this.WHATSAPP_CLIENT.sendMessage(
      message.from,
      await this.getNicksAndNamesFormatted(),
    );

    this.whatsappClientService.updateUser({
      id: message.from,
      step: 1,
    });
  }

  private async handleStepOne(message: any): Promise<void> {
    const response = await this.geminiClientService.generateContent(
      message.body,
      FURIA_AI_PLAYER_IDENTIFIER,
    );

    if (response.trim() === 'VOLTAR') {
      await this.whatsappClientService.deleteUser(message.from);
      await this.WHATSAPP_CLIENT.sendMessage(
        message.from,
        `Enviando você de volta para o menu inicial...`,
      );
      await this.WHATSAPP_CLIENT.sendMessage(
        message.from,
        `Envie uma mensagem para ver o menu inicial`,
      );
      return;
    }

    if (response.trim().split(/\s+/).length > 1) {
      await this.WHATSAPP_CLIENT.sendMessage(message.from, response.trim());
      return;
    }

    await this.whatsappClientService.updateUser({
      id: message.from,
      step: 2,
      playerChosen: response.trim(),
    });

    await this.WHATSAPP_CLIENT.sendMessage(
      message.from,
      `Você escolheu falar com ${response.trim()}, envie uma mensagem para iniciar a conversa!`,
    );
  }

  private async handleStepTwo(message: any, user: any): Promise<void> {
    const playerInfo = await this.getByNickname({
      nickname: user.playerChosen,
    });

    if (!playerInfo) {
      await this.WHATSAPP_CLIENT.sendMessage(
        message.from,
        `Desculpe, acontenceu um erro, tente novamente.`,
      );
      await this.whatsappClientService.deleteUser(message.from);
      return;
    }

    let chatContext = this.chatHistories.get(message.from);
    if (!chatContext) {
      chatContext = [];
      this.chatHistories.set(message.from, chatContext);
    }
    chatContext.push(`User: ${message.body}`);

    const response = await this.geminiClientService.generateContent(
      `Mensagem Atual: ${message.body}\n\n Histórico de mensagens: ${chatContext.join('\n')}`,
      FURIA_AI_PROMPT(playerInfo),
    );

    if (response.trim() === 'VOLTAR') {
      this.chatHistories.delete(message.from);
      this.LOGGER.log(this.chatHistories);

      await this.whatsappClientService.deleteUser(message.from);
      await this.WHATSAPP_CLIENT.sendMessage(
        message.from,
        `Enviando você de volta para o menu inicial...`,
      );
      await this.WHATSAPP_CLIENT.sendMessage(
        message.from,
        `Envie uma mensagem para ver o menu inicial`,
      );
      return;
    }

    chatContext.push(`${user.playerChosen}: ${response}`);

    await this.WHATSAPP_CLIENT.sendMessage(message.from, response.trim());
  }

  private async getByNickname(data: IGetByNickname): Promise<string | null> {
    this.LOGGER.log(
      `Buscando jogador/técnico por nickname: ${data.nickname}...`,
    );

    const entity = await this.furiaAiChatRepository.findOne({
      where: { nickname: data.nickname },
    });

    if (!entity) {
      this.LOGGER.warn(`Nenhum dado encontrado para ${data.nickname}`);
      return null;
    }

    const { nickname, name, game, position, nationality, description } = entity;
    const formatted =
      `Apelido: ${nickname}, Nome real: ${name}, Jogo: ${game}, Posição: ${position}, Nacionalidade: ${nationality}, Descrição: ${description}`.trim();

    return formatted;
  }

  private async getNicksAndNamesFormatted(): Promise<string> {
    this.LOGGER.log(`Buscando jogadores/técnicos...`);

    const entities = await this.furiaAiChatRepository.find({
      select: ['nickname', 'name'],
    });

    if (!entities || entities.length === 0) {
      this.LOGGER.warn(`Nenhum dado encontrado`);
      throw new NotFoundException('Nenhum jogador/técnico encontrado');
    }

    const formattedList =
      `*Com quem você quer falar?*\n` +
      `Digite o *número*, *nome* ou *nick* da pessoa desejada:\n\n` +
      entities
        .map(
          (e, i) =>
            `*${i + 1}.*\n👤 *Nick:* ${e.nickname}\n📛 *Nome:* ${e.name}\n`,
        )
        .join('\n');

    return formattedList;
  }
}
