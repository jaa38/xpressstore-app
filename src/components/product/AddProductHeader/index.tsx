import { router } from "expo-router";

import { Divider } from "@/components/ui/Divider";

import { ScreenHeader } from "@/components/common/ScreenHeader";

import { ROUTES } from "@/navigation/routes";

interface AddProductHeaderProps {
  title: string;

  step: number;

  totalSteps: number;

  progress: number;

  label: string;
}

export function AddProductHeader({
  title,
  step,
  totalSteps,
  progress,
  label,
}: AddProductHeaderProps) {
  return (
    <>
      <ScreenHeader
        title={title}
        subtitle={`Step ${step} of ${totalSteps}`}
        progress={progress}
        rightLabel={label}
        onClose={() => router.replace(ROUTES.PRODUCTS)}
      />

      <Divider />
    </>
  );
}