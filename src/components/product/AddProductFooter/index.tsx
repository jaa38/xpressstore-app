import { WizardFooter } from "@/components/wizard/WizardFooter";

interface AddProductFooterProps {
  onSaveDraft?: () => void;

  onNext: () => void;

  nextLabel?: string;

  loading?: boolean;

  disabled?: boolean;
}

export function AddProductFooter({
  onSaveDraft,
  onNext,
  nextLabel = "Next",
  loading = false,
  disabled = false,
}: AddProductFooterProps) {
  return (
    <WizardFooter
      onPrimary={onNext}
      onSecondary={onSaveDraft}
      primaryLabel={nextLabel}
      secondaryLabel="Save as Draft"
      loading={loading}
      disabled={disabled}
    />
  );
}