export type UserInfo = {
  id: string;
  gender: string;
  name: string;
  number: number;
};

export type UserInfoResponse = {
  message: string;
  data: UserInfo[];
};