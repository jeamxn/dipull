import React from "react";

const Insider = ({
  children,
  className,
}: Readonly<{
  children?: React.ReactNode;
  className?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>["className"];
}>) => {
  return (
    <main className={["py-5 px-8 flex flex-col gap-5", className].join(" ")}>
      {children}
    </main>
  );
};

export default Insider;