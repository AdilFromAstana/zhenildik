export default function OfferStats({ offer }: { offer: any }) {
  return (
    <div className="p-4">
      {offer.viewsCount != null && (
        <div>Просмотров: {offer.viewsCount.toLocaleString("ru-RU")}</div>
      )}
      {offer.purchasesCount != null && (
        <div>
          Покупок / использований:{" "}
          {offer.purchasesCount.toLocaleString("ru-RU")}
        </div>
      )}
      <div>
        Добавлено: {new Date(offer.createdAt).toLocaleDateString("ru-RU")}
      </div>
    </div>
  );
}
