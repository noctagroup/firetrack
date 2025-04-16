import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { cn } from "~shared/lib/shadcn/utils"
import { composeEventHandlers, composeRefs } from "~shared/lib/utils"

type InputContextProps = {
  inputRef: React.RefObject<HTMLInputElement | null>
  handleBlur: (handler: React.FocusEventHandler) => React.FocusEventHandler
  handleClick: (handler: React.MouseEventHandler) => React.MouseEventHandler
  handleFocus: (handler: React.FocusEventHandler) => React.FocusEventHandler
}

const noop = () => () => undefined

const InputContext = React.createContext<InputContextProps>({
  inputRef: { current: null },
  handleBlur: noop,
  handleClick: noop,
  handleFocus: noop,
})

const useInput = () => React.useContext(InputContext)

function InputProvider({
  className,
  onClick,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<"div">) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleClick = React.useCallback<InputContextProps["handleClick"]>(
    (onClick) =>
      composeEventHandlers(onClick, () => {
        if (!inputRef.current) {
          return undefined
        }
        inputRef.current.focus()
      }),
    []
  )

  const handleFocus = React.useCallback<InputContextProps["handleFocus"]>(
    (onFocus) =>
      composeEventHandlers(onFocus, () => {
        if (!inputRef.current) {
          return undefined
        }
        inputRef.current.focus()
      }),
    []
  )

  const handleBlur = React.useCallback<InputContextProps["handleBlur"]>(
    (onBlur) =>
      composeEventHandlers(onBlur, () => {
        if (!inputRef.current) {
          return undefined
        }
        inputRef.current.blur()
      }),
    []
  )

  const inputContext = React.useMemo<InputContextProps>(
    () => ({
      inputRef,
      handleClick,
      handleFocus,
      handleBlur,
    }),
    [handleClick, handleFocus, handleBlur]
  )

  return (
    <InputContext.Provider value={inputContext}>
      <div
        className={cn(
          "border-input dark:bg-input/30 flex h-9 w-full min-w-0 items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        onClick={handleClick(onClick!)}
        onFocus={handleFocus(onFocus!)}
        onBlur={handleBlur(onBlur!)}
        {...props}
      />
    </InputContext.Provider>
  )
}

function Input({ className, ref, onFocus, onBlur, ...props }: React.ComponentProps<"input">) {
  const inputContext = useInput()

  return (
    <input
      ref={composeRefs(inputContext?.inputRef, ref)}
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full flex-1 outline-0",
        className
      )}
      onFocus={inputContext.handleFocus(onFocus!)}
      onBlur={inputContext.handleBlur(onBlur!)}
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
