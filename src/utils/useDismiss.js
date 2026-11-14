import { useEffect } from "react";

// Closes a popup on a click outside `ref` or on Escape (focus goes back to the button).
export const useDismiss = (ref, open, onClose, buttonRef) => {
  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onClose();
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        onClose();
        buttonRef?.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, open, onClose, buttonRef]);
};
