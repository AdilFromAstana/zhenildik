import axiosInstance from "@/lib/axiosInstance";
import { OfferFormValues } from "..";

export const validateStep = (step: number, values: OfferFormValues, category: any, city: any) => {
    const errors: Record<string, string> = {};

    if (step === 1) {
        if (!values.title.trim()) errors.title = "Введите название";
        if (!values.description.trim()) errors.description = "Введите описание";
        if (!values.offerType) errors.offerType = "Выберите тип предложения";
        if (!category?.id) errors.categoryId = "Выберите категорию";
        if (!city?.slug) errors.cityCode = "Выберите город";
    } else if (step === 2) {
        if (values.hasMinPrice && (!values.minPrice.trim() || isNaN(Number(values.minPrice)))) {
            errors.minPrice = "Укажите корректную цену";
        }
        if (values.hasConditions && !values.conditions.trim()) {
            errors.conditions = "Укажите условия";
        }
        if (values.hasEndDate) {
            if (!values.startDate) errors.startDate = "Укажите дату начала";
            if (!values.endDate) errors.endDate = "Укажите дату окончания";
            if (values.startDate && values.endDate && values.startDate > values.endDate) {
                errors.endDate = "Дата окончания не может быть раньше начала";
            }
        }
    }
    // На шаге 3 можно добавить валидацию постеров, если нужно

    return errors;
};

export const submitForm = async (values: OfferFormValues, category: any, city: any, router: any) => {
    const payload: any = {
        title: values.title,
        description: values.description,
        offerTypeCode: values.offerType,
        hasMinPrice: values.hasMinPrice,
        hasConditions: values.hasConditions,
        hasEndDate: values.hasEndDate,
        categoryId: category.id,
        cityCode: city.slug,
    };

    if (values.hasMinPrice) payload.minPrice = values.minPrice;
    if (values.hasConditions) payload.conditions = values.conditions;
    if (values.hasEndDate) {
        payload.startDate = values.startDate;
        payload.endDate = values.endDate;
    }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, val]) => {
        formData.append(key, String(val));
    });
    values.posters.forEach((file) => formData.append("posters", file));

    const { data } = await axiosInstance.post("/offers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
};