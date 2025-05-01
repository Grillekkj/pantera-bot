import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('match_alerts_schedule')
export class MatchAlertsScheduleEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'timestamp' })
  matchAt: Date;

  @Column()
  opponent: string;

  @Column()
  game: string;

  @Column()
  tournament: string;

  @Column()
  stage: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ nullable: true })
  streamLink: string;
}
