import axios from "axios";
import React, { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";

import styles from "%/Sheet.module.css";
import DefaultHead from "@/components/DefaultHead";
import Header from "@/components/Header";
import table2xlsx, { PrintData, PrintDataArray } from "@/utils/table2xlsx";

const outingData = atom({
  key: "outingData",
  default: {},
});

const printData: PrintData = {
  "1": {
    "토요일": [],
    "일요일": [],
  },
  "2": {
    "토요일": [],
    "일요일": [],
  },
  "3": {
    "토요일": [],
    "일요일": [],
  },
};

const SheetTable = ({showDate, showGrade}) => {
  const [outingList, setOutingList] = useRecoilState(outingData);
  printData[showGrade][showDate] = [];
  let cnt = 0;

  return (
    <table className={[styles.table, "table"].join(" ")} key={showGrade}>
      <thead>
        <tr>
          <th colSpan={11}>{showGrade}학년&nbsp;{showDate}&nbsp;잔류자 외출 및 급식 취소 명단</th>
        </tr>
        <tr>
          <th>학년</th>
          <th>반</th>
          <th>인원</th>
          <th>학번</th>
          <th>이름</th>
          <th>성별</th>
          <th>조식</th>
          <th>중식</th>
          <th>석식</th>
          <th>외출</th>
          <th>비고</th>
        </tr>
      </thead>
      <tbody>
        {
          outingList[showGrade] ? Object.keys(outingList[showGrade]).map((showClass, i1) => {
            const countGrade = outingList[showGrade].count;
            return outingList[showGrade][showClass].data?.map((item, i2) => {
              const countClass = outingList[showGrade][showClass].count;
              cnt++;
              const _data: PrintDataArray = {
                grade: cnt === 1 ? countGrade && Math.floor(item.number / 1000) : "",
                class: i2 === 0 ? countClass && Math.floor(item.number / 100) % 10 : "",
                count: i2 === 0 ? countClass && outingList[showGrade][showClass].count : "",
                number: item.number,
                name: item.name,
                gender: item.gender === "male" ? "남" : "여",
                breakfast: item.outing[showDate].meal[0] ? "O" : "X",
                lunch: item.outing[showDate].meal[1] ? "O" : "X",
                dinner: item.outing[showDate].meal[2] ? "O" : "X",
                outing: item.outing[showDate].reason.join(" "),
                etc: "",
              };
              printData[showGrade][showDate].push(_data);
              return (
                <tr key={i2}>
                  {cnt === 1 && <td rowSpan={countGrade}>{_data.grade[0]}</td>}
                  {i2 === 0 && <td rowSpan={countClass}>{_data.class[0]}</td>}
                  {i2 === 0 && <td rowSpan={countClass}>{countClass}</td>}
                  <td>{_data.number}</td>
                  <td>{_data.name}</td>
                  <td>{_data.gender}</td>
                  <td>{_data.breakfast}</td>
                  <td>{_data.lunch}</td>
                  <td>{_data.dinner}</td>
                  <td>{_data.outing}</td>
                  <td>{_data.etc}</td>
                </tr>
              );
            });
          }) : (
            <tr>
              <td colSpan={11}>신청자가 없습니다.</td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
};

const Sheet = () => {
  const [outingList, setOutingList] = useRecoilState(outingData);
  const [grade, setGrade] = useState(-1);

  const loadData = async () => {
    const {data} = await axios({
      method: "GET",
      url: "/api/sheet"
    });
    setOutingList(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const download = (e) => {
    if (e.target.value === "-1") return;
    setGrade(e.target.value);
  };

  useEffect(() => {
    if (grade == -1) return;
    if (grade == 0) table2xlsx(printData, "전체 잔류자 외출 및 급식 취소 명단.xlsx");
    else {
      console.log(printData[grade]);
      table2xlsx(Object.fromEntries([[grade, printData[grade]]]), `${grade}학년 잔류자 외출 및 급식 취소 명단.xlsx`);
    }
    setGrade(-1);
  }, [grade]);

  return (
    <>
      <DefaultHead></DefaultHead>
      <main className={["main", styles.main].join(" ")}>
        <Header></Header>
        <div className={styles.Sheet}>
          <div className={styles.box}>
            <div className={styles.titles}>
              <div className={styles.title3}>잔류자 외출 및 급식 취소 명단</div>
              <select className={styles.download} onChange={download} value={grade}>
                <option value="-1">파일 다운로드</option>
                <option value="0">전체</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
              </select>
            </div>
            {
              Object.entries(printData).map((_, i1) => Object.keys(_[1]).map((showDate, i2) => (
                <div className={styles.tableDiv} key={i2}>
                  <SheetTable
                    showDate={showDate}
                    showGrade={i1 + 1}
                  />
                </div>
              )))
            }
          </div>
        </div>
      </main>
    </>
  );
};

export default Sheet;