import "moment-timezone";
import moment from "moment";

import { UserDB } from "@/app/auth/type";
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
  owner: UserDB["id"];
  type: "washer" | "dryer";
}

export type MachineConfig = {
  stay: {
    washer: string[];
    dryer: string[];
  },
  common: {
    washer: string[];
    dryer: string[];
  }
}

type MachineTime = {
  "washer": { [key: string]: string },
  "dryer": { [key: string]: string },
};

export const getDefaultValue = async (type: "washer" | "dryer", isStay: boolean) => {
  const machineConfig: MachineConfig = await getStates("machine_time");
  const stayConfig = machineConfig.stay;
  const commonConfig = machineConfig.common;

  const stayConfigObj: MachineTime = {
    washer: {},
    dryer: {},
  };
  const commonConfigObj: MachineTime = {
    washer: {},
    dryer: {},
  };

  for (const key of stayConfig.washer) { 
    stayConfigObj.washer[key] = "";
  }
  for (const key of stayConfig.dryer) {
    stayConfigObj.dryer[key] = "";
  }
  for (const key of commonConfig.washer) {
    commonConfigObj.washer[key] = "";
  }
  for (const key of commonConfig.dryer) {
    commonConfigObj.dryer[key] = "";
  }

  const isAllTime = isStay || await getStates("machine_all_time");
  const isAllWasher = isStay || await getStates("machine_all_washer");
  const defaultTimeData: MachineTime = isAllTime ? stayConfigObj : commonConfigObj;

  const defaultData: MachineData = type === "washer" ? {
    "W1N": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [1],
        gender: "female"
      },
      time: {...defaultTimeData[type]}
    },
    "W2N": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [2],
        gender: "female"
      },
      time: {...defaultTimeData[type]}
    },
    "W3N": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [3],
        gender: "female"
      },
      time: {...defaultTimeData[type]}
    },
    "H2R": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [1],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H4L": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [1],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H4R": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [2],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H5N": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [2],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H2C": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [3],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H2L": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [3],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
  } : {
    "W1N": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [1],
        gender: "female"
      },
      time: {...defaultTimeData[type]}
    },
    "W2N": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [2],
        gender: "female"
      },
      time: {...defaultTimeData[type]}
    },
    "W3N": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [3],
        gender: "female"
      },
      time: {...defaultTimeData[type]}
    },
    "H2N": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [3],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H4N": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [2],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
    "H5N": {
      allow: {
        grades: isAllWasher ? [1, 2, 3] : [1],
        gender: "male"
      },
      time: {...defaultTimeData[type]}
    },
  };

  return defaultData;
};
