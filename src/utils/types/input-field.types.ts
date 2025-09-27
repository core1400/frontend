import type { ChangeEvent } from "react";

export interface InputFieldProps {
  label: string;
  type: "text" | "number" | "password";
  value: string | number;
  valueColor: string;
  labelBgColor: string;
  textBorderColor: string;
  width?: string;
  height?: string;
  textSize?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}