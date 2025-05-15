export default function Testimonials() {
  const testimonials = [
    {
      quote: "SmartClip saved me hours while revising long tutorials. Game changer!",
      name: "Riya, CS Student",
    },
    {
      quote: "Perfect for grabbing highlights from my favorite podcasts.",
      name: "Aman, Content Creator",
    },
    {
      quote: "Super easy to use. AI explanations help me learn faster.",
      name: "Sana, Developer",
    },
  ];

  return (
    <section className="py-16 bg-white text-orange-900">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-10">Loved by Early Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-orange-100 rounded-xl p-6 shadow hover:shadow-lg transition">
              <p className="italic text-lg">“{t.quote}”</p>
              <p className="mt-4 font-semibold">{t.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <span className="bg-orange-200 text-orange-800 px-4 py-2 rounded-full font-semibold">
            🚀 Built with AI
          </span>
          <span className="bg-orange-200 text-orange-800 px-4 py-2 rounded-full font-semibold">
            📹 100+ Clips Generated
          </span>
        </div>
      </div>
    </section>
  );
}
