import React from "react";

const LuckComponent = ({
  keyString,
  value,
  loading,
}: {
  keyString: string;
  value: string;
  loading: boolean;
}) => {
  const [clicked, setClicked] = React.useState(false);
  return (
    <article 
      className={[
        "flex flex-col gap-1 bg-white rounded border border-text/10 p-4 justify-start items-start overflow-auto cursor-pointer",
        loading ? "loading_background" : "",
      ].join(" ")}
      onClick={() => setClicked(p => !p)}
    >
      <h1 className="text-base font-semibold">{keyString}</h1>
      {
        clicked ? (
          <h1 className="text-base">{value}</h1>
        ) : null
      }
    </article>
  );
};

export default LuckComponent;