import { Module } from '@nestjs/common';
import { Draft5ScrapperService } from './service/draft5-scrapper.service';

@Module({
  providers: [Draft5ScrapperService],
  exports: [Draft5ScrapperService],
})
export class Draft5ScrapperModule {}
