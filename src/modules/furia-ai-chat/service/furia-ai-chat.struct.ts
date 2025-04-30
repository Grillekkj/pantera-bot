export interface IFuriaAiChat {
  id: string;
  nickname: string;
  name: string;
  game: string;
  position: string;
  nationality: string;
  description: string;
}

export interface IGetByNicknameOrName {
  nickname?: string;
  name?: string;
}
