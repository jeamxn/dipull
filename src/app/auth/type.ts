export type UserData = {
  id: string;
  profile_image: string;
  gender: string;
  name: string;
  number: number;
  type: "student" | "teacher";
}

export type UserDB = UserData & {
  _id: string;
  refreshToken: string;
}

export const defaultUserData: UserData = {
  id: "",
  profile_image: "",
  gender: "",
  name: "",
  type: "student",
  number: 0,
};

export type TokenInfo = {
  id: string;
  data: UserData;
}

export type DB_userData = UserData & {
  refreshToken: string;
}