import { StateOption } from "@/constants/address";

export interface StateBottomSheetProps {
  visible: boolean;

  countryCode?: string;

  value?: string;

  options: StateOption[];

  onSelect: (value: string) => void;

  onClose: () => void;
}