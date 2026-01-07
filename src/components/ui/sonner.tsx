import * as React from "react";
import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

const Sonner = ({ ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      {...props}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border-border group-[.toast]:shadow-xl group-[.toast]:rounded-lg group-[.toast]:p-4 group-[.toast]:font-semibold group-[.toast]:text-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground hover:group-[.toast]:bg-muted-foreground hover:group-[.toast]:text-muted",
        },
      }}
      className="toaster-group"
      position="top-right"
      richColors
      expand
      visibleToasts={5}
      duration={3000}
    />
  );
};

export { Sonner };