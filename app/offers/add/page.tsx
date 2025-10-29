import { PlusCircle } from "lucide-react";
import OfferForm from "./component/OfferForm";

export const metadata = {
  title: "Новая акция | Admin",
};

export default function NewDealPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 px-4 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-4xl bg-white/60 backdrop-blur-[2px] md:bg-white md:border md:border-gray-200 md:shadow-sm md:rounded-xl md:p-8 md:pt-6 space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-blue-700">
            <PlusCircle className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
              Создать акцию
            </h1>
          </div>

          {/* subtle divider */}
          <div className="border-t border-gray-200" />
        </header>

        {/* Form */}
        <section className="space-y-6">
          <OfferForm />
        </section>
      </div>
    </div>
  );
}
