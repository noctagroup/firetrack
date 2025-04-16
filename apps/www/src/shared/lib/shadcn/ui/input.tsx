import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { cn } from "~shared/lib/shadcn/utils"
import { composeEventHandlers, composeRefs } from "~shared/lib/utils"

type InputContextProps = {
  inputRef: React.RefObject<HTMLInputElement | null>
  disabled: boolean
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
  wrapBlurHandler: (handler: React.FocusEventHandler) => React.FocusEventHandler
  wrapClickHandler: (handler: React.MouseEventHandler) => React.MouseEventHandler
  wrapFocusHandler: (handler: React.FocusEventHandler) => React.FocusEventHandler
}

const initialState = {
  inputRef: { current: null },
  disabled: false,
  setDisabled: () => undefined,
  wrapBlurHandler: () => () => undefined,
  wrapClickHandler: () => () => undefined,
  wrapFocusHandler: () => () => undefined,
}

const InputContext = React.createContext<InputContextProps>(initialState)

function useInput() {
  return React.useContext(InputContext)
}

function useSyncDisabledProp({
  disabledProp,
  setDisabledProp,
}: {
  disabledProp?: InputContextProps["disabled"]
  setDisabledProp: InputContextProps["setDisabled"]
}) {
  React.useEffect(() => {
    if (typeof disabledProp !== "boolean") return undefined
    setDisabledProp(disabledProp)
  }, [disabledProp, setDisabledProp])
}

function InputProvider({
  className,
  onClick,
  onFocus,
  onBlur,
  disabled: disabledProp,
  ...props
}: React.ComponentProps<"fieldset">) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [disabled, setDisabled] = React.useState<boolean>(initialState.disabled)

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
      disabled,
      setDisabled,
      wrapClickHandler,
      wrapFocusHandler,
      wrapBlurHandler,
    }),
    [disabled, setDisabled, wrapClickHandler, wrapFocusHandler, wrapBlurHandler]
  )

  useSyncDisabledProp({
    disabledProp: disabledProp,
    setDisabledProp: setDisabled,
  })

  return (
    <InputContext.Provider value={inputContext}>
      <fieldset
        className={cn(
          "border-input dark:bg-input/30 flex h-9 w-full min-w-0 items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        disabled={inputContext.disabled}
        onClick={inputContext.wrapClickHandler(onClick!)}
        onFocus={inputContext.wrapFocusHandler(onFocus!)}
        onBlur={inputContext.wrapBlurHandler(onBlur!)}
        {...props}
      />
    </InputContext.Provider>
  )
}

function Input({
  className,
  ref,
  disabled: disabledProp,
  onFocus,
  onBlur,
  onClick,
  ...props
}: React.ComponentProps<"input">) {
  const inputContext = useInput()

  useSyncDisabledProp({
    disabledProp: disabledProp,
    setDisabledProp: inputContext.setDisabled,
  })

  return (
    <input
      ref={composeRefs(inputContext.inputRef, ref)}
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full flex-1 outline-0",
        className
      )}
      disabled={inputContext.disabled}
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
