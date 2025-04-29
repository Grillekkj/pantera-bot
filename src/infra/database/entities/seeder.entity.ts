import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seeders')
export default class Seeder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
  })
  timestamp: number;

  @Column()
  name: string;
}
