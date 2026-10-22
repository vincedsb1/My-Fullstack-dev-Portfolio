"use client";

import React, { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/ThemeContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
