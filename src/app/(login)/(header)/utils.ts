export type MenuItem = {
  url: string;
  name: string;
  showname?: string;
  order?: {
    teacher?: number;
    student?: number;
  };
}
export const mainMenu: MenuItem[] = [
  {
    url: "/",
    name: "정보",
    order: {
      teacher: 0,
      student: 0,
    },
  },
  {
    url: "/machine/washer",
    name: "세탁",
    showname: "세탁기 / 건조기",
    order: {
      teacher: 1,
      student: 1,
    },
  },
  {
    url: "/jasup/my",
    name: "자습",
    showname: "자습 위치 설정",
    order: {
      teacher: 4,
      student: 4,
    },
  },
  // {
  //   url: "/dm",
  //   name: "DM",
  //   showname: "다이랙트 메시지"
  // },
];

export const teachersMenu: MenuItem[] = [
  {
    url: "/teacher/wakeup",
    name: "기상",
    showname: "기상곡 목록",
    order: {
      teacher: 2,
    },
  },
  {
    url: "/teacher/edit",
    name: "잔류",
    showname: "잔류 / 외출 / 금귀",
    order: {
      teacher: 3,
    },
  },
  {
    url: "/teacher/settings/studyroom",
    name: "설정",
    showname: "설정",
    order: {
      teacher: 5,
    },
  },
];
export const studentsMenu: MenuItem[] = [
  {
    url: "/wakeup/list",
    name: "기상",
    showname: "기상곡 신청",
    order: {
      student: 2,
    },
  },
  {
    url: "/stay/apply",
    name: "잔류",
    showname: "잔류 / 외출 / 금귀",
    order: {
      student: 3,
    },
  },
  {
    url: "/bamboo",
    name: "대숲",
    showname: "대나무 숲",
    order: {
      student: 5,
    },
  }
];