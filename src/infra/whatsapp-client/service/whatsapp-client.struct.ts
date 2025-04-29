export interface IWhatsappClientUser {
  id: string;
  menu: string;
  step: number | null;
}

export interface IRegisterUser {
  id: string;
  menu: string;
  step?: number;
}

export interface IUpdateUser {
  id: string;
  menu?: string | null;
  step?: number | null;
}

export interface IDeleteUser {
  id: string;
}

export interface IGetUser {
  id: string;
}
