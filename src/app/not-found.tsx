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
    <main className="flex flex-col justify-center items-center h-full w-full">
      <p className="p-4 text-center text-primary text-xl font-medium">안 돼. 안 만들어 줘. 페이지 만들 생각 없어. 빨리 돌아가.</p>
    </main>
  );
}

export default Error;