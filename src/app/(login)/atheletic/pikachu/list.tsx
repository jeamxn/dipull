import React from "react";

import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const List = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<{
    id: string;
    time: string;
    player: string;
  }[]>([]);

  const getList = async () => {
    setLoading(true);
    try {
      const { data } = await instance.get("/api/pikachu");
      console.log(data);
      setData(data.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getList();
  }, []);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-row gap-2 items-center">
        <h1 className="text-xl font-semibold">방 개설 목록</h1>
        <div className="text-base text-primary hover:font-semibold cursor-pointer transition-all" onClick={getList}>새로고침</div>
      </div>
      <section className="flex flex-wrap gap-4 flex-row items-center justify-center">
        <section className={[
          "flex flex-col gap-4 bg-white rounded border border-text/10 p-5 overflow-auto w-full",
          loading ? "loading_background" : "",
        ].join(" ")}>
          <table className="w-full overflow-auto">
            <tbody className="w-full border-y border-text/10 overflow-auto">
              <tr className="w-full">
                <th className="text-center px-4 whitespace-nowrap py-2 font-semibold w-full" colSpan={4}>개설 방 현황</th>
              </tr>
              {
                data.length ? data.reverse().map((room, index) => {
                  const copyToClipboard = (text: string) => {
                    const textarea = document.createElement("textarea");
                    textarea.value = text;
                    textarea.style.position = "fixed"; // 화면에서 보이지 않도록 고정합니다.
                    document.body.appendChild(textarea);
                    textarea.select(); // 텍스트를 선택합니다.
                    try {
                      document.execCommand("copy");
                      alert.success("클립보드에 복사되었습니다.");
                    } catch (err) {
                      console.error("클립보드 복사 오류:", err);
                      alert.error("클립보드 복사에 실패했습니다.");
                    }
                    document.body.removeChild(textarea);
                  };
                  const idString = `${room.id.slice(0, 5)}-${room.id.slice(5, 10)}-${room.id.slice(10, 15)}-${room.id.slice(15, 20)}`;
                  return (
                    <tr 
                      className={[
                        "w-full border-y border-text/10",
                      ].join(" ")}
                      key={index}
                    >
                      <td className="text-center px-4 whitespace-nowrap py-2 font-semibold text-inherit">
                        {room.time}
                      </td>
                      <td className="px-4 select-none text-left text-inherit border-l border-text/10">
                        {room.player}
                      </td>
                      <td className="w-full text-left px-4 text-inherit border-x border-text/10">
                        {idString}
                      </td>
                      <td 
                        className="text-center px-4 whitespace-nowrap text-inherit cursor-pointer select-none"
                        onClick={() => copyToClipboard(idString)}
                      >
                    복사
                      </td>
                    </tr>
                  );
                }) : (
                  <tr className="w-full border-y border-text/10">
                    <td className="text-center px-4 whitespace-nowrap py-2 text-text/50" colSpan={4}>개설된 방이 없습니다.</td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </section>
      </section>
    </section>
  );
};

export default List;