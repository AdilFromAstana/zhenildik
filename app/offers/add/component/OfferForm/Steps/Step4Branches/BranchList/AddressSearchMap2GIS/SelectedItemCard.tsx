import React, { useState, useEffect } from "react";

type SelectedItemCardProps = {
    selectedItem: any;
    onClose: () => void;
    onConfirm: () => void;
};

const SelectedItemCard: React.FC<SelectedItemCardProps> = ({
    selectedItem,
    onClose,
    onConfirm,
}) => {
    const [photoUrls, setPhotoUrls] = useState<string[]>([]);

    useEffect(() => {
        // Пример извлечения URL-ов изображений из selectedItem
        // Структура данных может отличаться, адаптируйте под реальный API
        if (selectedItem?.external_content?.photos) {
            const urls = selectedItem.external_content.photos.map(
                (photo: any) => photo.url // или photo.src, в зависимости от структуры
            );
            setPhotoUrls(urls);
        } else {
            setPhotoUrls([]);
        }
    }, [selectedItem]);

    if (!selectedItem) return null;

    return (
        <div className="absolute bottom-0 left-0 w-full bg-white border-t shadow-lg rounded-t-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">
                    {selectedItem.full_name || selectedItem.name}
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>
            </div>

            {photoUrls.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto mb-3">
                    {photoUrls.slice(0, 5).map((url, i) => (
                        <img
                            key={i}
                            src={url}
                            alt="Фото"
                            className="h-24 w-32 object-cover rounded-lg border"
                        />
                    ))}
                </div>
            )}

            <button
                onClick={onConfirm}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Подтвердить адрес
            </button>
        </div>
    );
};

export default SelectedItemCard;