import { Injectable } from '@nestjs/common';
import { SubmenuHandler } from 'src/common/message-handler/submenu-handler.interface';
import { WhatsappClientService } from 'src/infra/whatsapp-client/service/whatsapp-client.service';
import { Draft5ScrapperService } from 'src/modules/draft5-scrapper/service/draft5-scrapper.service';
import { Client } from 'whatsapp-web.js';

@Injectable()
export class LatestNewsService implements SubmenuHandler {
  private readonly WHATSAPP_CLIENT: Client;

  constructor(
    private readonly whatsappClientService: WhatsappClientService,
    private readonly draft5ScrapperService: Draft5ScrapperService,
  ) {
    this.WHATSAPP_CLIENT = this.whatsappClientService.getClient();
  }

  async handleMessage(message: any): Promise<void> {
    await this.whatsappClientService.deleteUser(message.from);

    await this.WHATSAPP_CLIENT.sendMessage(
      message.from,
      await this.draft5ScrapperService.getLatestNews(),
    );
  }
}
