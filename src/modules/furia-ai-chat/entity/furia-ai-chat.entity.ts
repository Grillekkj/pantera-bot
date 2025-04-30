import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('furia_ai_chat')
export class FuriaAiChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nickname: string;

  @Column()
  name: string;

  @Column()
  game: string;

  @Column()
  position: string;

  @Column()
  nationality: string;

  @Column()
  description: string;
}
