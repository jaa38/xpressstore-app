import { DropdownOption } from "@/components/ui/Dropdown/SearchableDropdown";

export interface StateOption extends DropdownOption {
  countryCode: string;
}

export const stateOptions: StateOption[] = [
  // Nigeria
  {
    label: "Lagos",
    value: "Lagos",
    countryCode: "NG",
  },
  {
    label: "Abuja",
    value: "Abuja",
    countryCode: "NG",
  },
  {
    label: "Rivers",
    value: "Rivers",
    countryCode: "NG",
  },
  {
    label: "Kano",
    value: "Kano",
    countryCode: "NG",
  },

  // United Kingdom
  {
    label: "England",
    value: "England",
    countryCode: "GB",
  },
  {
    label: "Scotland",
    value: "Scotland",
    countryCode: "GB",
  },
  {
    label: "Wales",
    value: "Wales",
    countryCode: "GB",
  },
];