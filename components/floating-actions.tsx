'use client';

import { usePathname } from 'next/navigation';
import { Facebook, Instagram, MessageCircle, ArrowRight, Youtube } from 'lucide-react';

export function FloatingActions() {
  const pathname = usePathname();
  const phone = '919695902026';

  // Hide on admin / login pages
  if (pathname && (pathname.includes('/admin') || pathname.includes('/login') || pathname.includes('/gsadmin'))) {
    return null;
  }

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '/#contact';
    }
  };

  return (
    <div className="fixed right-0 top-1/3 z-[99999] hidden md:flex flex-col items-center bg-white/95 backdrop-blur border border-gray-200 shadow-2xl rounded-l-2xl overflow-hidden">
      {/* Get Started */}
      <button
        onClick={scrollToContact}
        className="w-14 py-3 bg-secondary text-white flex flex-col items-center justify-center hover:bg-secondary/90 transition text-[10px] font-bold tracking-[1px]"
        title="Get Started"
      >
        <ArrowRight className="w-4 h-4 mb-0.5" />
        START
      </button>

      <div className="h-px w-8 bg-gray-200" />

      {/* Social Media Icons */}
      <a
        href="https://www.facebook.com/people/Gargee-Solar/100044281187624/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-12 flex items-center justify-center text-[#1877f2] hover:bg-blue-50 transition"
        title="Facebook"
      >
        <Facebook className="w-5 h-5" />
      </a>

      <a
        href={`https://wa.me/${phone}?text=Hello%2C%20I%20am%20interested%20in%20solar%20solutions`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-12 flex items-center justify-center text-[#25D366] hover:bg-green-50 transition"
        title="WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </a>

      <a
        href="https://www.facebook.com/people/Gargee-Solar/100044281187624/" 
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-12 flex items-center justify-center text-[#E4405F] hover:bg-pink-50 transition"
        title="Instagram"
      >
        <Instagram className="w-5 h-5" />
      </a>
      <a 
        href="https://www.youtube.com/@gargeesolar"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-12 flex items-center justify-center text-[#FF0000] hover:bg-red-50 transition"
        title="YouTube"
      >
        <Youtube className="w-5 h-5" />
      </a>
    </div>
  );
}
