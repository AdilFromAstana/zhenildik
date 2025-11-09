import React from "react";
import { OfferDetails } from "../utils/fetchOffer";
import { getOfferJsonLd } from "../utils/offerHelpers";

export default function OfferJsonLd({ offer }: { offer: OfferDetails }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getOfferJsonLd(offer)),
      }}
    />
  );
}
