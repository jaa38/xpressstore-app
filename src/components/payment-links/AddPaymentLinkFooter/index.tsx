import { WizardFooter } from "@/components/wizard/WizardFooter";

interface AddPaymentLinkFooterProps {
  onPrimary: () => void;

  onSecondary?: () => void;

  primaryLabel?: string;

  secondaryLabel?: string;
}

export function AddPaymentLinkFooter({
  onPrimary,
  onSecondary,
  primaryLabel = "Next",
  secondaryLabel = "Save as Draft",
}: AddPaymentLinkFooterProps) {
  return (
    <WizardFooter
      onPrimary={onPrimary}
      onSecondary={onSecondary}
      primaryLabel={primaryLabel}
      secondaryLabel={secondaryLabel}
    />
  );
}
