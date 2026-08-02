import React from 'react';
import { ShieldCheck, Heart, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onOpenSupport: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSupport }) => {
  return (
    <footer className="bg-[#12110e] border-t border-white/10 text-stone-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#ff6814] text-white font-serif font-bold text-lg flex items-center justify-center">
                S
              </span>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                SAVORLY
              </span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Every craving, beautifully delivered. Chennai's premier fine-dining delivery & table ordering technology.
            </p>
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>98% Freshness Guarantee</span>
            </div>
          </div>

          {/* Col 2: Zones */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Chennai Express Delivery Zones
            </h3>
            <ul className="space-y-1.5 text-stone-400">
              <li>Anna Nagar & Shanti Colony</li>
              <li>T. Nagar & Usman Road</li>
              <li>Adyar & Besant Nagar</li>
              <li>Velachery & OMR Food Street</li>
              <li>Nungambakkam & Khader Nawaz Khan Rd</li>
            </ul>
          </div>

          {/* Col 3: Tech & Dietary */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Savorly Innovations
            </h3>
            <ul className="space-y-1.5 text-stone-400">
              <li>AI Craving Concierge</li>
              <li>Dietary Guardian Allergen Warnings</li>
              <li>Quiet Night Silent Deliveries</li>
              <li>Dine-In QR Table Ordering</li>
              <li>Social Group Orders & Split Bill</li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              24x7 Support & Concierge
            </h3>
            <p className="text-stone-400">Need help with an order or corporate dining reservation?</p>
            <button
              onClick={onOpenSupport}
              className="px-4 py-2.5 rounded-xl bg-[#ff6814] text-white font-bold text-xs hover:bg-[#ee5703] transition-colors"
              id="footer-support-btn"
            >
              Contact Priority Concierge
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Savorly Technologies Pvt Ltd. All rights reserved. Chennai, India.</p>
          <div className="flex gap-4">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-stone-300 cursor-pointer">Allergen Safety Pledge</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
