"use client";

const defaultTitles = [
  "Шаг 1 из 4: Основная информация",
  "Шаг 2 из 4: Детали и условия",
  "Шаг 3 из 4: Визуальное оформление",
  "Шаг 4 из 4: Филиалы компании",
];

type StepHeaderProps = {
  currentStep: number;
  totalSteps?: number;
  titles?: string[];
};

export default function StepHeader({
  currentStep,
  totalSteps = defaultTitles.length,
  titles = defaultTitles,
}: StepHeaderProps) {
  const title = titles[currentStep - 1] ?? "";

  return (
    <div className="grid grid-cols-4 gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        const color =
          step === currentStep
            ? "bg-blue-600"
            : step < currentStep
            ? "bg-blue-400"
            : "bg-gray-300";
        return (
          <span
            key={step}
            className={`w-full h-1 rounded-md ${color} transition-all duration-300`}
          />
        );
      })}
    </div>
  );
}
