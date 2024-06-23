"use client";

import { AxiosResponse } from "axios";
import * as Excel from "exceljs";
import { saveAs } from "file-saver";
import React from "react";

import { SheetResponse } from "@/app/api/teacher/sheet/homecoming/utils";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const downloadSheet = async (data: SheetResponse["data"], grade: number) => {
  const workbook = new Excel.Workbook();
  
  const worksheet = workbook.addWorksheet(`${grade}학년`);
  const columnsStyle: {
      alignment: {
        horizontal: "center",
        vertical: "middle",
      }
    } = { 
      alignment: {
        horizontal: "center",
        vertical: "middle",
      },
    };

  worksheet.mergeCells("A1:I1");

  worksheet.getRow(1).getCell(1).value = `${grade}학년`;

  worksheet.getRow(2).values = [
    "학년", "반", "인원", "학번", "이름", "성별", "사유", "귀가시간", "비고"
  ];

  worksheet.columns = [
    { header: "학년", key: "grade", width: 10, style: columnsStyle },
    { header: "반", key: "class", width: 10, style: columnsStyle },
    { header: "인원", key: "count", width: 10, style: columnsStyle },
    { header: "학번", key: "number", width: 10, style: columnsStyle },
    { header: "이름", key: "name", width: 20, style: columnsStyle },
    { header: "성별", key: "gender", width: 10, style: columnsStyle },
    { header: "사유", key: "reason", width: 50, style: columnsStyle },
    { header: "귀가시간", key: "time", width: 25, style: columnsStyle },
    { header: "비고", key: "etc", width: 10, style: columnsStyle },
  ];

  const worksheetData = Object.entries(data[grade] || {})
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([class_, classData], i) => classData
      .sort((a, b) => a.number - b.number)
      .map((v, j) => ({
        grade: i === 0 ? `${grade}학년` : "",
        class: j === 0 ? `${class_}반` : "",
        count: j === 0 ? `${classData.length}명` : "",
        number: v.number,
        name: v.name,
        gender: v.gender === "male" ? "남" : "여",
        reason: v.reason,
        time: v.time || "",
        etc: ""
      })));
  const worksheetDataFlat = worksheetData.flat();

  worksheet.addRows(worksheetDataFlat);
  worksheet.addRow({ grade: `총원 ( ${worksheetDataFlat.length}명 )` });

  worksheetData.length && worksheet.mergeCells(`A3:A${worksheetDataFlat.length + 2}`);
  worksheet.mergeCells(`A${worksheetDataFlat.length + 3}:C${worksheetDataFlat.length + 3}`);
  worksheet.mergeCells(`D${worksheetDataFlat.length + 3}:I${worksheetDataFlat.length + 3}`);

  let nowCell = 3;
  Object.entries(data[grade] || {}).forEach((v) => {
    worksheet.mergeCells(`B${nowCell}:B${nowCell + v[1].length - 1}`);
    worksheet.mergeCells(`C${nowCell}:C${nowCell + v[1].length - 1}`);
    nowCell += v[1].length;
  });

  const cellData: {
      border: Partial<Excel.Borders>;
      fill: Excel.FillPattern;
      font: Partial<Excel.Font>;
      alignment: Partial<Excel.Alignment>;
    } = {
      border: {
        top: {
          style: "thin",
          color: { argb: "FFED7D32" },
        },
        left: {
          style: "thin",
          color: { argb: "FFED7D32" },
        },
        bottom: {
          style: "thin",
          color: { argb: "FFED7D32" },
        },
        right: {
          style: "thin",
          color: { argb: "FFED7D32" },
        }
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFE6D8" },
      },
      font: {
        bold: true,
        name: "맑은 고딕", 
        size: 12,
      },
      alignment: {
        horizontal: "center",
        vertical: "middle",
      }
    };
  
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    row.height = 20;
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      cell.border = cellData.border;
      cell.font = {
        name: "맑은 고딕", 
        size: 12,
      };
    });
  });
  worksheet.getRow(1).height = 30;
  worksheet.getRow(1).getCell(1).value = `${grade}학년 금요귀가 현황`;
  Array(9).fill(0).map((_, i) => {
    worksheet.getRow(1).getCell(i + 1).fill = cellData.fill;
    worksheet.getRow(1).getCell(i + 1).font = {
      bold: true,
      name: "맑은 고딕", 
      size: 16,
    };
    worksheet.getRow(1).getCell(i + 1).alignment = cellData.alignment;
    worksheet.getRow(2).getCell(i + 1).fill = cellData.fill;
    worksheet.getRow(2).getCell(i + 1).font = cellData.font;
    worksheet.getRow(2).getCell(i + 1).alignment = cellData.alignment;
    worksheet.getRow(worksheetDataFlat.length + 3).getCell(i + 1).fill = cellData.fill;
    worksheet.getRow(worksheetDataFlat.length + 3).getCell(i + 1).border = cellData.border;
    worksheet.getRow(worksheetDataFlat.length + 3).getCell(i + 1).font = cellData.font;
  });


  const buffer = await workbook.xlsx.writeBuffer();
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const blob = new Blob([buffer], { type: fileType });
  saveAs(blob, `${grade}학년 금요귀가 현황.xlsx`);
};

const HomecomingSheet = () => {
  const [loading, setLoading] = React.useState(false);
  const download = async (grade: number) => {
    setLoading(true);
    try{
      const res: AxiosResponse<SheetResponse> = await instance.get("/api/teacher/sheet/homecoming");
      await downloadSheet(res.data.data, grade);
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };
  return (
    <article className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold">금요귀가 현황 다운로드</h1>
      <article className={[
        "flex flex-row gap-2 bg-white rounded border border-text/10 p-5",
        loading ? "loading_background" : "",
      ].join(" ")}>
        {
          new Array(3).fill(0).map((_, i) => (
            <button 
              key={i}
              onClick={() => download(i + 1)}
              className="text-base rounded h-10 hover:bg-text/10 border border-text/10 px-4 w-full transition-colors"
            >
              {i + 1}학년
            </button>
          ))
        }
      </article>
    </article>
  );
};

export default HomecomingSheet;