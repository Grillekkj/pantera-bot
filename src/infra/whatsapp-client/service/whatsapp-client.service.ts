import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { WHATSAPP_CLIENT_OPTIONS } from '../../../configs/whatsapp-client.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entity/whatsapp-client-users.entity';

@Injectable()
export class WhatsappClientService implements OnModuleInit {
  private readonly LOGGER: Logger = new Logger(WhatsappClientService.name);
  private readonly CLIENT: Client = new Client(WHATSAPP_CLIENT_OPTIONS);
  private isInitialized = false;

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersEntity: Repository<UsersEntity>,
  ) {}

  async onModuleInit() {
    this.LOGGER.log('Conectando ao WhatsApp...');
    this.LOGGER.log('Aguarde o QR Code ou a reconexão...');
    this.LOGGER.log(
      'Caso tenha problemas, delete a pasta ./wwebjs_auth, ./wwebjs_cache e reinicie o servidor.',
    );
    await this.connectWhatsapp();
  }

  private async connectWhatsapp() {
    this.CLIENT.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
      this.LOGGER.log('QR Code gerado. Por favor, escaneie com o WhatsApp.');
    });

    this.CLIENT.on('ready', () => {
      this.isInitialized = true;
      this.LOGGER.log('WhatsApp conectado com sucesso!');
    });

    await this.CLIENT.initialize();
  }

  public getClient(): Client {
    if (!this.isInitialized) {
      this.LOGGER.warn(
        'Cliente WhatsApp ainda não está totalmente inicializado',
      );
    }
    return this.CLIENT;
  }
}
