import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  Toast,
  ToastType,
} from "@/components/feedback/Toast";

interface ToastOptions {
  type?: ToastType;

  title: string;

  message?: string;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;

  hideToast: () => void;
}

const ToastContext =
  createContext<ToastContextValue | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  const [toast, setToast] =
    useState<ToastOptions>({
      title: "",
      type: "success",
    });

  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  const showToast = useCallback(
    (options: ToastOptions) => {
      setToast(options);

      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 3000);
    },
    []
  );

  const value = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [showToast, hideToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <Toast
        visible={visible}
        type={toast.type}
        title={toast.title}
        message={toast.message}
      />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToastContext must be used inside ToastProvider."
    );
  }

  return context;
}