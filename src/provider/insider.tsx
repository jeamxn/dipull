import React from "react";

const Insider = ({
  children,
  className,
  style,
}: Readonly<{
  children?: React.ReactNode;
  className?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>["className"];
  style?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>["style"];
}>) => {
  return (
    <main className={["py-5 px-8 flex flex-col gap-5", className].join(" ")} style={style}>
      {children}
    </main>
  );
};

export default Insider;