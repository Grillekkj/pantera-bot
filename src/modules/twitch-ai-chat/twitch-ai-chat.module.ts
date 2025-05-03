import { Module } from '@nestjs/common';
import { TwitchClientModule } from 'src/infra/twitch-client/twitch-client.module';
import { TwitchAiChatService } from './service/twitch-ai-chat.service';
import { GeminiClientModule } from 'src/infra/gemini-client/gemini-client.module';

@Module({
  imports: [TwitchClientModule, GeminiClientModule],
  providers: [TwitchAiChatService],
  exports: [TwitchAiChatService],
})
export class TwitchAiChatModule {}
