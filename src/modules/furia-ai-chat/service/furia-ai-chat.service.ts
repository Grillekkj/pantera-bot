import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuriaAiChatEntity } from '../entity/furia-ai-chat.entity';
import { Repository } from 'typeorm';
import { IFuriaAiChat, IGetByNicknameOrName } from './furia-ai-chat.struct';

@Injectable()
export class FuriaAiChatService {
  private readonly LOGGER = new Logger(FuriaAiChatService.name);

  constructor(
    @InjectRepository(FuriaAiChatEntity)
    private readonly furiaAiChatRepository: Repository<FuriaAiChatEntity>,
  ) {}

  public async getByNicknameOrName(
    data: IGetByNicknameOrName,
  ): Promise<IFuriaAiChat> {
    const searchTerm = data.nickname ?? data.name;

    this.LOGGER.log(
      `Buscando jogador/técnico por nickname ou nome: ${searchTerm}...`,
    );

    const entity = await this.furiaAiChatRepository.findOne({
      where: [{ nickname: data.nickname }, { name: data.name }],
    });

    if (!entity) {
      this.LOGGER.warn(`Nenhum dado encontrado para ${searchTerm}`);
      throw new NotFoundException(
        'Nenhum jogador/técnico com esse nome/nick encontrado',
      );
    }

    return entity;
  }

  public async getNicksAndNamesFormatted(): Promise<string> {
    this.LOGGER.log(`Buscando jogadores/técnicos...`);

    const entities = await this.furiaAiChatRepository.find({
      select: ['nickname', 'name'],
    });

    if (!entities || entities.length === 0) {
      this.LOGGER.warn(`Nenhum dado encontrado`);
      throw new NotFoundException('Nenhum jogador/técnico encontrado');
    }

    const formattedList = entities
      .map((e) => `${e.nickname} ${e.name}`)
      .join('\n');

    return formattedList;
  }
}
