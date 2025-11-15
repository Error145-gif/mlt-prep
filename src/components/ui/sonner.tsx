import type { CSSProperties } from "react";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ theme: themeProp, ...props }: ToasterProps) => {
  // Fallback to a safe default theme without requiring any ThemeProvider
  const theme = (themeProp ?? "light") as ToasterProps["theme"];

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster }