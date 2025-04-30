import { WhatsappClientUsersMenu } from '../entity/whatsapp-client-users-menu.enum';

export interface IWhatsappClientUser {
  id: string;
  menu: WhatsappClientUsersMenu;
  step: number | undefined;
}

export interface IRegisterUser {
  id: string;
  menu: WhatsappClientUsersMenu;
}

export interface IUpdateUser {
  id: string;
  menu?: WhatsappClientUsersMenu;
  step?: number;
}

export interface IDeleteUser {
  id: string;
}

export interface IGetUser {
  id: string;
}
