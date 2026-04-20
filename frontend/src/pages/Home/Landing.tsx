interface Props {
  onGetStarted: () => void;
}

const steps = [
  {
    icon: "🗺️",
    title: "Explore the Map",
    desc: "Browse restrooms near you on an interactive map. The summary badge shows how many are visible in your current view.",
  },
  {
    icon: "📍",
    title: "Add a Location",
    desc: "Found a restroom that isn't listed? Tap the + button to contribute — add the name, hours, type, and whether it's free.",
  },
  {
    icon: "✏️",
    title: "Edit & Delete Yours",
    desc: "You can update or remove any restroom you personally added. Other users' entries are read-only.",
  },
  {
    icon: "🔍",
    title: "Search by Name",
    desc: "Use the search bar to quickly filter restrooms by name or address within the current map view.",
  },
];

export default function Landing({ onGetStarted }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚻</span>
          <span className="text-xl font-bold text-teal-700 dark:text-teal-400 tracking-tight">
            RestroomFinder
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-6 inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-sm font-medium px-4 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          Community-powered restroom map
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
          Find Clean Restrooms
          <br />
          <span className="text-teal-600 dark:text-teal-400">Anywhere, Anytime</span>
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mb-10 leading-relaxed">
          A crowd-sourced map of public restrooms. Browse by type, check opening hours, and contribute locations to help everyone.
        </p>

        <button
          onClick={onGetStarted}
          className="group inline-flex items-center gap-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-teal-200 dark:shadow-teal-900/50 transition-all duration-200 cursor-pointer"
        >
          Get Started
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </main>

      {/* How to use */}
      <section className="px-6 pb-16 max-w-5xl mx-auto w-full">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-8">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 text-left shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{step.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                {step.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
