// components/LocalButton.tsx
import React from "react";

// --- Local Button Component ---
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  // Merged the base Tailwind classes for consistency
  const defaultClasses = "border rounded-md px-3 py-2 transition duration-200 ease-in-out hover:opacity-80";
  return (
    <button
      type="button"
      className={`${defaultClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;