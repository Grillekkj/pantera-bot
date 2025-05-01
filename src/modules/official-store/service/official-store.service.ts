import { Injectable } from '@nestjs/common';
import { SubmenuHandler } from 'src/common/message-handler/submenu-handler.interface';
import { WhatsappClientService } from 'src/infra/whatsapp-client/service/whatsapp-client.service';
import { Client } from 'whatsapp-web.js';

@Injectable()
export class OfficialStoreService implements SubmenuHandler {
  private readonly WHATSAPP_CLIENT: Client;

  constructor(private readonly whatsappClientService: WhatsappClientService) {
    this.WHATSAPP_CLIENT = this.whatsappClientService.getClient();
  }

  async handleMessage(message: any): Promise<void> {
    await this.whatsappClientService.deleteUser(message.from);

    await this.WHATSAPP_CLIENT.sendMessage(
      message.from,
      'Vista o estilo FURIA: moda para quem vive o jogo!\n\nAcesse nossa loja oficial e descubra as últimas novidades em roupas e acessórios inspirados na nossa equipe. Não perca a chance de mostrar seu apoio com estilo!\n\nClique aqui para visitar a loja: https://www.furia.gg/',
    );
  }
}
