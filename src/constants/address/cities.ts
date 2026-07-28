import { DropdownOption } from "@/components/ui/Dropdown/SearchableDropdown";

export interface CityOption extends DropdownOption {
  countryCode: string;
  stateCode: string;
}

export const cityOptions: CityOption[] = [
  {
    label: "Ikeja",
    value: "Ikeja",
    countryCode: "NG",
    stateCode: "Lagos",
  },
  {
    label: "Lekki",
    value: "Lekki",
    countryCode: "NG",
    stateCode: "Lagos",
  },
  {
    label: "Victoria Island",
    value: "Victoria Island",
    countryCode: "NG",
    stateCode: "Lagos",
  },
  {
    label: "Garki",
    value: "Garki",
    countryCode: "NG",
    stateCode: "Abuja",
  },
];
