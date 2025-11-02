"use client";
import BranchList, { Branch } from "./BranchList";

type Step4BranchesProps = {
  branches: Branch[];
  onAddBranch: () => void;
  onEditBranch: (branch: any) => void;
  onRemoveBranch: (id: string) => void;
};

const Step4Branches: React.FC<Step4BranchesProps> = ({
  branches,
  onAddBranch,
  onEditBranch,
  onRemoveBranch,
}) => {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 text-base">
        Укажите один или несколько филиалов вашей компании. Это поможет
        пользователям видеть, где действует ваше предложение.
      </p>
      <BranchList
        branches={branches}
        onAddBranch={onAddBranch}
        onEditBranch={onEditBranch}
        onRemoveBranch={onRemoveBranch}
      />
    </div>
  );
};
export default Step4Branches;
