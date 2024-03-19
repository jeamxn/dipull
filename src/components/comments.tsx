"use client";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

const Comments = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = `${pathname}?${searchParams}`;

  React.useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const scriptElem = document.createElement("script");
    scriptElem.src = "https://giscus.app/client.js";
    scriptElem.async = true;
    scriptElem.crossOrigin = "anonymous";

    scriptElem.setAttribute("data-repo", "jeamin-0927/dimigoin-pull-service");
    scriptElem.setAttribute("data-repo-id", "R_kgDOJ8SJEg");
    scriptElem.setAttribute("data-category", "Comments");
    scriptElem.setAttribute("data-category-id", "DIC_kwDOJ8SJEs4CeEWZ");
    scriptElem.setAttribute("data-mapping", "pathname");
    scriptElem.setAttribute("data-strict", "0");
    scriptElem.setAttribute("data-reactions-enabled", "1");
    scriptElem.setAttribute("data-emit-metadata", "1");
    scriptElem.setAttribute("data-input-position", "top");
    scriptElem.setAttribute("data-theme", "https://rawgit.com/krisamin/blog-comment/main/theme.css");
    scriptElem.setAttribute("data-lang", "ko");
    scriptElem.setAttribute("crossorigin", "anonymous");

    ref.current.appendChild(scriptElem);
  }, []);

  React.useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { term: url } } },
      "https://giscus.app",
    );
  }, [url]);
  
  return (
    <article className="flex flex-col gap-3">
      <section ref={ref} />
    </article>
  );
};

export default Comments;