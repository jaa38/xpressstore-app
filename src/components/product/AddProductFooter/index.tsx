import { WizardFooter } from "@/components/wizard/WizardFooter";

interface AddProductFooterProps {
  onSaveDraft?: () => void;

  onNext: () => void;

  nextLabel?: string;
}

export function AddProductFooter({
  onSaveDraft,
  onNext,
  nextLabel = "Next",
}: AddProductFooterProps) {
  return (
    <WizardFooter
      onPrimary={onNext}
      onSecondary={onSaveDraft}
      primaryLabel={nextLabel}
      secondaryLabel="Save as Draft"
    />
  );
}