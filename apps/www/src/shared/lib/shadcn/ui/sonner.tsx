import { Toaster as Sonner, type ToasterProps } from "sonner"

import { useTheme } from "~shared/hooks/use-theme"

const Toaster = ({ ...props }: ToasterProps) => {
  const themeContext = useTheme()

  return (
    <Sonner
      theme={themeContext.theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
