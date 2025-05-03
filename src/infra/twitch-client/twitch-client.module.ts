import { Module } from '@nestjs/common';
import { TwitchClientService } from './service/twitch-client.service';

@Module({
  providers: [TwitchClientService],
  exports: [TwitchClientService],
})
export class TwitchClientModule {}
