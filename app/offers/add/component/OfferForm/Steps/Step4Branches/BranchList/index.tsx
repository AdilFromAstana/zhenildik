"use client";

export type Branch = {
  id: string;
  name: string;
  address: string;
  coords: [number, number];
};

interface BranchListProps {
  branches: Branch[];
  onAddBranch: () => void;
  onEditBranch: (branch: Branch) => void;
  onRemoveBranch: (id: string) => void;
}

export default function BranchList({
  branches,
  onAddBranch,
  onEditBranch,
  onRemoveBranch,
}: BranchListProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Мои филиалы</h1>

      {branches.length === 0 ? (
        <div className="text-gray-500 text-center border border-dashed border-gray-300 rounded-lg p-6 mb-4">
          Пока нет филиалов
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="flex justify-between items-start bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  {branch.name}
                </h3>
                <p className="text-sm text-gray-500">{branch.address}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onEditBranch(branch)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Показать
                </button>
                <button
                  onClick={() => onRemoveBranch(branch.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onAddBranch}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
      >
        ➕ Добавить филиал
      </button>
    </div>
  );
}
