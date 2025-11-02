import React from "react";

type Props = {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
};

const StepNavigation: React.FC<Props> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
}) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex space-x-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1}
        className={`w-1/2 px-3 py-2 text-md font-semibold border rounded-xl transition focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 ${
          currentStep === 1
            ? "opacity-50 cursor-not-allowed border-blue-300 text-blue-300 bg-white"
            : "text-blue-600 border-blue-600 bg-white hover:bg-blue-50"
        }`}
      >
        Назад
      </button>

      <button
        onClick={onNext}
        className={`w-1/2 px-3 py-2 text-md font-semibold text-white rounded-xl transition focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 shadow-lg ${
          isLastStep
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLastStep ? "Опубликовать" : "Далее"}
      </button>
    </div>
  );
};

export default StepNavigation;
