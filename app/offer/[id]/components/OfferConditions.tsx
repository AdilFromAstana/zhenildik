import { Offer } from "app/offers/my/page";

export default function OfferConditions({ offer }: { offer: Offer }) {
  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold mb-3 text-gray-900">
        Условия акции
      </h2>
      <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
        {offer.startDate && (
          <li>
            Начало действия:{" "}
            {new Date(offer.startDate).toLocaleDateString("ru-RU")}
          </li>
        )}
        {offer.endDate && (
          <li>
            Действует до: {new Date(offer.endDate).toLocaleDateString("ru-RU")}
          </li>
        )}
        <li>Тип выгоды: {offer.benefitKind || "специальное предложение"}</li>
        {offer.scope && <li>Охват: {offer.scope}</li>}
        <li>Скидка не суммируется с другими акциями, если не указано иное.</li>
        <li>Пожалуйста, уточняйте детали у партнёра перед визитом.</li>
      </ul>
    </div>
  );
}
