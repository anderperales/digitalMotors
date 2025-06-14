import React, { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration?: number; // Duración en milisegundos antes de desaparecer automáticamente
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const bgColor = {
    success: "bg-bramotors-red",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  }[type];

  return (
    <div className={`fixed z-50 top-5 left-1/2 sm:left-auto sm:right-5 transform -translate-x-1/2 sm:translate-x-0 max-w-xs w-[90%] sm:w-auto px-4 py-2 text-white rounded shadow-lg ${bgColor}`}>
      <div className="flex justify-between items-center">
        <span className="uppercase text-sm">{message}</span>
        <button onClick={onClose} className="ml-4 text-white font-bold">X</button>
      </div>
    </div>
  );
  
};

export default Notification;