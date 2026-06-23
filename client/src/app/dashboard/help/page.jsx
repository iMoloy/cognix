"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle, FileQuestion, ChevronDown, Send, LifeBuoy, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

const faqs = [
  {
    question: "How do I use a premium prompt?",
    answer: "Once you purchase a premium prompt, you can find it in your 'Saved Prompts' or 'Overview' section. Simply click on it to view the full prompt details and copy the text for use in your favorite AI tool."
  },
  {
    question: "Can I sell my own AI prompts?",
    answer: "Yes! If you have a Creator account, you can submit your own prompts via the 'Add Prompt' page in your dashboard. Our admin team will review it, and once approved, it will be listed in the marketplace."
  },
  {
    question: "How are payments processed?",
    answer: "All payments are securely processed through Stripe. We do not store your credit card information. Creators receive their earnings according to our payout schedule."
  },
  {
    question: "What happens if a prompt doesn't work?",
    answer: "We have a strict review process to ensure quality. However, if a prompt fundamentally fails to do what it advertises, you can report it via the prompt details page and our support team will investigate for a potential refund."
  }
];

export default function HelpAndSupportPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent successfully! Our support team will get back to you soon.");
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="w-full space-y-8 pb-10">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 sm:p-10 backdrop-blur-xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <LifeBuoy size={120} className="text-emerald-500 blur-sm" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 mb-6">
            <Sparkles size={14} className="text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">24/7 Support</span>
          </div>
          
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl tracking-tight">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">help you?</span>
          </h1>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed max-w-xl">
            Whether you need help with a purchase, have a question about becoming a creator, or just want to say hi, we're here for you.
          </p>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* FAQs Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
              <FileQuestion size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-white/10'}`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  >
                    <span className={`font-semibold transition-colors ${isOpen ? 'text-emerald-300' : 'text-zinc-200'}`}>
                      {faq.question}
                    </span>
                    <ChevronDown 
                      size={18} 
                      className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : 'text-zinc-500'}`} 
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Contact Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden group">
            
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-[80px] transition-opacity duration-500 group-hover:bg-emerald-500/20" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                <MessageCircle size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Contact Support</h2>
                <p className="text-xs text-zinc-400 mt-0.5">We typically reply within 24 hours</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 ml-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 ml-1">Subject</label>
                <select
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-white outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20 appearance-none"
                >
                  <option value="">Select a topic...</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="technical">Technical Issue</option>
                  <option value="creator">Creator Account Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 ml-1">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you today?"
                  className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20"
                ></textarea>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 mt-2 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send size={16} className={`transition-transform duration-300 ${isSubmitting ? 'translate-x-2 opacity-0' : 'group-hover:translate-x-1'}`} />
                </span>
                
                {/* Submit button glow effect */}
                {!isSubmitting && (
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                )}
              </Button>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
