import React from "react";

const Insider = ({
  children,
  style,
  className,
  ref,
  ...props
}: Readonly<{
  children?: React.ReactNode;
  style?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>["style"];
  className?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>["className"];
  ref?: React.RefObject<HTMLDivElement>;
  props?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}>) => {
  return (
    <main className={["py-4 px-4 flex flex-col gap-8", className].join(" ")} {...props}>
      {children}
    </main>
  );
};

export default Insider;