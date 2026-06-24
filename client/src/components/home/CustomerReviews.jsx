"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    text: "Cognix completely changed my workflow. The premium prompts are worth every penny, and the bookmarking feature saves me hours every week.",
    author: "Michael T.",
    role: "Frontend Developer",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    text: "As a prompt engineer, this is the best platform to monetize my skills. The $5 premium unlock model converts users much better than recurring subscriptions.",
    author: "Jessica W.",
    role: "AI Creator",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    text: "The UI is stunning and the search filters are incredibly fast. I found exactly what I needed for my marketing campaign in seconds.",
    author: "Daniel R.",
    role: "Marketing Director",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/46.jpg"
  }
];

export default function CustomerReviews() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5 bg-[#030303]/50 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Thousands</span>
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            See what our community of developers, creators, and marketers have to say.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative rounded-2xl border border-white/5 bg-zinc-900/40 p-8 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-zinc-900/60 hover:-translate-y-2"
            >
              <Quote size={40} className="absolute top-6 right-6 text-white/5" />
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={16} className="fill-amber-500 text-amber-500" />
                ))}
              </div>
              
              <p className="relative z-10 text-zinc-300 leading-relaxed font-medium">
                &quot;{review.text}&quot;
              </p>
              
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 overflow-hidden">
                  <img src={review.avatar} alt={review.author} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{review.author}</h4>
                  <p className="text-xs text-zinc-500">{review.role}</p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
