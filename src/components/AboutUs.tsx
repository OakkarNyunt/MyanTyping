// components/AboutDialog.tsx
import React from "react";
import clsx from "clsx";
import image from "@/assets/image/Profile.jpg";
import MTPRO from "@/assets/image/MT PRO.png";

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dark: boolean;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose, dark }) => {
  if (!isOpen) return null;

  const textClass = dark ? "text-gray-300" : "text-gray-700";
  const headerClass = dark ? "text-white" : "text-black";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className={clsx(
          "relative p-8 rounded-xl shadow-2xl w-full max-w-md md:max-w-lg transition-all duration-300",
          dark ? "bg-gray-800" : "bg-white",
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={clsx(
            "absolute top-3 right-3 text-2xl font-bold leading-none",
            dark
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-black",
          )}
          aria-label="Close"
        >
          &times;
        </button>

        <h2
          className={clsx("text-3xl font-bold mb-6 text-center", headerClass)}
        >
          Myanmar Easy Typing
        </h2>

        {/* --- Developer Section --- */}
        <div className="flex flex-col items-center mb-6 border-b border-gray-600 pb-4">
          <div className="size-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3 overflow-hidden shadow-inner">
            <img
              src={image}
              alt="Oakkar Nyunt - Developer"
              loading="eager" // Load developer profile immediately as it's the main focus
              decoding="async" // Off-thread decoding to prevent UI jank
              className="w-full h-full object-cover"
              width="96" // Explicit dimensions prevent Layout Shift (CLS)
              height="96"
            />
          </div>

          <h3 className={clsx("text-xl font-bold", headerClass)}>
            Oakkar Nyunt
          </h3>
          <p className={clsx("text-sm", textClass)}>
            <a
              href="mailto:oakkarnyunt@gmail.com"
              className="text-blue-400 hover:underline"
            >
              oakkarnyunt@gmail.com
            </a>
          </p>
        </div>

        {/* --- Description --- */}
        <p
          className={clsx(
            "mb-6 text-center italic text-sm leading-relaxed",
            textClass,
          )}
        >
          "This application is designed to help users master the Pyidaungsu
          Myanmar Unicode keyboard layout efficiently and accurately."
        </p>

        <div className="space-y-4">
          <h3 className={clsx("text-lg font-bold border-b pb-1", headerClass)}>
            Main Sponsor
          </h3>

          <div className="text-center space-y-1">
            <p className={clsx("font-semibold", textClass)}>Ko Min Thu</p>
            <p className={clsx("text-sm", headerClass)}>
              MT PRO Computer Sale, Service and Training
            </p>
            <p className={clsx("text-xs text-blue-400")}>
              Tachileik, Shan State, Myanmar
            </p>
            <p className={clsx("text-xs text-blue-400")}>Phone: 09265448751</p>
          </div>

          <div className="flex justify-center pt-4">
            <div
              className={clsx(
                "w-40 h-40 flex items-center justify-center border rounded-lg overflow-hidden bg-white p-2",
                dark ? "border-gray-600" : "border-gray-300",
              )}
            >
              {MTPRO ? (
                <img
                  src={MTPRO}
                  alt="MT PRO Sponsor Logo"
                  loading="lazy" // Lazy load the sponsor logo to save initial bandwidth
                  decoding="async"
                  className="w-full h-full object-contain"
                  width="160"
                  height="160"
                />
              ) : (
                <span className={textClass}>Logo Missing</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDialog;
