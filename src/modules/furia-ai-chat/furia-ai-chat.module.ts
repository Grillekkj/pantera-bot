import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuriaAiChatEntity } from './entity/furia-ai-chat.entity';
import { FuriaAiChatService } from './service/furia-ai-chat.service';
import { WhatsappClientModule } from 'src/infra/whatsapp-client/whatsapp-client.module';
import { GeminiClientModule } from 'src/infra/gemini-client/gemini-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuriaAiChatEntity]),
    WhatsappClientModule,
    GeminiClientModule,
  ],
  providers: [FuriaAiChatService],
  exports: [FuriaAiChatService],
})
export class FuriaAiChatModule {}
