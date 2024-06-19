import React from "react";

import Linker from "@/components/Linker";

const HosilInfo = () => { 
  return (
    <article className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">3학년 남학생 호실 선택</h1>
        <div className="flex flex-col gap-1">
          <h1 className="text-base text-primary">
            <Linker href="/hosil" className="underline" prefetch={true}>여기서</Linker> 2학기에 사용할 호실을 선택해주세요.
          </h1>
        </div>
      </section>
    </article>
  );
};

export default HosilInfo;