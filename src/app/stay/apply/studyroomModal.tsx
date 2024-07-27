import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import domtoimage from "dom-to-image";
import React from "react";

import { useAlertModalDispatch } from "@/components/AlertModal";
import { useModal } from "@/components/Modal";
import Studyroom from "@/components/Studyroom";
import { useAuth } from "@/hooks";
import { UserInfo } from "@/utils/db/utils";

import { StudyroomResponse } from "./grant/[id]/studyroom/utils";

const StudyroomModal = ({
  select,
  setSelect,
  disabled,
  selected,
  setSelected,
}: {
  select: string;
    setSelect: React.Dispatch<React.SetStateAction<string>>;
    disabled: boolean;
    selected: UserInfo;
    setSelected: React.Dispatch<React.SetStateAction<UserInfo>>;
  }) => { 
  const ref = React.useRef<HTMLDivElement>(null);
  const modal = useModal();
  const alertDispatch = useAlertModalDispatch();

  const { data: studyroomData, isFetching } = useQuery({
    queryKey: ["studyroom_info", selected.id, selected.number, selected.type, modal.show],
    queryFn: async () => {
      const response = await axios.get<StudyroomResponse>(`/stay/apply/grant/${selected.id}/studyroom`);
      return response.data;
    },
    enabled: Boolean(modal.show),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const handleSaveAsImage = () => {
    if (!ref.current) return;
    alertDispatch({
      type: "show",
      data: {
        title: "열람실 현황 저장하기",
        description: "곧 이미지가 다운로드 됩니다! 잠시만 기다려주세요.",
      },
    });
    const scale = 3;
    const padding = 16;
    const width = ref.current.offsetWidth + padding * 2 + 4;
    const height = ref.current.offsetHeight + padding * 2;
    const style = {
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      width: `${width}px`,
      height: `${height}px`,
      padding: `${padding}px`,
    };
    domtoimage.toPng(ref.current, {
      width: width * scale,
      height: height * scale,
      style: style,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "component.png";
        link.click();
      })
      .catch((error) => {
        console.error("oops, something went wrong!", error);
      });
  };

  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <div className="flex flex-row w-full items-center justify-between">
        <div className="flex flex-row items-center justify-start gap-6 pb-2">
          <div className="flex flex-row items-center justify-start gap-2">
            <div className="w-5 h-5 rounded bg-text dark:bg-text-dark border-transparent" />
            <p className="text-text/50 dark:text-text-dark/60">내 좌석</p>
          </div>
          <div className="flex flex-row items-center justify-start gap-2">
            <div className="w-5 h-5 rounded bg-text/10 dark:bg-text-dark/20 border-transparent" />
            <p className="text-text/50 dark:text-text-dark/60">선택 가능한 좌석</p>
          </div>
          <div className="flex flex-row items-center justify-start gap-2">
            <div className="w-5 h-5 rounded bg-transparen border-1.5 border-text/20 dark:border-text-dark/30" />
            <p className="text-text/50 dark:text-text-dark/60">선택 불가능한 좌석</p>
          </div>
        </div>
        <button className="flex flex-row items-center justify-start gap-2" onClick={handleSaveAsImage}>
          <p className="text-text/50 dark:text-text-dark/60 underline">열람실 현황 저장하기</p>
        </button>
      </div>
      <div className="w-max" ref={ref}>
        <Studyroom
          select={select}
          setSelect={setSelect}
          disabled={disabled}
          studyroomData={studyroomData}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
};

export default StudyroomModal;