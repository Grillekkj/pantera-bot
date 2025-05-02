import { Column, Entity, PrimaryColumn } from 'typeorm';
import { WhatsappClientUsersMenu } from './whatsapp-client-users-menu.enum';

@Entity('users')
export class UsersEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'enum', enum: WhatsappClientUsersMenu })
  menu: WhatsappClientUsersMenu;

  @Column({ nullable: true })
  step: number;

  @Column({ nullable: true })
  playerChosen: string;
}
