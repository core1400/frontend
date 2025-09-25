import type { ChangeEvent } from "react";

export interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
