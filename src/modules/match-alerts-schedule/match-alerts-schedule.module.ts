import { Module } from '@nestjs/common';
import { MatchAlertsScheduleService } from './service/match-alerts-schedule.service';
import { WhatsappClientModule } from 'src/infra/whatsapp-client/whatsapp-client.module';
import { MatchAlertsScheduleEntity } from './entity/match-alerts-schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiClientModule } from 'src/infra/gemini-client/gemini-client.module';
import { ActiveAlerts } from './entity/active-alerts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchAlertsScheduleEntity, ActiveAlerts]),
    WhatsappClientModule,
    GeminiClientModule,
  ],
  providers: [MatchAlertsScheduleService],
  exports: [MatchAlertsScheduleService],
})
export class MatchAlertsScheduleModule {}
