import { Injectable } from '@nestjs/common';
import { SubmenuHandler } from 'src/common/message-handler/submenu-handler.interface';
import { WhatsappClientService } from 'src/infra/whatsapp-client/service/whatsapp-client.service';
import { Client } from 'whatsapp-web.js';

@Injectable()
export class MatchAlertsScheduleService implements SubmenuHandler {
  private readonly WHATSAPP_CLIENT: Client;

  constructor(private readonly whatsappClientService: WhatsappClientService) {
    this.WHATSAPP_CLIENT = this.whatsappClientService.getClient();
  }

  async handleMessage(message: any): Promise<void> {}
}
