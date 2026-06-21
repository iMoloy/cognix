"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "How does the $5 premium unlock work?",
    answer: "It's a one-time payment. Once you pay $5, your account is permanently upgraded to Premium, giving you lifetime access to all locked/private prompts across the entire platform."
  },
  {
    question: "Can I sell my own prompts?",
    answer: "Yes! If you publish high-quality prompts, you can apply for the Creator role. Once approved, your prompts can be featured and monetized."
  },
  {
    question: "Are the prompts tested?",
    answer: "Absolutely. Every single prompt goes through our Admin Moderation Queue before being published to the marketplace to ensure it works as advertised."
  },
  {
    question: "How do I prevent losing my favorite prompts?",
    answer: "You can click the bookmark icon on any prompt to save it to your personal Dashboard. We automatically prevent duplicate saves."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5 bg-[#030303]">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-white/5 bg-zinc-900/30 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="text-sm font-bold text-white">{faq.question}</span>
                <ChevronDown 
                  size={18} 
                  className={`text-zinc-500 transition-transform duration-300 ${openIndex === i ? "rotate-180 text-emerald-400" : ""}`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="p-6 pt-0 text-sm leading-relaxed text-zinc-400">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
