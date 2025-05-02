import { Module } from '@nestjs/common';
import { GamesHistoryService } from './service/games-history.service';
import { WhatsappClientModule } from 'src/infra/whatsapp-client/whatsapp-client.module';
import { Draft5ScrapperModule } from '../draft5-scrapper/draft5-scrapper.module';

@Module({
  imports: [WhatsappClientModule, Draft5ScrapperModule],
  providers: [GamesHistoryService],
  exports: [GamesHistoryService],
})
export class GamesHistoryModule {}
