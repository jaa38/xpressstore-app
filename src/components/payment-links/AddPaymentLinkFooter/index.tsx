import { WizardFooter } from "@/components/wizard/WizardFooter";

interface AddPaymentLinkFooterProps {
  onSaveDraft?: () => void;

  onNext: () => void;

  nextLabel?: string;
}

export function AddPaymentLinkFooter({
  onSaveDraft,
  onNext,
  nextLabel = "Next",
}: AddPaymentLinkFooterProps) {
  return (
    <WizardFooter
      onPrimary={onNext}
      onSecondary={onSaveDraft}
      primaryLabel={nextLabel}
      secondaryLabel="Save as Draft"
    />
  );
}