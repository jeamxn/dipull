import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import styles from "&/pages/Dry.module.css";
import { DryReturn } from "@/pages/api/dry";
import { isLoadingAtom, myInfoAtom, userInfoAtom } from "@/utils/states";

const dryerId2Name = (
  id: string
) => {
  const where = id[0] == "W" ? "우정학사" : "학봉관";
  const floor = id[1];

  const type = {
    "N": "",
    "L": "왼쪽",
    "C": "중앙",
    "R": "오른쪽"
  };
  
  return `${where} ${floor}층 ${type[id[2]]}`;
};

const DryNowBox = ({
  data
}: {
  data: [string, DryReturn["dryerData"][string]]
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.nowBox} onClick={() => setShow(!show)}>
      <div className={styles.nowTitle}>[{data[1].grade.join(", ") === "1, 2, 3" ? "전체" : data[1].grade.join(", ")}학년] {dryerId2Name(data[0])}</div>
      {
        show && (
          <div className={styles.nowInfo}>
            {
              Object.entries(data[1].time).map((time, i) => (
                <div 
                  className={styles.nowTimeBox} 
                  style={{
                    opacity: time[1] ? 1 : 0.3
                  }}
                  key={i}
                >
                  <div className={styles.nowTime}>{time[0]}</div>
                  <div className={styles.nowWho}>{time[1]}</div>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  );
};

const DryApply = ({
  drydataState, 
  LoadData
}: {
  drydataState: [DryReturn["dryerData"], React.Dispatch<React.SetStateAction<DryReturn["dryerData"]>>],
  LoadData: () => void
}) => {
  const [myInfo, setMyInfo] = useRecoilState(myInfoAtom);
  const [selected, setSelected] = useState({
    dryer: "",
    time: ""
  });
  const [drydata, setDrydata] = drydataState;
  const myGrade = Math.floor(myInfo && myInfo.number / 1000);

  const dryerButton = async () => {
    if (!selected.time) return;
    const { data } = await axios({
      method: "POST",
      url: "/api/dry",
      data: {
        dryer: selected.dryer,
        time: selected.time
      }
    });
    await LoadData();
    alert(data.message);
  };

  return (
    <div className={styles.apply}>
      <select 
        className={styles.applySelect} 
        value={selected.dryer}
        onChange={(e) => {
          setSelected({
            dryer: e.target.value,
            time: ""
          });
        }}
      >
        <option value="">건조기를 선택해주세요</option>
        {
          myInfo && Object.entries(drydata).map((data, i) => (
            <option 
              value={data[0]} 
              key={i}
              disabled={
                !data[1].grade.includes(myGrade) ||
                    ((data[0][0] === "W" ? "female" : "male") !== myInfo.gender)
              }
            >
              [{data[1].grade.join(", ") === "1, 2, 3" ? "전체" : data[1].grade.join(", ")}학년] {dryerId2Name(data[0])}
            </option>
          ))
        }
      </select>
      <select 
        className={styles.applySelect} 
        value={selected.time}
        onChange={(e) => {
          setSelected({
            ...selected,
            time: e.target.value
          });
        }}
      >
        <option value="">건조 시간을 선택해주세요</option>
        {
          selected.dryer && Object.entries(drydata[selected.dryer].time).map((time, i) => (
            <option 
              value={time[0]} 
              key={i} 
              disabled={Boolean(time[1])}
            >
              {time[0]}
            </option>
          ))
        }
      </select>
      <input 
        className={[styles.applyBtn, selected.time && styles.applyBtnActive].join(" ")}
        type="button"
        value="신청하기"
        onClick={dryerButton}
      />
    </div>
  );
};

const DryApplyed = ({myDryerDataState, LoadData}) => {
  const [myDryerData, setMyDryerData] = myDryerDataState;
  const [loading, setLoading] = useRecoilState(isLoadingAtom);

  const dryerButton = async () => {
    setLoading(true);
    const { data } = await axios({
      method: "DELETE",
      url: "/api/dry",
    });
    await LoadData();
    setLoading(false);
    alert(data.message);
  };

  return (
    <div className={styles.applyEnd}>
      <div className={styles.applyEndInfo}>오늘 예약한 건조기가 있어요.</div>
      <div className={styles.applyEndData}>{dryerId2Name(myDryerData.dryer)} {myDryerData.time.replaceAll("* ", "")}</div>
      <input 
        className={styles.applyEndBtn}
        type="button"
        value="취소하기"
        onClick={dryerButton}
      />
    </div>
  );
};

const Dry = () => {
  const [myInfo, setMyInfo] = useRecoilState(myInfoAtom);
  const [drydata, setDrydata] = useState<DryReturn["dryerData"]>({});
  const [myDryerData, setMyDryerData] = useState<DryReturn["myDryerData"]>(null);
  const [loading, setLoading] = useRecoilState(isLoadingAtom);
  const [checker, setChecker] = useRecoilState(userInfoAtom);
  const [dryerAvailable, setDryerAvailable] = useState<DryReturn["isDryerAvailable"]>(false);
  const [dryerTime, setDryerTime] = useState<DryReturn["dryerTime"]>({
    start: [],
    end: []
  });

  const LoadData = async () => {
    setLoading(true);
    const { data }: { data: DryReturn } = await axios.get("/api/dry");
    setDrydata(data.dryerData);
    setMyDryerData(data.myDryerData);
    setDryerAvailable(data.isDryerAvailable);
    setDryerTime(data.dryerTime);

    const newChecker = { ...checker };
    if(newChecker.dry !== undefined) {
      newChecker.dry = data.myDryerData ? true : false;
      setChecker(newChecker); 
    }
    setLoading(false);
  };

  useEffect(() => {
    LoadData();
  }, []);

  return (
    <div className={styles.dry}>
      <div className={styles.box}>
        <div className={styles.title}>건조 신청하기</div>
        {
          dryerAvailable ? myDryerData ? 
            <DryApplyed myDryerDataState={[myDryerData, setMyDryerData]} LoadData={LoadData} />
            : 
            <DryApply drydataState={[drydata, setDrydata]} LoadData={LoadData} />
            :
            (
              <div className={styles.applyEnd}>
                <div className={styles.applyEndInfo}>건조 예약 시간이 아니에요.</div>
                <div className={styles.applyEndData}>
                  {
                    dryerTime.start[0] ?
                      `${String(dryerTime.start[0]).padStart(2, "0")}시 ${String(dryerTime.start[1]).padStart(2, "0")}분부터 ${String(dryerTime.end[0]).padStart(2, "0")}시 ${String(dryerTime.end[1]).padStart(2, "0")}분까지 신청 가능합니다.`
                      : "건조 예약을 할 수 없어요."
                  }
                </div>
              </div>
            )
        }
      </div>

      <div className={styles.boxLine}>
        <div className={styles.boxLineInner} />
      </div>

      <div className={styles.box}>
        <div className={styles.title}>건조 신청 현황</div>
        <div className={styles.now}>
          {
            Object.entries(drydata).map((data, i) => (
              <DryNowBox data={data} key={i} />
            ))
          }
        </div>
      </div>

    </div>
  );
};

export default Dry;