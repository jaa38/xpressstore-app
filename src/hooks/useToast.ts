import { useToastContext } from "@/providers/toast-provider";

export function useToast() {
  return useToastContext();
}
