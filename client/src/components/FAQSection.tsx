import { useState } from "react";
import { FAIcon } from "@/components/ui/fa-icon";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function FAQSection() {
  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "Is this service free to use?",
      answer: "Yes, our TikTok video downloader is completely free to use. There are no hidden fees or subscriptions required."
    },
    {
      id: "2",
      question: "Is it legal to download TikTok videos?",
      answer: "Our service is intended for personal use only. Please respect copyright and intellectual property rights. Don't use downloaded content commercially without permission from the creator."
    },
    {
      id: "3", 
      question: "What formats can I download in?",
      answer: "You can download TikTok videos in MP4, WebM, or extract just the audio in MP3 format. We offer different quality options for each format."
    },
    {
      id: "4",
      question: "Does this work with private TikTok videos?",
      answer: "No, our service only works with publicly available TikTok videos. Private videos cannot be accessed."
    }
  ];

  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section className="py-12 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white p-4 rounded-lg shadow-sm">
              <button 
                className="flex justify-between items-center w-full text-left" 
                onClick={() => toggleFaq(faq.id)}
              >
                <span className="font-medium">{faq.question}</span>
                <FAIcon icon={openFaqId === faq.id ? "chevron-up" : "chevron-down"} className="text-slate-400" />
              </button>
              <div className={`mt-2 text-slate-600 ${openFaqId === faq.id ? 'block' : 'hidden'}`}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
