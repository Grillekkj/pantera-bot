import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'whatsapp-web.js';
import { GeminiClientService } from './infra/gemini-client/service/gemini-client.service';
import { WhatsappClientService } from './infra/whatsapp-client/service/whatsapp-client.service';
import { WhatsappClientUsersMenu } from './infra/whatsapp-client/entity/whatsapp-client-users-menu.enum';
import { menu } from './utils/menu';
import { FuriaAiChatService } from './modules/furia-ai-chat/service/furia-ai-chat.service';
import { SubmenuHandler } from './common/message-handler/submenu-handler.interface';
import { LatestNewsService } from './modules/latest-news/service/latest-news.service';
import { GamesHistoryService } from './modules/games-history/service/games-history.service';
import { OfficialStoreService } from './modules/official-store/service/official-store.service';
import { MatchAlertsScheduleService } from './modules/match-alerts-schedule/service/match-alerts-schedule.service';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly WHATSAPP_CLIENT: Client;
  private readonly submenuHandlers: Map<
    WhatsappClientUsersMenu,
    SubmenuHandler
  > = new Map();

  constructor(
    private readonly whatsappClientService: WhatsappClientService,
    private readonly geminiClientService: GeminiClientService,
    private readonly furiaAiChatService: FuriaAiChatService,
    private readonly latestNewsService: LatestNewsService,
    private readonly gamesHistoryService: GamesHistoryService,
    private readonly officialStoreService: OfficialStoreService,
    private readonly matchAlertsScheduleService: MatchAlertsScheduleService,
  ) {
    this.WHATSAPP_CLIENT = this.whatsappClientService.getClient();
    this.registerSubmenuHandlers();
  }

  private registerSubmenuHandlers() {
    this.submenuHandlers.set(
      WhatsappClientUsersMenu.FURIA_AI_CHAT,
      this.furiaAiChatService,
    );

    this.submenuHandlers.set(
      WhatsappClientUsersMenu.LATEST_NEWS,
      this.latestNewsService,
    );

    this.submenuHandlers.set(
      WhatsappClientUsersMenu.GAMES_HISTORY,
      this.gamesHistoryService,
    );

    this.submenuHandlers.set(
      WhatsappClientUsersMenu.OFFICIAL_STORE,
      this.officialStoreService,
    );

    this.submenuHandlers.set(
      WhatsappClientUsersMenu.MATCH_ALERTS_SCHEDULE,
      this.matchAlertsScheduleService,
    );
  }

  async onModuleInit() {
    this.WHATSAPP_CLIENT.on('message', async (message) => {
      const { type, body, from } = message;

      if (
        from.includes('@g.us') ||
        from.includes('status@broadcast') ||
        type === 'protocol'
      ) {
        return;
      }

      const user = await this.whatsappClientService.getUserById({ id: from });

      if (user === null) {
        await this.whatsappClientService.registerUser({
          id: from,
          menu: WhatsappClientUsersMenu.INITIAL,
        });

        await this.WHATSAPP_CLIENT.sendMessage(from, menu);
        return;
      }

      if (user.menu !== WhatsappClientUsersMenu.INITIAL) {
        const handler = this.submenuHandlers.get(user.menu);

        if (handler) {
          await handler.handleMessage(message);
          return;
        }

        await this.whatsappClientService.updateUser({
          id: from,
          menu: WhatsappClientUsersMenu.INITIAL,
        });

        await this.WHATSAPP_CLIENT.sendMessage(
          from,
          'Menu não disponível. Voltando ao menu principal.',
        );

        await this.WHATSAPP_CLIENT.sendMessage(from, menu);
        return;
      }

      const response = await this.geminiClientService.generateContent(body);
      const hasNumber = /^\d+$/.test(String(response).trim());

      if (hasNumber) {
        switch (Number(response)) {
          case 1:
            await this.updateUserMenuAndReply(
              from,
              WhatsappClientUsersMenu.LATEST_NEWS,
              'Você escolheu a opção 1! Aguarde enquanto busco as últimas notícias!',
            );

            await this.submenuHandlers
              .get(WhatsappClientUsersMenu.LATEST_NEWS)
              ?.handleMessage(message);
            break;
          case 2:
            await this.updateUserMenuAndReply(
              from,
              WhatsappClientUsersMenu.GAMES_HISTORY,
              'Você escolheu a opção 2! Aguarde enquanto busco as últimas estatísticas!',
            );

            await this.submenuHandlers
              .get(WhatsappClientUsersMenu.GAMES_HISTORY)
              ?.handleMessage(message);
            break;
          case 3:
            await this.updateUserMenuAndReply(
              from,
              WhatsappClientUsersMenu.MATCH_ALERTS_SCHEDULE,
              'Você escolheu a opção 3! Anote as datas e horários dos jogos ou ative os alertas!',
            );

            await this.submenuHandlers
              .get(WhatsappClientUsersMenu.MATCH_ALERTS_SCHEDULE)
              ?.handleMessage(message);
            break;
          case 4:
            await this.updateUserMenuAndReply(
              from,
              WhatsappClientUsersMenu.LIVE_GAME_STATUS,
              'Você escolheu a opção 4! Infelizmente essa opção ainda não está disponível!',
            );
            break;
          case 5:
            await this.updateUserMenuAndReply(
              from,
              WhatsappClientUsersMenu.FURIA_AI_CHAT,
              'Você escolheu a opção 5! Se prepare para uma experiencia incrível!',
            );

            await this.submenuHandlers
              .get(WhatsappClientUsersMenu.FURIA_AI_CHAT)
              ?.handleMessage(message);
            break;
          case 6:
            await this.updateUserMenuAndReply(
              from,
              WhatsappClientUsersMenu.OFFICIAL_STORE,
              'Você escolheu a opção 6! Aproveite as promoções!',
            );

            await this.submenuHandlers
              .get(WhatsappClientUsersMenu.OFFICIAL_STORE)
              ?.handleMessage(message);
            break;
          case 7:
            await this.WHATSAPP_CLIENT.sendMessage(from, menu);
            break;
        }
        return;
      }

      await this.WHATSAPP_CLIENT.sendMessage(from, String(response));
    });
  }

  private async updateUserMenuAndReply(
    from: string,
    menuOption: WhatsappClientUsersMenu,
    message: string,
  ): Promise<void> {
    await this.whatsappClientService.updateUser({
      id: from,
      menu: menuOption,
    });

    await this.WHATSAPP_CLIENT.sendMessage(from, message);
  }
}
