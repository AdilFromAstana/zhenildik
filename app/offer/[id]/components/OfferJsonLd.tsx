import { Offer } from "app/offers/my/page";
import { getOfferJsonLd } from "../utils/offerHelpers";

export default function OfferJsonLd({ offer }: { offer: Offer }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getOfferJsonLd(offer)),
      }}
    />
  );
}
