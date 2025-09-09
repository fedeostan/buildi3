export type DueDateState = "neutral" | "green" | "yellow" | "red";

export type DueDateDropdownProps = {
  label?: string; // "Due date"
  value: Date | null; // current due date (null → not set)
  onSelect?: (date: Date | null) => void; // selects date immediately (pending in parent)
  disabled?: boolean;
  errorMessage?: string;
  bottomSheetTitle?: string; // "Choose due date"
  containerStyle?: any;
  fieldStyle?: any;
  labelStyle?: any;
  selectedTextStyle?: any;
};
