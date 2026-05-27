'use client';

import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';

const brands = [
  { name: 'Tata', image: '/brandlogo/brand.tata.jpeg' },
  { name: 'Luminous', image: '/brandlogo/brand-luminous.webp' },
  { name: 'Exide', image: '/brandlogo/brand-exide.png' },
  { name: 'Amaron', image: '/brandlogo/brand-amaron.jpg' },
  { name: 'Adani', image: '/brandlogo/brand-adani.png' },
  { name: 'Utl', image: '/brandlogo/brand-utl.png' },
  { name: 'Vikram', image: '/brandlogo/brand-vikram.png' },
  { name: 'Waree', image: '/brandlogo/brand-waree.png' },
  { name: 'Loom', image: '/brandlogo/brand-loom.png' },
  { name: 'Oswal', image: '/brandlogo/oswal-logo.png' },
];

export function BrandsSection() {
  const { t } = useLanguage();

  return (
    <section id="brands" className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">{t.brands.title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {brands.map((brand) => (
            <div key={brand.name} className="flex flex-col items-center group">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center p-4 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 ring-1 ring-white/10">
                <div className="relative w-full h-full">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain rounded-full"
                    unoptimized
                    suppressHydrationWarning
                  />
                </div>
              </div>
              <p className="text-sm mt-3 text-white/80 font-medium text-center group-hover:text-white transition-colors">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
