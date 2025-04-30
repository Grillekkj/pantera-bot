import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'whatsapp-web.js';
import { GeminiClientService } from './infra/gemini-client/service/gemini-client.service';
import { WhatsappClientService } from './infra/whatsapp-client/service/whatsapp-client.service';
import { WhatsappClientUsersMenu } from './infra/whatsapp-client/entity/whatsapp-client-users-menu.enum';
import { menu } from './utils/menu';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly WHATSAPP_CLIENT: Client;
  constructor(
    private readonly whatsappClientService: WhatsappClientService,
    private readonly geminiClientService: GeminiClientService,
  ) {
    this.WHATSAPP_CLIENT = this.whatsappClientService.getClient();
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
      }

      if (user?.menu !== WhatsappClientUsersMenu.INITIAL) return;

      if (
        user?.menu === WhatsappClientUsersMenu.INITIAL &&
        body.toLowerCase() === 'menu'
      ) {
        await this.WHATSAPP_CLIENT.sendMessage(from, menu);
        return;
      }

      const response = await this.geminiClientService.generateContent(body);
      const hasNumber = /^\d+$/.test(String(response).trim());

      if (hasNumber) {
        switch (Number(response)) {
          case 1:
            await this.whatsappClientService.updateUser({
              id: from,
              menu: WhatsappClientUsersMenu.LATEST_NEWS,
            });

            await this.WHATSAPP_CLIENT.sendMessage(
              from,
              'Você escolheu a opção 1!',
            );
            break;
          case 2:
            await this.whatsappClientService.updateUser({
              id: from,
              menu: WhatsappClientUsersMenu.MATCH_SCHEDULE,
            });

            await this.WHATSAPP_CLIENT.sendMessage(
              from,
              'Você escolheu a opção 2!',
            );
            break;
          case 3:
            await this.whatsappClientService.updateUser({
              id: from,
              menu: WhatsappClientUsersMenu.TROPHY_HISTORY,
            });

            await this.WHATSAPP_CLIENT.sendMessage(
              from,
              'Você escolheu a opção 3!',
            );
            break;
          case 4:
            await this.whatsappClientService.updateUser({
              id: from,
              menu: WhatsappClientUsersMenu.MATCH_ALERTS,
            });

            await this.WHATSAPP_CLIENT.sendMessage(
              from,
              'Você escolheu a opção 4!',
            );
            break;
          case 5:
            await this.whatsappClientService.updateUser({
              id: from,
              menu: WhatsappClientUsersMenu.LIVE_GAME_STATUS,
            });

            await this.WHATSAPP_CLIENT.sendMessage(
              from,
              'Você escolheu a opção 5!',
            );
            break;
          case 6:
            await this.whatsappClientService.updateUser({
              id: from,
              menu: WhatsappClientUsersMenu.FURIA_AI_CHAT,
            });

            await this.WHATSAPP_CLIENT.sendMessage(
              from,
              'Você escolheu a opção 6!',
            );
            break;
          case 7:
            await this.whatsappClientService.updateUser({
              id: from,
              menu: WhatsappClientUsersMenu.OFFICIAL_STORE,
            });

            await this.WHATSAPP_CLIENT.sendMessage(
              from,
              'Você escolheu a opção 7!',
            );
            break;
        }
        return;
      }

      await this.WHATSAPP_CLIENT.sendMessage(from, String(response));
    });
  }
}
