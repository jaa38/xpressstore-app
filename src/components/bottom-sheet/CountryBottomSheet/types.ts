import { DropdownOption } from "@/components/ui/Dropdown/SearchableDropdown";

export interface CountryBottomSheetProps<
  TValue extends string = string,
> {
  /**
   * Controls the visibility of the bottom sheet.
   */
  visible: boolean;

  /**
   * Currently selected country value.
   */
  value?: TValue;

  /**
   * List of all available countries.
   */
  options: DropdownOption<TValue>[];

  /**
   * Countries displayed in the "Popular" section.
   */
  popularOptions?: DropdownOption<TValue>[];

  /**
   * Called when a country is selected.
   */
  onSelect: (value: TValue) => void;

  /**
   * Called when the bottom sheet is dismissed.
   */
  onClose: () => void;
}