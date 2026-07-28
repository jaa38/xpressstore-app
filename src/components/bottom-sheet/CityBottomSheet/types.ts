import { CityOption } from "@/constants/address";

export interface CityBottomSheetProps {
  visible: boolean;

  countryCode?: string;

  stateCode?: string;

  value?: string;

  options: CityOption[];

  onSelect: (value: string) => void;

  onClose: () => void;
}