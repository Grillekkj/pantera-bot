import { Module } from '@nestjs/common';
import { MatchAlertsScheduleService } from './service/match-alerts-schedule.service';
import { WhatsappClientModule } from 'src/infra/whatsapp-client/whatsapp-client.module';

@Module({
  imports: [WhatsappClientModule],
  providers: [MatchAlertsScheduleService],
  exports: [MatchAlertsScheduleService],
})
export class MatchAlertsScheduleModule {}
