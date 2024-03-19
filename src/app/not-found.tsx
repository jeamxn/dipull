// "use client";

import React from "react";

function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  return (
    <main className="flex flex-col gap-2 justify-center items-center w-full px-4 py-10">
      <p className="text-center text-primary text-xl font-medium">여기는 없는 페이지.</p>
      <p className="text-center text-primary text-xl font-medium">열심히 만드는 중 ㅜㅜㅜㅠㅠ,,,..</p>
    </main>
  );
}

export default Error;