import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { environment } from 'src/configs/environment';
import { GEMINI_CLIENT_OPTIONS } from 'src/configs/gemini-client.config';

@Injectable()
export class GeminiClientService {
  private readonly LOGGER = new Logger(GeminiClientService.name);
  private readonly ai = new GoogleGenAI({
    apiKey: environment.gemini.API_KEY,
  });

  public async generateContent(inputText: string, systemInstruction?: string) {
    const config = {
      ...GEMINI_CLIENT_OPTIONS,
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
