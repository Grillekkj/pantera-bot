import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { environment } from 'src/configs/environment';

@Injectable()
export class GeminiClientService {
  private readonly LOGGER = new Logger(GeminiClientService.name);
  private readonly ai = new GoogleGenAI({
    apiKey: environment.gemini.API_KEY,
  });
  private readonly defaultConfig = {
    temperature: 0.9,
    maxOutputTokens: 1024,
    responseMimeType: 'text/plain',
    systemInstruction: [
      {
        text: `Você é o Pantera Bot, assistente virtual da FURIA. Seu objetivo é guiar o usuário no menu abaixo:

 1 - Últimas Notícias
 2 - Agenda de Jogos
 3 - Histórico de Conquistas
 4 - Alerta de Partidas
 5 - Live Status dos Jogos (Em breve)
 6 - Conversa com Jogadores (IA)
 7 - Loja Oficial

Regras:
- Analise a mensagem do usuário.
- Se a mensagem encaixar em alguma opção do menu, responda apenas com o número correspondente.
- Se não encaixar, crie na hora uma resposta negativa curta e amigável, seguindo o estilo dos exemplos abaixo mas invente variações semelhantes, mantendo o tom divertido, competitivo e informal, evite usar as frases do exemplo abaixo e troque o [emoji] por um emoji:
  - "Não encontrei essa opção, tenta outra aí, FURIOSO! [emoji]"
  - "Essa não tá no nosso menu. Escolhe outra pra gente avançar! [emoji]"
  - "Pantera não entendeu essa... dá mais uma olhada no menu! [emoji]"
  - "Hmm... opção inválida. Bora de novo, FURIOSO! [emoji]"
- Seja sempre rápido como um jogador da FURIA em ação.

Importante: Não explique o menu neste momento. Só guie o usuário pra uma escolha correta.`,
      },
    ],
  };

  public async generateContent(inputText: string, systemInstruction?: string) {
    const config = {
      ...this.defaultConfig,
    };

    if (systemInstruction) {
      config.systemInstruction = [
        {
          text: systemInstruction,
        },
      ];
    }

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: inputText,
          },
        ],
      },
    ];

    try {
      const response = await this.ai.models.generateContent({
        model: environment.gemini.MODEL_NAME,
        config,
        contents,
      });
      this.LOGGER.log(
        'Resposta do Gemini:',
        response.candidates?.[0]?.content?.parts?.[0]?.text,
      );
      return response.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      this.LOGGER.error(
        'Erro gerando conteúdo, tentando com outro modelo...',
        error,
      );
      try {
        const response = await this.ai.models.generateContent({
          model: environment.gemini.MODEL_NAME2,
          config,
          contents,
        });
        this.LOGGER.log(
          'Resposta do Gemini:',
          response.candidates?.[0]?.content?.parts?.[0]?.text,
        );
        return response.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (error) {
        this.LOGGER.error('Erro gerando conteúdo', error);
        throw error;
      }
    }
  }
}
