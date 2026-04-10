
"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertMessage {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
}

interface GlobalAlertProps {
  alerts: AlertMessage[];
  onRemove: (id: string) => void;
}

const alertStyles = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: CheckCircle,
    iconColor: "text-green-500",
    titleColor: "text-green-800",
    messageColor: "text-green-700",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle,
    iconColor: "text-red-500",
    titleColor: "text-red-800",
    messageColor: "text-red-700",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: AlertCircle,
    iconColor: "text-amber-500",
    titleColor: "text-amber-800",
    messageColor: "text-amber-700",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: Info,
    iconColor: "text-blue-500",
    titleColor: "text-blue-800",
    messageColor: "text-blue-700",
  },
};

export default function GlobalAlert({ alerts, onRemove }: GlobalAlertProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<AlertMessage[]>([]);

  useEffect(() => {
    setVisibleAlerts(alerts);
    
    // Auto remove alerts after duration
    alerts.forEach((alert) => {
      const duration = alert.duration || 5000;
      const timer = setTimeout(() => {
        onRemove(alert.id);
      }, duration);
      
      return () => clearTimeout(timer);
    });
  }, [alerts, onRemove]);

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-md w-full">
      {visibleAlerts.map((alert) => {
        const style = alertStyles[alert.type];
        const Icon = style.icon;
        
        return (
          <div
            key={alert.id}
            className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 animate-slide-in`}
            role="alert"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Icon className={`h-5 w-5 ${style.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${style.titleColor}`}>
                  {alert.title}
                </p>
                {alert.message && (
                  <p className={`text-sm mt-1 ${style.messageColor}`}>
                    {alert.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => onRemove(alert.id)}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
      
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}