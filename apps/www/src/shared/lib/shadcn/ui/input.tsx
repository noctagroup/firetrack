import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { cn } from "~shared/lib/shadcn/utils"
import { composeEventHandlers, composeRefs } from "~shared/lib/utils"

type InputContextProps = {
  inputRef: React.RefObject<HTMLInputElement | null>
  wrapBlurHandler: (handler: React.FocusEventHandler) => React.FocusEventHandler
  wrapClickHandler: (handler: React.MouseEventHandler) => React.MouseEventHandler
  wrapFocusHandler: (handler: React.FocusEventHandler) => React.FocusEventHandler
}

const noop = () => () => undefined

const InputContext = React.createContext<InputContextProps>({
  inputRef: { current: null },
  wrapBlurHandler: noop,
  wrapClickHandler: noop,
  wrapFocusHandler: noop,
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

  const wrapClickHandler = React.useCallback<InputContextProps["wrapClickHandler"]>(
    (onClick) =>
      composeEventHandlers(onClick, (event) => {
        if (!(inputRef.current && event.currentTarget === event.target)) return undefined
        inputRef.current.focus()
      }),
    []
  )

  const wrapFocusHandler = React.useCallback<InputContextProps["wrapFocusHandler"]>(
    (onFocus) =>
      composeEventHandlers(onFocus, (event) => {
        if (!(inputRef.current && event.currentTarget === event.target)) return undefined
        inputRef.current.focus()
      }),
    []
  )

  const wrapBlurHandler = React.useCallback<InputContextProps["wrapBlurHandler"]>(
    (onBlur) =>
      composeEventHandlers(onBlur, (event) => {
        if (!(inputRef.current && event.currentTarget === event.target)) return undefined
        inputRef.current.blur()
      }),
    []
  )

  const inputContext = React.useMemo<InputContextProps>(
    () => ({
      inputRef,
      wrapClickHandler,
      wrapFocusHandler,
      wrapBlurHandler,
    }),
    [wrapClickHandler, wrapFocusHandler, wrapBlurHandler]
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
        onClick={wrapClickHandler(onClick!)}
        onFocus={wrapFocusHandler(onFocus!)}
        onBlur={wrapBlurHandler(onBlur!)}
        {...props}
      />
    </InputContext.Provider>
  )
}

function Input({
  className,
  ref,
  onFocus,
  onBlur,
  onClick,
  ...props
}: React.ComponentProps<"input">) {
  const inputContext = useInput()

  return (
    <input
      ref={composeRefs(inputContext?.inputRef, ref)}
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full flex-1 outline-0",
        className
      )}
      onClick={inputContext.wrapClickHandler(onClick!)}
      onFocus={inputContext.wrapFocusHandler(onFocus!)}
      onBlur={inputContext.wrapBlurHandler(onBlur!)}
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
