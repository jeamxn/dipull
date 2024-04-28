export type MenuItem = {
  url: string;
  name: string;
  showname?: string;
}

export const mainMenu: MenuItem[] = [
  {
    url: "/",
    name: "정보",
  },
  {
    url: "/wakeup/list",
    name: "기상",
    showname: "기상곡 신청"
  },
  {
    url: "/machine/washer",
    name: "세탁",
    showname: "세탁기 / 건조기"
  },
  {
    url: "/stay/apply",
    name: "잔류",
    showname: "잔류 / 외출 / 금귀"
  },
  {
    url: "/jasup/my",
    name: "자습",
    showname: "자습 위치 설정"
  },
  // {
  //   url: "/dm",
  //   name: "DM",
  //   showname: "다이랙트 메시지"
  // },
];

export const teachersMenu: MenuItem[] = [
  {
    url: "/teacher/edit",
    name: "관리",
  }
];
export const studentsMenu: MenuItem[] = [
  {
    url: "/bamboo",
    name: "대숲",
    showname: "대나무 숲",
  }
];