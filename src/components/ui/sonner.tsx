import * as React from "react";
import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

const Sonner = ({ ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      {...props}
      toastOptions={{
        style: {
          background: "white",
          color: "black",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
        },
        className: "shadow-lg",
      }}
      position="top-right"
      expand
      visibleToasts={5}
      duration={4000}
      gap={12}
      className="toaster-group"
    />
  );
};

export { Sonner };