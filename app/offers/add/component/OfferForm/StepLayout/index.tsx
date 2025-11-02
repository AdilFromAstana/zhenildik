import React from "react";
import StepHeader from "./StepHeader";
import StepNavigation from "./StepNavigation";

type StepLayoutProps = {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  children: React.ReactNode;
};

const StepLayout: React.FC<StepLayoutProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  children,
}) => {
  return (
    <div className="flex-1 w-full flex flex-col justify-between gap-4 p-4 md:p-8 md:bg-white md:border md:border-gray-200 md:shadow-sm md:rounded-xl">
      <div className="flex flex-col gap-6">
        <StepHeader currentStep={currentStep} totalSteps={totalSteps} />
        {children}
      </div>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={onNext}
        onPrev={onPrev}
      />
    </div>
  );
};
export default StepLayout;
