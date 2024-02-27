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
      <p>이 페이지는 존재하지 않아요 :(</p>
    </main>
  );
}

export default Error;