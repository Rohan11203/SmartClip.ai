import { motion } from "framer-motion";
export default function UseCases() {
  const useCases = [
    {
      icon: "📚",
      title: "Students",
      description: "Summarize long tutorials or lectures.",
    },
    {
      icon: "✂️",
      title: "Content Creators",
      description: "Extract short-form content quickly.",
    },
    {
      icon: "🧠",
      title: "Lifelong Learners",
      description: "Understand complex videos with AI help.",
    },
    {
      icon: "💼",
      title: "Professionals",
      description: "Save time reviewing training materials.",
    },
  ];

  return (
    <section id="value" className="py-20 font-mono bg-orange-50 text-orange-900 dark:text-white dark:bg-[#050505] ">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-16 ">Why Use SmartClip?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((caseItem, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, scale: 0.95 }}
              whileInView={{ y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.2, duration: 0.5, ease: "easeOut" }}
              className="bg-white dark:bg-[#121212] rounded-xl p-6 dark:shadow-slate-700 shadow hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{caseItem.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{caseItem.title}</h3>
              <p className="text-orange-800 dark:text-slate-400">
                {caseItem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
