import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'whatsapp-web.js';
import { GeminiClientService } from './infra/gemini-client/service/gemini-client.service';
import { WhatsappClientService } from './infra/whatsapp-client/service/whatsapp-client.service';
import { WhatsappClientUsersMenu } from './infra/whatsapp-client/entity/whatsapp-client-users-menu.enum';
import { menu } from './utils/menu';
import { FuriaAiChatService } from './modules/furia-ai-chat/service/furia-ai-chat.service';
import { SubmenuHandler } from './common/message-handler/submenu-handler.interface';

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
  ) {
    this.WHATSAPP_CLIENT = this.whatsappClientService.getClient();
    this.registerSubmenuHandlers();
  }

  private registerSubmenuHandlers() {
    this.submenuHandlers.set(
      WhatsappClientUsersMenu.FURIA_AI_CHAT,
      this.furiaAiChatService,
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
              'Você escolheu a opção 1!',
            );
            break;
          case 2:
            await this.updateUserMenuAndReply(
              from,
              WhatsappClientUsersMenu.MATCH_SCHEDULE,
              'Você escolheu a opção 2!',
            );
            break;
          case 3:
            await this.updateUserMenuAndReply(
              from,
              WhatsappClientUsersMenu.TROPHY_HISTORY,
              'Você escolheu a opção 3!',
            );
            break;
          case 4:
            await this.updateUserMenuAndReply(
              from,
              WhatsappClientUsersMenu.MATCH_ALERTS,
              'Você escolheu a opção 4!',
            );
            break;
          case 5:
            await this.updateUserMenuAndReply(
              from,
              WhatsappClientUsersMenu.LIVE_GAME_STATUS,
              'Você escolheu a opção 5!',
            );
            break;
          case 6:
            await this.updateUserMenuAndReply(
              from,
              WhatsappClientUsersMenu.FURIA_AI_CHAT,
              'Você escolheu a opção 6!',
            );

            await this.submenuHandlers
              .get(WhatsappClientUsersMenu.FURIA_AI_CHAT)
              ?.handleMessage(message);
            break;
          case 7:
            await this.updateUserMenuAndReply(
              from,
              WhatsappClientUsersMenu.OFFICIAL_STORE,
              'Você escolheu a opção 7!',
            );
            break;
          case 8:
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
