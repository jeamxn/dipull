// "use client";

import React from "react";

function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // React.useEffect(() => {
  //   console.error(error);
  // }, [error]);

  return (
    <main className="flex flex-col gap-2 justify-center items-center w-full px-4 py-10">
      <p className="text-center text-primary text-xl font-medium">여기는 없는 페이지야.</p>
      <p className="text-center text-primary text-xl font-medium">안 돼. 안 만들어 줘. 페이지 만들 생각 없어. 빨리 돌아가.</p>
    </main>
  );
}

export default Error;