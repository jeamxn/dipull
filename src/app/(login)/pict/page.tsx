import { headers } from "next/headers";
import React from "react";

import { connectToDatabase } from "@/utils/db";
import { refreshVerify } from "@/utils/jwt";

const Pict = async () => {
  const cookie = headers().get("cookie")?.replaceAll(" ", "").split(";").map((c: string) => {
    const [key, value] = c.split("=");
    return {
      key: key,
      value: value,
    };
  }) || [];
  const cookieJSON = Object.fromEntries(cookie.map((c: any) => [c.key, c.value]));
  const { refreshToken } = cookieJSON;
  const veryfied = await refreshVerify(refreshToken);

  if(!veryfied.ok || !veryfied.payload.id) {
    return (
      <div>
        <h1>로그인이 필요합니다.</h1>
      </div>
    );
  }

  const client = await connectToDatabase();
  const jolupPictCollection = client.db().collection<{
    who: string;
    url: string;
  }[]>("jolup_pict");
  const query = { 
    who: {
      $in: [veryfied.payload.name],
    }
  };
  const projection = {
    _id: 0,
    who: 1,
    url: 1,
  };
  const result = await jolupPictCollection.find(query).project(projection).toArray();

  return (
    <div className="flex flex-col gap-2 mt-4">
      {
        result.length ? result.map((r, i) => (
          <a 
            href={r.url} 
            key={i} 
            target="_blank" 
            rel="noreferrer"
            className="select-none"
          >
            <div className="p-4 rounded border border-text/10 bg-white">
              <p>{r.who.join(" ")}</p>
            </div>
          </a>
        )) : (
          <h1>최재민의 핸드폰으로 찍은 사진이 없습니다.</h1>
        )
      }
    </div>
  );
};

export default Pict;