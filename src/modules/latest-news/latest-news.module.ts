import { Module } from '@nestjs/common';
import { LatestNewsService } from './service/latest-news.service';
import { WhatsappClientModule } from 'src/infra/whatsapp-client/whatsapp-client.module';
import { Draft5ScrapperModule } from '../draft5-scrapper/draft5-scrapper.module';

@Module({
  imports: [WhatsappClientModule, Draft5ScrapperModule],
  providers: [LatestNewsService],
  exports: [LatestNewsService],
})
export class LatestNewsModule {}
