import { Offer } from "app/offers/my/page";
import { Info, ExternalLink } from "lucide-react";

export default function OfferPartnerCard({ offer }: { offer: Offer }) {
  const user = offer.user;
  const partner = user?.name || "Партнёр";

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-4 ">
        <img
          src={user?.avatar || "https://placehold.co/56x56/E0E0E0/888?text=P"}
          alt={partner}
          className="w-14 h-14 rounded-full border-4 border-primary-orange/20 object-cover"
        />
        <div>
          <p className="text-xl font-black text-gray-800">{partner}</p>
          <p className="text-sm text-gray-500">
            {offer.cityCode.toUpperCase()} •{" "}
            {offer.category?.name ?? "Категория"}
          </p>
        </div>
      </div>
      <p className="text-gray-700 flex items-start mb-1">
        <Info className="w-5 h-5 mr-2 text-primary-orange" />{" "}
        <span className="font-medium mr-2">Условия акции:</span>
      </p>
      <p className="text-gray-600 pl-7 text-sm">
        {offer.eligibility?.discount_text_raw ?? "—"} (
        {offer.eligibility?.channel_codes?.join(", ") ?? "—"})
      </p>
      <button className="mt-3 text-sm text-accent-blue hover:underline font-semibold flex items-center">
        Все акции партнёра{" "}
        <ExternalLink className="w-4 h-4 ml-1 text-accent-blue" />
      </button>
    </div>
  );
}
