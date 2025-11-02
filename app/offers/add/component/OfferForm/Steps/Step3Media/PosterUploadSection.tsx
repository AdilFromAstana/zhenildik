// app/components/offer-form/PosterUploadSection.tsx
import { ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
    posters: File[];
    onChange: OfferFormChangeHandler;
};

export default function PosterUploadSection({ posters, onChange }: Props) {
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        const urls = posters.map((file) => URL.createObjectURL(file));
        setPreviews(urls);

        return () => {
            urls.forEach(URL.revokeObjectURL);
        };
    }, [posters]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        onChange("posters", [...posters, ...newFiles]);
    };

    const removePoster = (index: number) => {
        const updated = posters.filter((_, i) => i !== index);
        onChange("posters", updated);
    };

    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                Загрузка постеров
            </label>

            <label
                htmlFor="posterUpload"
                className="flex flex-col items-center justify-center w-full border-2 border-dashed border-blue-300 rounded-md p-4 text-center hover:bg-blue-50 transition cursor-pointer"
            >
                <ImageIcon className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-sm text-blue-600">
                    Перетащите изображения сюда или выберите файлы
                </span>
                <input
                    id="posterUpload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>

            {posters.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                    {posters.map((_, index) => (
                        <div
                            key={index}
                            className="relative group border border-gray-200 rounded-lg overflow-hidden"
                        >
                            <img
                                src={previews[index]}
                                alt={`poster-${index}`}
                                className="w-full h-32 object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removePoster(index)}
                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                                title="Удалить"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}