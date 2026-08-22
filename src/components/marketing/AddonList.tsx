"use client";

import { useState } from "react";
import type { Package } from "@/lib/types";
import { InquiryModal } from "./InquiryModal";

export function AddonList({ addons }: { addons: Package[] }) {
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <>
      <div className="mt-6 flex flex-col gap-3">
        {addons.map((addon) => (
          <button
            key={addon.id}
            type="button"
            onClick={() => setActiveService(addon.name)}
            className="flex items-center justify-between gap-4 rounded-xl border border-white/10 px-5 py-4 text-left transition hover:bg-white/5"
          >
            <div>
              <p className="font-medium">{addon.name}</p>
              {addon.description && (
                <p className="mt-1 text-sm text-foreground/70">
                  {addon.description}
                </p>
              )}
            </div>
            <p className="whitespace-nowrap text-lg font-semibold">
              £{addon.price}
            </p>
          </button>
        ))}
      </div>

      {activeService && (
        <InquiryModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </>
  );
}
