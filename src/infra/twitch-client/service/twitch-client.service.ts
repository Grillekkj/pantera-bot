import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectChatClient } from '@nestjs-twurple/chat';
import { ChatClient, ChatMessage } from '@twurple/chat';
import { environment } from 'src/configs/environment';

@Injectable()
export class TwitchClientService implements OnModuleInit {
  private readonly LOGGER = new Logger(TwitchClientService.name);

  constructor(
    @InjectChatClient()
    private readonly TWITCH_CLIENT: ChatClient,
  ) {
    this.TWITCH_CLIENT.onAuthenticationSuccess(async () => {
      await this.TWITCH_CLIENT.join(String(environment.twitch.USER_NAME));
    });
  }

  async onModuleInit(): Promise<void> {
    this.TWITCH_CLIENT.connect();
    this.LOGGER.log('Conectado ao Twitch Client com sucesso!');
  }

  public onMessage(
    handler: (
      channel: string,
      user: string,
      text: string,
      msg?: ChatMessage,
    ) => void,
  ): void {
    this.TWITCH_CLIENT.onMessage(handler);
  }

  public async sendMessage(channel: string, message: string): Promise<void> {
    await this.TWITCH_CLIENT.say(channel, message);
    this.LOGGER.log('Mensagem enviada com sucesso', message);
  }
}
