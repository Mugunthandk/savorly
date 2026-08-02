import React, { useState } from 'react';
import { MessageSquare, Phone, HelpCircle, X, CheckCircle2, ChevronDown, Send, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface CustomerSupportModalProps {
  order?: Order | null;
  onClose: () => void;
}

const FAQS = [
  { q: "How does Savorly's Freshness Guarantee work?", a: "Every dish is cooked fresh and packed in thermal insulated seals. If your food temperature drops below 55°C upon delivery, we issue an instant Savorly credit!" },
  { q: "What should I do if an item is missing or wrong?", a: "Select the missing item below. Our AI resolution agent will verify the kitchen packing photo and issue a instant refund to your UPI or Savor Points within 60 seconds." },
  { q: "How do Quiet Night Deliveries work?", a: "Our delivery captains receive an automated silent ping. They leave the package at your security door or gate without ringing doorbells." }
];

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({ order, onClose }) => {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(0);
  const [issueSubmitted, setIssueSubmitted] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'Savorly Assistant', text: `Hello! How can we assist you today${order ? ` regarding order ${order.orderNumber}` : ''}?` }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendMsg = () => {
    if (!inputMsg.trim()) return;
    const userText = inputMsg;
    setChatMessages(prev => [...prev, { sender: 'You', text: userText }]);
    setInputMsg('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'Savorly Assistant', text: `Thanks! We checked with ${order?.restaurantName || 'the restaurant kitchen'}. Your request is processed!` }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181613] border border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ff6814] text-white flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white">Savorly Priority Concierge Support</h2>
              <p className="text-[10px] text-stone-400">24x7 Live Resolution Agent</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Chat Simulated Thread */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-white/10 space-y-3">
          <p className="text-xs font-bold text-stone-200">Live Concierge Chat:</p>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
            {chatMessages.map((m, i) => (
              <div key={i} className={`p-2.5 rounded-xl text-xs ${
                m.sender === 'You' ? 'bg-[#ff6814]/20 border border-[#ff6814]/40 text-white ml-6' : 'bg-white/5 text-stone-200 mr-6'
              }`}>
                <strong className="text-[10px] block text-stone-400">{m.sender}</strong>
                <span>{m.text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Type issue or question..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMsg()}
              className="flex-1 bg-stone-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button
              onClick={handleSendMsg}
              className="px-3 py-2 rounded-xl bg-[#ff6814] text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <p className="text-xs font-bold text-stone-200">Frequently Asked Questions:</p>
          <div className="space-y-2">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden text-xs">
                <button
                  onClick={() => setSelectedFaq(selectedFaq === idx ? null : idx)}
                  className="w-full p-3 text-left font-semibold text-stone-200 flex justify-between items-center"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-stone-400" />
                </button>
                {selectedFaq === idx && (
                  <p className="p-3 pt-0 text-stone-300 border-t border-white/5 leading-relaxed bg-black/20">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
        >
          Close Support
        </button>

      </div>
    </div>
  );
};
