"use client";
import { createContext, useContext, type ReactNode } from "react";
type Messages = { locale: string; error: string; retry: string; home: string };
const Context = createContext<Messages>({
  locale: "en",
  error: "",
  retry: "",
  home: "",
});
export const useErrorMessages = () => useContext(Context);
export function ErrorMessages({
  children,
  messages,
}: {
  children: ReactNode;
  messages: Messages;
}) {
  return <Context.Provider value={messages}>{children}</Context.Provider>;
}
