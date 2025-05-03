import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { GeminiClientService } from 'src/infra/gemini-client/service/gemini-client.service';
import { TwitchClientService } from 'src/infra/twitch-client/service/twitch-client.service';

@Injectable()
export class TwitchAiChatService implements OnApplicationBootstrap {
  private readonly LOGGER = new Logger(TwitchAiChatService.name);
  private canAnswer = true;

  constructor(
    private readonly twitchClientService: TwitchClientService,
    private readonly geminiClientService: GeminiClientService,
  ) {}

  async onApplicationBootstrap() {
    this.listenToMessages();
  }

  private listenToMessages() {
    this.twitchClientService.onMessage(async (channel, user, text, msg) => {
      if (
        text.toLowerCase().includes('pantera') ||
        text.toLowerCase().includes('@furiapanterabot')
      ) {
        if (this.canAnswer) {
          this.canAnswer = false;
          try {
            let response = await this.geminiClientService.generateContent(
              `O usuário ${user} disse: "${text}".`,
              `Você é um bot da twitch no canal da "FURIAtv" e seu nome é "PanteraBot". Sua função no chat é responder as mensagens enviadas a você de forma que pareça que você é um integrante do chat, você precisa seguir o tom da mensagem que foi enviada a você e se manter no assunto da mensagem enviada a você. Lembre-se de sempre seguir todas as {{regras}} {{regras: Escreva sempre sem nenhuma acentuação, Escreva sempre com todas as letras minúsculas, Escreva sempre em primeira pessoa como PanteraBot}}`,
            );
            if (response.startsWith('/') || response.startsWith('!')) {
              response = response.substring(1);
            }
            await this.twitchClientService.sendMessage(channel, response);
            this.LOGGER.log(`Resposta enviada para ${user}: ${response}`);
          } catch (error) {
            this.LOGGER.error('Erro ao responder mensagem:', error.message);
          }
          setTimeout(() => {
            this.canAnswer = true;
          }, 15000);
        }
      } else {
        return;
      }
    });
  }
}
