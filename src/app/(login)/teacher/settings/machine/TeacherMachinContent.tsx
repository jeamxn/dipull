"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { MachineConfig } from "@/app/api/machine/[type]/utils";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import ConfigBox from "./ConfigBox";


export type Inits = {
  init: MachineConfig;
  initAllowAllType: boolean;
  initAllowAllTime: boolean;
};

const TeacherMachinContent = ({
  init,
  initAllowAllType,
  initAllowAllTime,
}: Inits) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [machineConfig, setMachineConfig] = React.useState<MachineConfig>(init);
  const [allowAllType, setAllowAllType] = React.useState<boolean>(initAllowAllType);
  const [allowAllTime, setAllowAllTime] = React.useState<boolean>(initAllowAllTime);
  const [isFirst, setIsFirst] = React.useState(true);

  const updateMachineConfig = async () => {
    const newConfig = { ...machineConfig };
    newConfig.common.dryer = newConfig.common.dryer.filter(v => v);
    newConfig.common.washer = newConfig.common.washer.filter(v => v);
    newConfig.stay.dryer = newConfig.stay.dryer.filter(v => v);
    newConfig.stay.washer = newConfig.stay.washer.filter(v => v);
    setMachineConfig(newConfig);
    setLoading(true);

    const loading = alert.loading("수정된 세탁 시간을 저장 중 입니다.");
    try{
      const res = await instance.put("/api/teacher/machine/edit", {
        allowAllType,
        allowAllTime,
        data: newConfig,
      });
      // await getStayData();
      router.refresh();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  React.useEffect(() => { 
    if(isFirst) {
      setIsFirst(false);
      return;
    }
    updateMachineConfig();
  }, [allowAllType, allowAllTime]);

  return (
    <>
      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">세탁 시간 설정</h1>
        <article className={[
          "flex flex-row gap-1 bg-white rounded border border-text/10 p-5 overflow-auto",
          loading ? "loading_background" : "",
        ].join(" ")}>
          <button
            className={[
              "w-full rounded border border-text/10 px-10 py-5 flex flex-col gap-1 items-center justify-center",
              allowAllType ? "bg-text/10": "",
            ].join(" ")}
            onClick={() => {
              setAllowAllType(p => !p);
            }}
          >
            <p className="font-bold leading-tight">모든 세탁기</p>
            <p className="leading-tight">{ allowAllType ? "허용" : "허용 안 함" }</p>
          </button>
          <button
            className={[
              "w-full rounded border border-text/10 px-10 py-5 flex flex-col gap-1 items-center justify-center",
              allowAllTime ? "bg-text/10": "",
            ].join(" ")}
            onClick={() => {
              setAllowAllTime(p => !p);
            }}
          >
            <p className="font-bold leading-tight">잔류 시간표</p>
            <p className="leading-tight">{ allowAllTime ? "허용" : "허용 안 함" }</p>
          </button>
        </article>
      </article>
      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">세탁기</h1>
        <div className="w-full flex flex-col gap-1">
          <ConfigBox
            type="common"
            machine="washer"
            machineConfig={machineConfig}
            setMachineConfig={setMachineConfig}
            loading={loading}
          />
          <ConfigBox
            type="stay"
            machine="washer"
            machineConfig={machineConfig}
            setMachineConfig={setMachineConfig}
            loading={loading}
          />
        </div>
      </article>
      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">건조기</h1>
        <div className="w-full flex flex-col gap-1">
          <ConfigBox
            type="common"
            machine="dryer"
            machineConfig={machineConfig}
            setMachineConfig={setMachineConfig}
            loading={loading}
          />
          <ConfigBox
            type="stay"
            machine="dryer"
            machineConfig={machineConfig}
            setMachineConfig={setMachineConfig}
            loading={loading}
          />
        </div>
      </article>
      <button 
        className="bg-primary text-white w-full text-base font-semibold rounded h-10"
        onClick={updateMachineConfig}
      >
        변경 내역 저장하기
      </button>
    </>
  );
};

export default TeacherMachinContent;