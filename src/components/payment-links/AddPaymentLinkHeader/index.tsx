import { router } from "expo-router";

import { WizardHeader } from "@/components/wizard/WizardHeader";

import { ROUTES } from "@/navigation/routes";

interface AddPaymentLinkHeaderProps {
  title: string;

  step: number;

  totalSteps: number;

  progress: number;

  label: string;
}

export function AddPaymentLinkHeader({
  title,
  step,
  totalSteps,
  progress,
  label,
}: AddPaymentLinkHeaderProps) {
  return (
    <WizardHeader
      title={title}
      step={step}
      totalSteps={totalSteps}
      progress={progress}
      label={label}
      onClose={() => router.replace(ROUTES.PAYMENT_LINKS)}
    />
  );
}