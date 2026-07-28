import { router } from "expo-router";

import { WizardHeader } from "@/components/wizard/WizardHeader";

interface AddCustomerHeaderProps {
  title: string;
  step: number;
  totalSteps: number;
  progress: number;
  label: string;
}

export function AddCustomerHeader({
  title,
  step,
  totalSteps,
  progress,
  label,
}: AddCustomerHeaderProps) {
  return (
    <WizardHeader
      title={title}
      step={step}
      totalSteps={totalSteps}
      progress={progress}
      label={label}
      onClose={() => router.back()}
    />
  );
}