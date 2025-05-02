import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubmenuHandler } from 'src/common/message-handler/submenu-handler.interface';
import { WhatsappClientService } from 'src/infra/whatsapp-client/service/whatsapp-client.service';
import { Client } from 'whatsapp-web.js';
import { MatchAlertsScheduleEntity } from '../entity/match-alerts-schedule.entity';
import { Repository } from 'typeorm';
import { GeminiClientService } from 'src/infra/gemini-client/service/gemini-client.service';
import {
  ActiveAlertsMatches,
  MATCH_ALERTS_SCHEDULE_IDENTIFIER,
} from './match-alerts-schedule.struct';
import { ActiveAlerts } from '../entity/active-alerts.entity';
import * as cron from 'node-cron';

@Injectable()
export class MatchAlertsScheduleService
  implements SubmenuHandler, OnModuleInit
{
  private readonly WHATSAPP_CLIENT: Client;

  constructor(
    @InjectRepository(MatchAlertsScheduleEntity)
    private readonly matchAlertsScheduleRepository: Repository<MatchAlertsScheduleEntity>,
    @InjectRepository(ActiveAlerts)
    private readonly activeAlertsRepository: Repository<ActiveAlerts>,
    private readonly whatsappClientService: WhatsappClientService,
    private readonly geminiClientService: GeminiClientService,
  ) {
    this.WHATSAPP_CLIENT = this.whatsappClientService.getClient();
  }

  async onModuleInit() {
    await this.scheduleAlerts();
  }

  private async scheduleAlerts(): Promise<void> {
    const activeAlerts = await this.activeAlertsRepository.find();

    activeAlerts.forEach((alert) => {
      alert.matches.forEach((match) => {
        const gameDate = new Date(match.matchAt);
        const cronTime = `${gameDate.getSeconds()} ${gameDate.getMinutes()} ${gameDate.getHours()} ${gameDate.getDate()} ${gameDate.getMonth() + 1} *`;

        cron.schedule(cronTime, async () => {
          await this.WHATSAPP_CLIENT.sendMessage(alert.id, match.message);
          await this.removeAlertFromUser(alert.id, gameDate.getTime());
        });
      });
    });
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
    }
  }

  private async handleStepZero(message: any): Promise<void> {
    const games = await this.getGames();
    const formattedGames = this.formatGamesToWhatsapp(games);

    await this.WHATSAPP_CLIENT.sendMessage(
      message.from,
      `⚠️ *Partidas agendadas da FURIA:*\nSe quiser receber alertas quando o jogo começar, diga quais jogos você quer receber o alerta. Caso queira voltar, peça pelo menu inicial.\n${formattedGames}`,
    );

    await this.whatsappClientService.updateUser({
      id: message.from,
      step: 1,
    });
  }

  private async handleStepOne(message: any): Promise<void> {
    const response = await this.geminiClientService.generateContent(
      message.body,
      MATCH_ALERTS_SCHEDULE_IDENTIFIER(
        await this.getGames().then((games) =>
          this.formatGamesToWhatsapp(games),
        ),
      ),
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

    const isValid = /^(\d+\s*)(,\s*\d+\s*)*$/.test(response.trim());
    if (!isValid) {
      await this.WHATSAPP_CLIENT.sendMessage(message.from, response);
      return;
    }

    const gameIds = response.split(',').map((id) => id.trim());
    const games = await this.getGames();
    const selectedGames = games.filter((game) =>
      gameIds.includes(game.id.toString()),
    );

    await this.WHATSAPP_CLIENT.sendMessage(
      message.from,
      'Estamos agendando seus alertas, aguarde...',
    );

    for (const game of selectedGames) {
      const alertMessage = await this.generateGameAlertMessage(game);
      await this.saveAlertMessage(message.from, game, alertMessage);

      const gameDate = new Date(game.matchAt);
      const cronTime = `${gameDate.getSeconds()} ${gameDate.getMinutes()} ${gameDate.getHours()} ${gameDate.getDate()} ${gameDate.getMonth() + 1} *`;

      cron.schedule(cronTime, async () => {
        await this.WHATSAPP_CLIENT.sendMessage(message.from, alertMessage);
        await this.removeAlertFromUser(message.from, gameDate.getTime());
      });
    }

    await this.WHATSAPP_CLIENT.sendMessage(
      message.from,
      `✅ Alertas salvos com sucesso! Você receberá uma mensagem quando o jogo começar.`,
    );

    await this.whatsappClientService.deleteUser(message.from);
  }

  private async generateGameAlertMessage(
    game: MatchAlertsScheduleEntity,
  ): Promise<string> {
    const formattedDate = this.formatDate(game.matchAt);

    const alertMsg = await this.geminiClientService.generateContent(
      ` 
      Crie uma mensagem de alerta com as informações abaixo do jogo contra a FURIA:
  
      Jogo: ${game.game}
      Oponente: ${game.opponent}
      Torneio: ${game.tournament}
      Fase: ${game.stage}
      Data e Hora: ${formattedDate}
      Online: ${game.isOnline ? 'Sim' : 'Não'}
      Link da Stream: ${game.streamLink || 'Não informado'}
      
      A mensagem deve ser amigável, informativa e engajante, para notificar o usuário sobre o jogo.
    `,
      'Você é um assistente que gera mensagens de alerta para jogos de esportes.',
    );

    return String(alertMsg);
  }

  private async removeAlertFromUser(
    userId: string,
    matchTimestamp: number,
  ): Promise<void> {
    const alert = await this.activeAlertsRepository.findOne({
      where: { id: userId },
    });

    if (!alert) return;

    alert.matches = alert.matches.filter(
      (m) => new Date(m.matchAt).getTime() !== matchTimestamp,
    );

    if (alert.matches.length === 0) {
      await this.activeAlertsRepository.delete({ id: userId });
    } else {
      await this.activeAlertsRepository.save(alert);
    }
  }

  private async saveAlertMessage(
    userId: string,
    game: MatchAlertsScheduleEntity,
    message: string,
  ): Promise<void> {
    const existing = await this.activeAlertsRepository.findOne({
      where: { id: userId },
    });

    const newEntry: ActiveAlertsMatches = {
      matchAt: game.matchAt,
      message,
    };

    if (existing) {
      existing.matches.push(newEntry);
      await this.activeAlertsRepository.save(existing);
    } else {
      const newAlert = this.activeAlertsRepository.create({
        id: userId,
        matches: [newEntry],
      });
      await this.activeAlertsRepository.save(newAlert);
    }
  }

  private formatGamesToWhatsapp(games: MatchAlertsScheduleEntity[]): string {
    if (!games.length) {
      return '⚠️ Nenhuma partida da FURIA agendada no momento.';
    }

    const lines = games.map((game) => {
      const dateFormatted = this.formatDate(game.matchAt);
      const location = game.isOnline ? '💻 Online' : '🏦 Presencial';
      const stream = game.streamLink
        ? `🔗 Stream: ${game.streamLink}`
        : '🔴 Stream não informada';

      return `🎮 *Jogo ${game.id}*:
  📅 ${dateFormatted}
  🆚 ${game.opponent}
  🕹️ ${game.game}
  🏆 ${game.tournament} – ${game.stage}
  ${location}
  ${stream}
  `;
    });

    return lines.join('\n');
  }

  private formatDate(date: Date): string {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });
  }

  private async getGames(): Promise<MatchAlertsScheduleEntity[]> {
    return this.matchAlertsScheduleRepository.find({
      order: {
        matchAt: 'ASC',
      },
    });
  }
}
