import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

import type { DropdownOption } from "@/components/ui/Dropdown";

countries.registerLocale(en);

export const countryOptions: DropdownOption[] =
  Object.entries(countries.getNames("en", { select: "official" }))
    .map(([code, name]) => ({
      value: code,
      label: name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));