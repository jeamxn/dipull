import React from "react";

const PikachuVolleyball = () => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className={[
        "w-full p-0",
        hovered ? "fixed z-10 top-0 left-0 bg-white h-full" : "relative aspect-pikachu-volleyball",
      // hovered ? " size" : "",
      ].join(" ")}
    >
      <div 
        className={[
          "font-extrabold absolute z-10 top-0 right-0 cursor-pointer",
          hovered ? "text-5xl p-10" : "text-2xl p-5",
        ].join(" ")}
        onClick={() => setHovered(hovered ? false : true)}
      >
        {hovered ? "닫기" : "전체화면"}
      </div>
      <iframe 
        src="/pikachu-volleyball/index.html"
        className="h-full w-full aspect-pikachu-volleyball"
      />
    </div>
  );
};

export default PikachuVolleyball;