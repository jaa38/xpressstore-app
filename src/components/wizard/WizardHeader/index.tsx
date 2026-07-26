import { router } from "expo-router";

import { Divider } from "@/components/ui/Divider";
import { ScreenHeader } from "@/components/common/ScreenHeader";

interface WizardHeaderProps {
  title: string;

  step: number;

  totalSteps: number;

  progress: number;

  label: string;

  onClose: () => void;
}

export function WizardHeader({
  title,
  step,
  totalSteps,
  progress,
  label,
  onClose,
}: WizardHeaderProps) {
  return (
    <>
      <ScreenHeader
        title={title}
        subtitle={`Step ${step} of ${totalSteps}`}
        progress={progress}
        rightLabel={label}
        onClose={onClose}
      />

      <Divider />
    </>
  );
}
