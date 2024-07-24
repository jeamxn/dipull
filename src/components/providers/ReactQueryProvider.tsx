import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import React from "react";

import { useAlertModalDispatch } from "../AlertModal";

const ReactQueryProvider = ({ 
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const alertModalDispatch = useAlertModalDispatch();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => { 
        const isAxiosError = error.name === "AxiosError";
        if (isAxiosError) {
          const axiosError = error as unknown as AxiosError<any>;
          alertModalDispatch({
            type: "show",
            data: {
              title: axiosError.response?.data.error.title,
              description: axiosError.response?.data.error.description,
            },
          });
          return;
        }
        alertModalDispatch({
          type: "show",
          data: {
            title: error.message,
            description: "다시 시도해주세요.",
          },
        });
      },
    }),
  });
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;