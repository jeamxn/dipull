import "moment-timezone";
import moment from "moment";

import { getStates } from "@/utils/getStates";

export const getApplyStartTime = async () => {
  const states = await getStates("machine");
  if(states?.start) {
    return moment(states.start, "HH:mm").format("HH:mm");
  }
  return moment("08:00", "HH:mm").format("HH:mm");
};

export const getApplyEndTime = async () => {
  const states = await getStates("machine");
  if(states?.end) {
    return moment(states.end, "HH:mm").format("HH:mm");
  }
  return moment("22:30", "HH:mm").format("HH:mm");
};

export type Params = {
  type: "washer" | "dryer";
};

export type Machine = {
  allow: {
    grades: number[];
    gender: "male" | "female";
  };
  time: {
    [key: string]: string;
  }
};

export type MachineData = {
  [key: string]: Machine
}

export type MachineDB = {
  machine: string;
  time: string;
  date: string;
  owner: string;
  type: string;
}

export const getDefaultValue = (type: "washer" | "dryer", isStay: boolean) => {
  const defaultTimeData: {
    "washer": { [key: string]: string },
    "dryer": { [key: string]: string },
  } = isStay ? {
    washer: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
      "* 오후 12시 00분": "",
      "* 오후 1시 00분": "",
    },
    dryer: {
      "오후 7시 35분": "",
      "오후 9시 30분": "",
      "* 오후 1시 00분": "",
    }
  } : {
    washer: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
    },
    dryer: {
      "오후 7시 35분": "",
      "오후 9시 30분": "",
    }
  };

  const defaultData: MachineData = type === "washer" ? {
    "W1N": {
      allow: {
        grades: isStay ? [1, 2, 3] : [1],
        gender: "female"
      },
      time: {...defaultTimeData[type]}
    },
    "W2N": {
      allow: {
        grades: isStay ? [1, 2, 3] : [2],
        gender: "female"
      },
      time: {...defaultTimeData[type]}
    },
    "W3N": {
      allow: {
        grades: isStay ? [1, 2, 3] : [3],
        gender: "female"
      },
      time: {...defaultTimeData[type]}
    },
    "H2R": {
      allow: {
        grades: isStay ? [1, 2, 3] : [1],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H4L": {
      allow: {
        grades: isStay ? [1, 2, 3] : [1],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H4R": {
      allow: {
        grades: isStay ? [1, 2, 3] : [2],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H5N": {
      allow: {
        grades: isStay ? [1, 2, 3] : [2],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H2C": {
      allow: {
        grades: isStay ? [1, 2, 3] : [3],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H2L": {
      allow: {
        grades: isStay ? [1, 2, 3] : [3],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
  } : {
    "W1N": {
      allow: {
        grades: isStay ? [1, 2, 3] : [1],
        gender: "female"
      },
      time: {...defaultTimeData[type]}
    },
    "W2N": {
      allow: {
        grades: isStay ? [1, 2, 3] : [2],
        gender: "female"
      },
      time: {...defaultTimeData[type]}
    },
    "W3N": {
      allow: {
        grades: isStay ? [1, 2, 3] : [3],
        gender: "female"
      },
      time: {...defaultTimeData[type]}
    },
    "H2N": {
      allow: {
        grades: isStay ? [1, 2, 3] : [3],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H4N": {
      allow: {
        grades: isStay ? [1, 2, 3] : [2],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H5N": {
      allow: {
        grades: isStay ? [1, 2, 3] : [1],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
  };

  return defaultData;
};
