import React from "react";

const List = () => {
  const [loading, setLoading] = React.useState(false);
  return (
    <section className={[
      "flex flex-col gap-4 bg-white rounded border border-text/10 p-5 overflow-auto w-full",
      loading ? "loading_background" : "",
    ].join(" ")}>
      <table className="w-full overflow-auto">
        <tbody className="w-full border-y border-text/10 overflow-auto">
          <tr className="w-full">
            <th className="text-center px-4 whitespace-nowrap py-2 font-semibold w-full" colSpan={4}>개설 방 현황</th>
          </tr>
          <tr 
            className={[
              "w-full border-y border-text/10",
            ].join(" ")}
          >
            <td className="text-center px-4 whitespace-nowrap py-2 font-semibold text-inherit">
              2024-09-01 12:00:00
            </td>
            <td className="px-4 select-none text-left text-inherit border-l border-text/10">
              플레이어1
            </td>
            <td className="w-full text-left px-4 text-inherit border-x border-text/10">
              23juv-ukuh9-n6qzc-9w9cf
            </td>
            <td className="text-center px-4 whitespace-nowrap text-inherit cursor-pointer select-none">
              복사
            </td>
          </tr>

          <tr className="w-full border-y border-text/10">
            <td className="text-center px-4 whitespace-nowrap py-2 text-text/50" colSpan={4}>개설된 방이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default List;