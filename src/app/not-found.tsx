import { redirect } from "next/navigation";
import React from "react";

const Error = ({
  error,
  reset,
}: {
  error?: Error & { digest?: string }
  reset?: () => void
}) => {
  return redirect("/");
};

export default Error;