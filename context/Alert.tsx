
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AlertMessage, AlertType } from "@/components/GlobalAlert";
import GlobalAlert from "@/components/GlobalAlert";

interface AlertContextType {
  showAlert: (title: string, type: AlertType, message?: string, duration?: number) => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showAlert = useCallback(
    (title: string, type: AlertType, message?: string, duration?: number) => {
      const id = Math.random().toString(36).substring(7);
      const newAlert: AlertMessage = {
        id,
        type,
        title,
        message,
        duration,
      };
      setAlerts((prev) => [...prev, newAlert]);
      
      // Auto remove after duration if not manually removed
      if (duration !== 0) {
        setTimeout(() => {
          removeAlert(id);
        }, duration || 5000);
      }
    },
    [removeAlert]
  );

  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      showAlert(title, "success", message, duration);
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      showAlert(title, "error", message, duration);
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      showAlert(title, "warning", message, duration);
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      showAlert(title, "info", message, duration);
    },
    [showAlert]
  );

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeAlert,
      }}
    >
      {children}
      <GlobalAlert alerts={alerts} onRemove={removeAlert} />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}