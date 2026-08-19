import { router } from "expo-router";

import { WizardHeader } from "@/components/wizard/WizardHeader";

import { ROUTES } from "@/navigation/routes";

interface AddStoreHeaderProps {
  title: string;
  step: number;
  totalSteps: number;
  progress: number;
  label: string;
}

export function AddStoreHeader({
  title,
  step,
  totalSteps,
  progress,
  label,
}: AddStoreHeaderProps) {
  return (
    <WizardHeader
      title={title}
      step={step}
      totalSteps={totalSteps}
      progress={progress}
      label={label}
      onClose={() => router.replace(ROUTES.STORE)}
    />
  );
}