import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuriaAiChatEntity } from './entity/furia-ai-chat.entity';
import { FuriaAiChatService } from './service/furia-ai-chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([FuriaAiChatEntity])],
  providers: [FuriaAiChatService],
  exports: [FuriaAiChatService],
})
export class FuriaAiChatModule {}
