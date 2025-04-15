import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { cn } from "~shared/lib/shadcn/utils"

// type InputContextProps = {}

// const InputContext = React.createContext<InputContextProps | undefined>(undefined)

// const useInput = () => React.useContext(InputContext)

function InputProvider({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-input dark:bg-input/30 flex h-9 w-full min-w-0 items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full flex-1 outline-0",
        className
      )}
      {...props}
    />
  )
}

function InputAdornment({
  className,
  asChild,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : typeof props.children === "string" ? "p" : "div"

  return (
    <Comp
      className={cn("text-muted-foreground flex items-center [&_svg]:size-4", className)}
      {...props}
    />
  )
}

export { Input, InputAdornment, InputProvider }
