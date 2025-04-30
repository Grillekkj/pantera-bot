import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Client } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { WHATSAPP_CLIENT_OPTIONS } from '../../../configs/whatsapp-client.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entity/whatsapp-client-users.entity';
import {
  IDeleteUser,
  IGetUser,
  IRegisterUser,
  IUpdateUser,
  IWhatsappClientUser,
} from './whatsapp-client.struct';

@Injectable()
export class WhatsappClientService implements OnModuleInit {
  private readonly LOGGER: Logger = new Logger(WhatsappClientService.name);
  private readonly CLIENT: Client = new Client(WHATSAPP_CLIENT_OPTIONS);

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
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
      this.LOGGER.log('WhatsApp conectado com sucesso!');
    });

    await this.CLIENT.initialize();
  }

  public async registerUser(data: IRegisterUser): Promise<IWhatsappClientUser> {
    const user = await this.usersRepository.findOne({
      where: { id: data.id },
    });

    if (user) throw new ConflictException('Usuário já registrado.');

    const newUser = this.usersRepository.create(data);

    return await this.usersRepository.save(newUser);
  }

  public async getUserById(
    data: IGetUser,
  ): Promise<IWhatsappClientUser | null> {
    const user = await this.usersRepository.findOne({
      where: { id: data.id },
    });

    if (!user) return null;

    return user;
  }

  public async updateUser(data: IUpdateUser): Promise<IWhatsappClientUser> {
    const user = await this.usersRepository.findOne({
      where: { id: data.id },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return this.usersRepository.save(Object.assign(user, data));
  }

  public async deleteUser(data: IDeleteUser): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: data.id },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    await this.usersRepository.delete({ id: data.id });
  }

  public getClient(): Client {
    return this.CLIENT;
  }
}
