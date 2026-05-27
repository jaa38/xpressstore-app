import { PropsWithChildren } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/query-client";

export function AppProvider({
  children,
}: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}