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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "relative p-8 rounded-xl shadow-2xl w-full max-w-md md:max-w-lg transition-transform duration-300 transform",
          dark ? "bg-gray-800" : "bg-white"
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={clsx(
            "absolute top-3 right-3 text-2xl font-bold",
            dark
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-black"
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
          {/* Developer Image Placeholder */}
          <div className="size-30 rounded-full bg-blue-500 flex items-center justify-center mb-3 overflow-hidden">
            {/* <span className="text-white text-xl font-bold">Dev</span> */}
            <img
              src={image}
              alt="Developer"
              className="w-full h-full object-cover"
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

        {/* --- Description & Sponsor --- */}
        <p className={clsx("mb-6 text-center italic", textClass)}>
          "This application is designed to help users master the Pyidaungsu
          Myanmar Unicode keyboard layout efficiently and accurately."
        </p>

        <div className="space-y-4">
          <h3 className={clsx("text-lg font-bold border-b pb-1", headerClass)}>
            Main Sponsor
          </h3>

          <div className="flex justify-between items-center">
            <span className={clsx("font-semibold", textClass)}>Ko Min Thu</span>
          </div>

          <div className="flex justify-between items-center">
            <span className={headerClass}>
              MT PRO Computer Sale,Service and Training Center
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className={clsx("text-blue-400", headerClass)}>
              Tachileik, Shan State, Myanmar
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className={clsx("text-blue-400", headerClass)}>
              Phone: 09265448751
            </span>
          </div>

          <div className="flex justify-center pt-4">
            {/* Sponsor Logo Container (w-32 h-12) */}
            <div
              className={clsx(
                "size-50 flex items-center justify-center border rounded overflow-hidden", // Added overflow-hidden for safety
                dark ? "border-gray-600" : "border-gray-300"
              )}
            >
              {/* 🔑 CORRECTED JSX: The <img> tag is now a direct child of the size/border container */}
              {/* Use a condition to show a placeholder if the URL is missing */}
              {MTPRO ? (
                <img
                  // Assuming 'image' in your original snippet refers to sponsorLogoUrl prop
                  src={MTPRO}
                  alt="Sponsor Logo"
                  // Use object-contain to ensure the logo fits without cropping
                  className="w-full h-full object-contain"
                />
              ) : (
                // Fallback text if the URL is empty
                <span className={textClass}>Logo Missing</span>
              )}
            </div>
            {/* Removed the extra/empty <img> tag and the extra <div> block */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDialog;
