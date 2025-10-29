// app/components/offer-form/BasicInfoSection.tsx
import { Shapes, Type, FileText } from "lucide-react";
import { OfferFormChangeHandler, OfferType } from ".";
import { useEffect, useState } from "react";
import { FieldError, Input, RequiredMark, SelectField, Textarea } from "@/ui";

const TITLE_EXAMPLES = [
    "3 пиццы по цене 2",
    "Бесплатная доставка при заказе от 5000",
    "Скидка 50% на второй кофе",
    "Купи телефон — получи зарядку в подарок",
    "Абонемент на месяц всего за 19900",
];

type Props = {
    title: string;
    description: string;
    offerType: string;
    categoryPath: any[];
    offerTypes: OfferType[];
    errors: Record<string, string>;
    wasSubmitted: boolean;
    onChange: OfferFormChangeHandler;
    onOpenCategoryModal: () => void;
};

export default function BasicInfoSection({
    title,
    description,
    offerType,
    categoryPath,
    offerTypes,
    errors,
    wasSubmitted,
    onChange,
    onOpenCategoryModal,
}: Props) {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const typingSpeed = 80;   // скорость печати (мс на символ)
    const deletingSpeed = 40; // скорость удаления
    const pause = 2000;       // пауза перед стиранием

    const currentExample = TITLE_EXAMPLES[currentIndex];

    // Эффект для анимации
    useEffect(() => {
        if (title.trim() || isFocused) {
            // Если пользователь ввёл текст или в фокусе — останавливаем анимацию
            return;
        }

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Печатаем
                if (displayedText.length < currentExample.length) {
                    setDisplayedText(currentExample.slice(0, displayedText.length + 1));
                } else {
                    // Достигли конца — ждём, потом начнём стирать
                    setTimeout(() => setIsDeleting(true), pause);
                }
            } else {
                // Стираем
                if (displayedText.length > 0) {
                    setDisplayedText(displayedText.slice(0, -1));
                } else {
                    // Стерли всё — переходим к следующему примеру
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % TITLE_EXAMPLES.length);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentExample, title, isFocused]);

    // Сбрасываем анимацию, если пользователь начал вводить
    useEffect(() => {
        if (title.trim()) {
            setDisplayedText("");
        }
    }, [title]);

    return (
        <div className="space-y-6">
            <div className="relative">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Type className="w-4 h-4 text-blue-500" />
                    Название <RequiredMark />
                </label>

                <div className="relative">
                    <Input
                        error={!!(errors.title && wasSubmitted)}
                        value={title}
                        onChange={(e) => onChange("title", e.target.value)}
                        onFocus={() => {
                            setIsFocused(true);
                            setDisplayedText(""); // сразу убираем при фокусе
                        }}
                        onBlur={() => setIsFocused(false)}
                        placeholder="" // ← оставляем пустым!
                        className="pr-4"
                    />

                    {/* Кастомный "печатный" placeholder */}
                    {!title.trim() && !isFocused && (
                        <div className="absolute inset-0 flex items-center px-3 text-gray-400 pointer-events-none">
                            <span className="truncate">
                                Пример: {displayedText}
                            </span>

                            <span className="ml-1 animate-pulse">|</span>
                        </div>
                    )}
                </div>

                <FieldError message={wasSubmitted ? errors.title : undefined} />
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Описание <RequiredMark />
                </label>
                <Textarea
                    error={!!(errors.description && wasSubmitted)}
                    placeholder="Краткое описание предложения"
                    value={description}
                    onChange={(e) => onChange("description", e.target.value)}
                    className="min-h-[80px]"
                />
                <FieldError message={wasSubmitted ? errors.description : undefined} />
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Shapes className="w-4 h-4 text-blue-500" />
                    Категория товара/услуги <RequiredMark />
                </label>
                <button
                    type="button"
                    onClick={onOpenCategoryModal}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    {categoryPath.length > 0
                        ? categoryPath.map((c) => c.name).join(" / ")
                        : "Выбрать категорию"}
                </button>
            </div>

            <div>
                <SelectField
                    label={
                        <>
                            Тип предложения <RequiredMark />
                        </>
                    }
                    icon={<Shapes className="w-4 h-4 text-blue-500" />}
                    placeholder="Выберите тип"
                    value={offerType}
                    onChange={(val) => onChange("offerType", val)}
                    options={offerTypes.map((t) => ({
                        value: t.code,
                        label: (
                            <>
                                <div>{t.name}</div>
                                <div className="text-sm text-gray-500 mt-1">
                                    Пример: {t.description}
                                </div>
                            </>
                        ),
                    }))}
                />
                <FieldError message={wasSubmitted ? errors.offerType : undefined} />
            </div>
        </div>
    );
}