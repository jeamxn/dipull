import Link from "next/link";
import React from "react";

const HosilInfo = () => { 
  return (
    <article className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">3학년 남학생 호실 선택</h1>
        <div className="flex flex-col gap-1">
          <h1 className="text-base text-primary">
            <Link href="/hosil" target="_blank" className="underline" prefetch={true}>여기서</Link> 2학기에 사용할 호실을 선택해주세요.
          </h1>
        </div>
      </section>
    </article>
  );
};

export default HosilInfo;