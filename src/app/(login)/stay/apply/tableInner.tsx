import React from "react";

const TableInner = ({
  gradeClass, number, gender, names
}: {
  gradeClass?: string;
  number?: string;
  gender?: string;
  names?: string;
}) => {
  return (
    <tr className="border-y border-text/10">
      <td className="w-20">
        <p className="text-center text-base font-bold">{gradeClass}</p>
      </td>
      <td className="w-10">
        <p className="text-base text-center">{number}</p>
      </td>
      <td className="p-2 w-10">
        <p className="text-center text-base">{gender}</p>
      </td>
      <td className="p-2">
        <p className="text-center">
          {names}
        </p>
      </td>
    </tr>
  );
};

export default TableInner;
