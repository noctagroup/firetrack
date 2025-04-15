import * as React from "react"

import { cn } from "~shared/lib/shadcn/utils"

function InputProvider({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-input dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex-1 px-3 py-1 text-base outline-0 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input, InputProvider }
