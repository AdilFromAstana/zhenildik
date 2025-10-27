// app/components/offer-form/OfferForm.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import CategorySelectorModal from "../CategorySelectorModal";
import BasicInfoSection from "./BasicInfoSection";
import PriceSection from "./PriceSection";
import ConditionsSection from "./ConditionsSection";
import DateRangeSection from "./DateRangeSection";
import PosterUploadSection from "./PosterUploadSection";
import SubmitSection from "./SubmitSection";

export type OfferFormValues = {
    title: string;
    description: string;
    offerType: string;
    hasMinPrice: boolean;
    minPrice: string;
    hasConditions: boolean;
    conditions: string;
    hasEndDate: boolean;
    startDate: string;
    endDate: string;
    posters: File[];
};

export type OfferType = {
    code: string;
    name: string;
    description: string;
    is_active: boolean;
};

export type OfferFormChangeHandler = <K extends keyof OfferFormValues>(
    field: K,
    value: OfferFormValues[K]
) => void;

export default function OfferForm() {
    const [modalOpen, setModalOpen] = useState(false);
    const [category, setCategory] = useState<any>(null);
    const [offerTypes, setOfferTypes] = useState<OfferType[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [wasSubmitted, setWasSubmitted] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [categoryPath, setCategoryPath] = useState<any[]>([]);

    const [values, setValues] = useState<OfferFormValues>({
        hasEndDate: false,
        title: "",
        description: "",
        offerType: "",
        hasMinPrice: false,
        minPrice: "",
        hasConditions: false,
        conditions: "",
        startDate: "",
        endDate: "",
        posters: [],
    });

    // Загрузка типов
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await fetch("http://localhost:5000/offer-types");
                const data = await res.json();
                setOfferTypes(data.filter((t: OfferType) => t.is_active));
            } catch (e) {
                console.error(e);
            }
        };
        fetchTypes();
    }, []);

    function validate(v: OfferFormValues) {
        const e: Record<string, string> = {};
        if (!v.title.trim()) e.title = "Введите название";
        if (!v.description.trim()) e.description = "Введите описание";
        if (!v.offerType) e.offerType = "Выберите тип предложения";
        if (v.hasMinPrice && (!v.minPrice.trim() || isNaN(Number(v.minPrice))))
            e.minPrice = "Укажите корректную цену";
        if (v.hasConditions && !v.conditions.trim())
            e.conditions = "Укажите условия";

        if (v.hasEndDate) {
            if (!v.startDate) e.startDate = "Укажите дату начала";
            if (!v.endDate) e.endDate = "Укажите дату окончания";
            if (v.startDate && v.endDate && v.startDate > v.endDate) {
                e.endDate = "Дата окончания не может быть раньше начала";
            }
        }
        return e;
    }

    const errors = useMemo(() => validate(values), [values]);

    function isValid(v: OfferFormValues) {
        return Object.keys(validate(v)).length === 0;
    }

    function handleChange<T extends keyof OfferFormValues>(
        field: T,
        val: OfferFormValues[T]
    ) {
        setValues((prev) => ({ ...prev, [field]: val }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        setSuccess(null);
        setWasSubmitted(true);

        if (!isValid(values)) return;

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);

            const offerType = offerTypes.find((t) => t.code === values.offerType);
            if (offerType) formData.append("offerTypeCode", String(offerType.code));

            formData.append("hasMinPrice", values.hasMinPrice ? "1" : "0");
            formData.append("hasConditions", values.hasConditions ? "1" : "0");
            formData.append("hasEndDate", values.hasEndDate ? "1" : "0");

            if (values.hasMinPrice) formData.append("minPrice", values.minPrice || "0");
            if (values.hasConditions) formData.append("conditions", values.conditions || "");
            if (values.hasEndDate) {
                formData.append("startDate", values.startDate);
                formData.append("endDate", values.endDate);
            }

            if (category?.id) {
                formData.append("categoryId", String(category.id));
            }

            values.posters.forEach((file) => {
                formData.append("posters", file);
            });

            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/offers", {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                body: formData,
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Ошибка при сохранении");
            }

            const data = await res.json();
            console.log("✅ Успешно создано:", data);

            setSuccess(true);
            setMessage("Предложение сохранено!");

            setValues({
                hasEndDate: false,
                title: "",
                description: "",
                offerType: "",
                hasMinPrice: false,
                minPrice: "",
                hasConditions: false,
                conditions: "",
                startDate: "",
                endDate: "",
                posters: [],
            });
            setCategory(null);
            setCategoryPath([]);
        } catch (err: any) {
            console.error(err);
            setSuccess(false);
            setMessage(err.message || "❌ Ошибка при сохранении");
        } finally {
            setSubmitting(false);
        }
    }

    const submitDisabled = submitting || !isValid(values);

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full space-y-8 md:p-8 md:bg-white md:border md:border-gray-200 md:shadow-sm md:rounded-xl"
        >
            <BasicInfoSection
                title={values.title}
                description={values.description}
                offerType={values.offerType}
                categoryPath={categoryPath}
                offerTypes={offerTypes}
                errors={errors}
                wasSubmitted={wasSubmitted}
                onChange={handleChange}
                onOpenCategoryModal={() => setModalOpen(true)}
            />

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <PriceSection
                        hasMinPrice={values.hasMinPrice}
                        minPrice={values.minPrice}
                        errors={errors}
                        wasSubmitted={wasSubmitted}
                        onChange={handleChange}
                    />
                    <ConditionsSection
                        hasConditions={values.hasConditions}
                        conditions={values.conditions}
                        errors={errors}
                        wasSubmitted={wasSubmitted}
                        onChange={handleChange}
                    />
                    <DateRangeSection
                        hasEndDate={values.hasEndDate}
                        startDate={values.startDate}
                        endDate={values.endDate}
                        errors={errors}
                        wasSubmitted={wasSubmitted}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <PosterUploadSection
                posters={values.posters}
                onChange={handleChange}
            />

            <SubmitSection
                submitting={submitting}
                submitDisabled={submitDisabled}
                message={message}
                success={success}
            />

            <CategorySelectorModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={(cat, fullPath) => {
                    setCategory(cat);
                    setCategoryPath(fullPath);
                }}
                initialCategoryPath={categoryPath}
                selectedCategoryId={category?.id || null}
            />
        </form>
    );
}