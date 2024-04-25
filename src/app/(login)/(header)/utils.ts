type MenuItem = {
  url: string;
  name: string;
}

export const mainMenu: MenuItem[] = [
  {
    url: "/",
    name: "정보",
  },
  {
    url: "/wakeup/list",
    name: "기상",
  },
  {
    url: "/machine/washer",
    name: "세탁",
  },
  {
    url: "/stay/apply",
    name: "잔류",
  },
  {
    url: "/jasup/my",
    name: "자습",
  },
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
  }
];