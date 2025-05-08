import React, { useEffect, useState } from "react";
import clsx from "clsx";

interface DialogProps {
  className?: string;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const Dialog: React.FC<DialogProps> = ({ className, title, children, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setVisible(true), 10);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 200); // Match transition duration
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center",
        className
      )}
    >
      {/* Backdrop */}
      <div
        className={clsx(
          "absolute inset-0 bg-black transition-opacity duration-200",
          visible ? "opacity-50" : "opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Dialog Box */}
      <div
        className={clsx(
          "relative z-10 bg-white rounded-lg shadow-lg p-1 w-[700px] transform transition duration-200",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        {onClose && (
          <button
            onClick={handleClose}
            className="absolute top-2 right-3 text-white hover:text-gray-700"
          >
            ✕
          </button>
        )}
        {title && (
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">{title}</h2>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
