import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { utils, writeFile } from "xlsx";

import styles from "%/Sheet.module.css";
import DefaultHead from "@/components/DefaultHead";
import Header from "@/components/Header";

const outingData = atom({
  key: "outingData",
  default: {},
});

const workbook = utils.book_new();
const refs = {
  "1": {
    "토요일": null,
    "일요일": null,
  },
  "2": {
    "토요일": null,
    "일요일": null,
  },
  "3": {
    "토요일": null,
    "일요일": null,
  },
};

const SheetTable = ({showDate, showGrade}) => {
  const [outingList, setOutingList] = useRecoilState(outingData);
  refs[showGrade][showDate] = useRef(null);

  return [(
    <table className={styles.table} ref={refs[showGrade][showDate]} key={showGrade}>
      <thead>
        <tr>
          <th colSpan={11}>{showGrade}학년&nbsp;{showDate}&nbsp;잔류자 외출 신청 현황</th>
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
              return (
                <tr key={i2}>
                  {i1 === 0 && <td rowSpan={countGrade}>{Math.floor(item.number / 1000)}</td>}
                  {i2 === 0 && <td rowSpan={countClass}>{Math.floor(item.number / 100) % 10}</td>}
                  {i2 === 0 && <td rowSpan={countClass}>{countClass}</td>}
                  <td>{item.number}</td>
                  <td>{item.name}</td>
                  <td>{item.gender === "male" ? "남" : "여"}</td>
                  <td>{item.outing[showDate].meal[0] ? "O" : "X"}</td>
                  <td>{item.outing[showDate].meal[1] ? "O" : "X"}</td>
                  <td>{item.outing[showDate].meal[2] ? "O" : "X"}</td>
                  <td>{item.outing[showDate].reason.join(" ")}</td>
                  <td></td>
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
  ), refs[showGrade][showDate]];
};

const Sheet = () => {
  const [outingList, setOutingList] = useRecoilState(outingData);

  const loadData = async () => {
    const {data} = await axios({
      method: "GET",
      url: "/api/sheet"
    });
    console.log(data);
    setOutingList(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const download = () => {
    console.log(workbook);
    console.log(refs);
    const newWorkbook = utils.book_new();
    Object.keys(refs).forEach(grade => {
      Object.keys(refs[grade]).forEach(date => {
        const worksheet = utils.table_to_sheet(refs[grade][date].current);
        console.log(worksheet);
        const workSheetName = `${grade}학년 ${date}`;
        utils.book_append_sheet(newWorkbook, worksheet, workSheetName);
      });
    });
    writeFile(newWorkbook, "잔류자 외출 및 급식 취소 명단.xlsx");
  };

  return (
    <>
      <DefaultHead></DefaultHead>
      <main className={["main", styles.main].join(" ")}>
        <Header></Header>
        <div className={styles.Sheet}>
          <div className={styles.box}>
            <div className={styles.titles}>
              <div className={styles.title3}>잔류 및 외출 신청 현황</div>
              <div className={styles.download} onClick={download}>파일 다운로드</div>
            </div>
            {
              Array(3).fill(0).map((_, i2) => ["토요일", "일요일"].map((showDate, i1) => {
                const table = SheetTable({ showDate, showGrade: i2 + 1});

                // const worksheet = utils.table_to_sheet(table[1].current);
                // utils.book_append_sheet(workbook, worksheet, `${i2 + 1}학년 ${day}`);
                // utils.sheet_add_aoa(worksheet, [["학년", "반", "인원", "학번", "이름", "조식", "중식", "석식", "외출", "비고"]], { origin: "A1" });
                      
                return (
                  <div className={styles.tableDiv} key={i1}>
                    {table[0]}
                  </div>
                );
              }))
            }
          </div>
        </div>
      </main>
    </>
  );
};

export default Sheet;