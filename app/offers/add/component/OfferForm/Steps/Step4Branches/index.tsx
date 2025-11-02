"use client";
import React from "react";
import BranchList from "./BranchList";

type Step4BranchesProps = {
    branches: {
        id: string;
        name: string;
        address: string;
        coords: [number, number];
    }[];
    onAddBranch: () => void;
    onEditBranch: (branch: any) => void;
    onRemoveBranch: (id: string) => void;
};

export default function Step4Branches({
    branches,
    onAddBranch,
    onEditBranch,
    onRemoveBranch,
}: Step4BranchesProps) {
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
}
