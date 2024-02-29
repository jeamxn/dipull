"use client";

import { AxiosResponse } from "axios";
import React from "react";

import { SheetResponse } from "@/app/api/admin/sheet/utils";
import Insider from "@/provider/insider";
import instance from "@/utils/instance";

const Admin = () => {
  const [loading, setLoading] = React.useState(false);

  const getSheetData = async () => {
    setLoading(true);
    try{
      const res: AxiosResponse<SheetResponse> = await instance.get("/api/admin/sheet");
      console.log(res.data);
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getSheetData();
  }, []);

  return (
    <Insider>
      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">잔류자 외출 및 급식 취소 명단</h1>
      </article>
    </Insider>
  );
};

export default Admin;