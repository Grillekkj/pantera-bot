import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ActiveAlertsMatches } from '../service/match-alerts-schedule.struct';

@Entity('active_alerts')
export class ActiveAlerts {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'jsonb' })
  matches: ActiveAlertsMatches[];
}
