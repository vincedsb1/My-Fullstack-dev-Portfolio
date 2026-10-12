"use client";

import React, { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
