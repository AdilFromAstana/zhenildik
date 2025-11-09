"use client";
import { ExternalLink, CheckCircle } from "lucide-react";
import { formatPrice } from "../utils/offerHelpers";
import { Offer } from "app/offers/my/page";

export default function OfferPriceBlock({ offer }: { offer: Offer }) {
  const source = offer.eligibility?.source_link;
  const oldPrice = formatPrice(offer.oldPrice);
  const newPrice = formatPrice(offer.newPrice);
  const discountAmount = formatPrice(offer.discountPercent);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-base font-medium text-gray-600">
              Цена сейчас:
            </span>
            <div className="text-5xl text-primary-orange font-black leading-none">
              {newPrice} ₸
            </div>
          </div>
          <div>
            <div className="text-lg text-gray-400 line-through">
              ~{oldPrice} ₸
            </div>
            <div className="text-base font-semibold text-green-600 mt-1">
              Экономия {discountAmount} ₸
            </div>
          </div>
        </div>

        {source && (
          <a
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center py-3 px-8 rounded-xl text-white font-bold text-xl bg-gradient-to-r from-primary-orange to-dark-orange shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1"
          >
            Перейти в Wolt
            <ExternalLink className="ml-2 w-5 h-5 text-white" />
          </a>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500 flex items-center pt-4 border-t border-gray-100">
        <CheckCircle className="text-green-500 w-4 h-4 mr-1" />
        Скидка применяется автоматически по ссылке.
      </p>
    </div>
  );
}
