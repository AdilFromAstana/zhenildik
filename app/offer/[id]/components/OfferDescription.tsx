import { Offer } from "app/offers/my/page";

export default function OfferDescription({ offer }: { offer: Offer }) {
  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold mb-3 text-gray-900">
        Описание предложения
      </h2>
      {offer.description ? (
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
          {offer.description}
        </p>
      ) : (
        <p className="text-sm text-gray-500">Описание скоро будет добавлено.</p>
      )}
    </div>
  );
}
