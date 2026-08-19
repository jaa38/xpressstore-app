import { WizardFooter } from "@/components/wizard/WizardFooter";

interface AddStoreFooterProps {
  onPrimary: () => void;
  onSecondary?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export function AddStoreFooter({
  onPrimary,
  onSecondary,
  primaryLabel = "Next",
  secondaryLabel = "Save as Draft",
}: AddStoreFooterProps) {
  return (
    <WizardFooter
      onPrimary={onPrimary}
      onSecondary={onSecondary}
      primaryLabel={primaryLabel}
      secondaryLabel={secondaryLabel}
    />
  );
}
