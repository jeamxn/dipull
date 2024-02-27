export type UserData = {
  id: string;
  profile_image: string;
  thumbnail_image: string;
  gender: string;
  name: string;
  number: number;
}

export const defaultUserData: UserData = {
  id: "",
  profile_image: "",
  thumbnail_image: "",
  gender: "",
  name: "",
  number: 0,
};

export type TokenInfo = {
  id: string;
  data: UserData;
}

export type DB_userData = UserData & {
  refreshToken: string;
}