import React from "react";
import { OfferDetails } from "../utils/fetchOffer";

export default function OfferBreadcrumbs({ offer }: { offer: OfferDetails }) {
  return (
    <nav className="mb-4 text-sm text-gray-500 flex flex-wrap gap-1">
      <a href="/" className="hover:text-blue-600">
        Skidka-Bar.kz
      </a>
      <span>/</span>
      <a
        href={`/offers/${offer.cityCode}`}
        className="hover:text-blue-600 capitalize"
      >
        {offer.cityName || offer.cityCode}
      </a>
      {offer.category && (
        <>
          <span>/</span>
          <a
            href={`/offers/${offer.cityCode}?categoryId=${offer.category.id}`}
            className="hover:text-blue-600"
          >
            {offer.category.name}
          </a>
        </>
      )}
      <span>/</span>
      <span className="text-gray-700">{offer.title}</span>
    </nav>
  );
}
