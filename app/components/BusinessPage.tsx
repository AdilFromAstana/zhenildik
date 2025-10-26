// src/app/components/BusinessPage.tsx
'use client'; // Использует состояние и эффекты
import React, { useState } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { InputField, TextareaField, SelectField } from './FormFields'; // Предполагаем, что формы вынесены
import { categories } from '../data/mocks'; // Импортируем категории

interface BusinessPageProps {
    onBack: () => void;
}

const BusinessPage: React.FC<BusinessPageProps> = ({ onBack }) => {
    const [formData, setFormData] = useState({
        title: '', category: '', discountValue: '', imageUrl: '', address: '', startDate: '', endDate: '', description: '',
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        console.log('Отправка данных:', formData);
        setTimeout(() => {
            setStatus('success');
            setFormData({ title: '', category: '', discountValue: '', imageUrl: '', address: '', startDate: '', endDate: '', description: '' });
        }, 2000);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-6 max-w-2xl">
                <button
                    onClick={onBack}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium transition"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Назад
                </button>
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Разместить акцию</h1>
                    <p className="text-gray-500 mb-6">Заполните форму, чтобы ваше предложение увидели тысячи пользователей Казахстана.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField label="Название акции" name="title" value={formData.title} onChange={handleChange} placeholder="Скидка 30% на пиццу" required />
                        <SelectField
                            label="Категория товара/услуги"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            options={categories.map(c => c.name)}
                            required
                        />
                        <InputField label="Процент или сумма скидки (Пример: 30% или 5000 ₸)" name="discountValue" value={formData.discountValue} onChange={handleChange} placeholder="30% или 5000 ₸" required />
                        <InputField label="Ссылка на фото/баннер акции" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
                        <InputField label="Адрес заведения" name="address" value={formData.address} onChange={handleChange} placeholder="ул. Сейфуллина, 45, Астана" required />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Дата начала" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                            <InputField label="Дата окончания" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
                        </div>
                        <TextareaField label="Краткое описание и условия участия" name="description" value={formData.description} onChange={handleChange} placeholder="Подробно опишите, как воспользоваться акцией и ограничения." required />
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center transition duration-300 hover:bg-orange-700 shadow-lg disabled:bg-gray-400"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Публикация...
                                    </>
                                ) : (
                                    'Публиковать Акцию'
                                )}
                            </button>
                        </div>
                        {status === 'success' && (
                            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-xl font-medium text-center">
                                Акция успешно отправлена на модерацию!
                            </div>
                        )}
                    </form>
                    <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                        <p className="font-semibold text-gray-700">Хотите выделиться?</p>
                        <p className="text-sm text-gray-600">
                            Выделитесь в <strong>ТОП</strong> и увеличьте охват за <span className="text-lg font-bold text-blue-600">5000 ₸ / неделю</span>. Свяжитесь с нами после публикации!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessPage;