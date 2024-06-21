import React from "react";

const Insider = ({
  children,
  style,
  className,
  ref,
  defaultClass = true,
  ...props
}: Readonly<{
  children?: React.ReactNode;
  style?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>["style"];
  className?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>["className"];
  ref?: React.RefObject<HTMLDivElement>;
  props?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  defaultClass?: boolean;
}>) => {
  return (
    <main className={[defaultClass ? "py-4 px-4 flex flex-col gap-8" : "", className].join(" ")} {...props}>
      {children}
    </main>
  );
};

export default Insider;