import { WizardFooter } from "@/components/wizard/WizardFooter";

interface AddCustomerFooterProps {
  primaryLabel?: string;
  secondaryLabel?: string;

  onPrimary: () => void;
  onSecondary?: () => void;

  loading?: boolean;
}

export function AddCustomerFooter({
  primaryLabel = "Next",
  secondaryLabel = "Save as Draft",
  onPrimary,
  onSecondary,
  loading,
}: AddCustomerFooterProps) {
  return (
    <WizardFooter
      primaryLabel={primaryLabel}
      secondaryLabel={secondaryLabel}
      onPrimary={onPrimary}
      onSecondary={onSecondary}
      loading={loading}
    />
  );
}