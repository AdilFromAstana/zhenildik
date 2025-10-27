"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import Modal from "@/app/ui/Modal";

export type Category = {
    id: number;
    slug: string;
    name: string;
    icon?: string | null;
};

interface CategorySelectorModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (category: Category, fullPath: Category[]) => void;
    initialCategoryPath?: Category[];
    selectedCategoryId?: number | null; // ← новое
}

export default function CategorySelectorModal({
    open,
    onClose,
    onSelect,
    initialCategoryPath = [],
    selectedCategoryId
}: CategorySelectorModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async (parentId?: number) => {
        setLoading(true);
        try {
            const url = parentId
                ? `${process.env.NEXT_PUBLIC_API_URL}/categories?parentId=${parentId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/categories`;
            const res = await fetch(url);
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error("Ошибка при загрузке категорий:", err);
        } finally {
            setLoading(false);
        }
    };

    // При открытии — восстанавливаем путь
    useEffect(() => {
        if (open) {
            if (initialCategoryPath.length > 0) {
                // Убираем последнюю категорию (это сама выбранная), чтобы показать её родителя
                const pathWithoutLeaf = initialCategoryPath.slice(0, -1);
                setBreadcrumbs(pathWithoutLeaf);

                const parentId = pathWithoutLeaf.length > 0
                    ? pathWithoutLeaf[pathWithoutLeaf.length - 1].id
                    : undefined;

                fetchCategories(parentId);
            } else {
                setBreadcrumbs([]);
                fetchCategories();
            }
        }
    }, [open, initialCategoryPath]);

    const handleCategoryClick = async (category: Category) => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/categories?parentId=${category.id}`;
        const res = await fetch(url);
        const subcategories = await res.json();

        if (subcategories.length === 0) {
            const fullPath = [...breadcrumbs, category]; // ← включаем саму категорию
            onSelect(category, fullPath);
            onClose();
        } else {
            setBreadcrumbs((prev) => [...prev, category]);
            setCategories(subcategories);
        }
    };

    const handleBack = () => {
        const newBreadcrumbs = [...breadcrumbs];
        newBreadcrumbs.pop();
        setBreadcrumbs(newBreadcrumbs);
        const parent = newBreadcrumbs[newBreadcrumbs.length - 1];
        fetchCategories(parent?.id);
    };

    // Формируем строку хлебных крошек для отображения в модалке (опционально)
    const breadcrumbText = breadcrumbs.length > 0
        ? breadcrumbs.map(b => b.name).join(" / ") + " /"
        : "Корень";

    return (
        <Modal isOpen={open} onClose={onClose} title="Выбор категории">
            {/* Breadcrumbs */}
            <div className="text-sm text-gray-500 mb-2">
                {breadcrumbText}
            </div>

            {/* Back button */}
            {breadcrumbs.length > 0 && (
                <button
                    onClick={handleBack}
                    className="flex items-center text-sm text-gray-600 mb-2 hover:text-black"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Назад
                </button>
            )}

            {/* Categories list */}
            {categories.length > 0 ? (
                <div className="flex flex-col gap-1">
                    {categories.map((cat) => {
                        const isSelected = cat.id === selectedCategoryId;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat)}
                                className={`flex justify-between items-center px-3 py-2 rounded-lg transition ${isSelected
                                    ? "bg-blue-100 border border-blue-300 text-blue-700"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                <span>{cat.name}</span>
                                {isSelected ? (
                                    <CheckCircle2 size={16} className="text-blue-500" />
                                ) : (
                                    <ChevronRight size={16} className="text-gray-400" />
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-6 text-sm">Нет категорий</div>
            )}
        </Modal>
    );
}