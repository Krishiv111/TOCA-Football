const features = [
  {
    icon: '⚽',
    title: 'Smart Ball Technology',
    description:
      'TOCA uses proprietary ball-delivery machines and sensors to track every touch, pass, and shot — giving players real-time, data-driven feedback after every session.',
  },
  {
    icon: '📊',
    title: 'Performance Analytics',
    description:
      'Every session generates detailed stats on score, ball touches, speed of play, and streak performance so players and coaches can measure progress over time.',
  },
  {
    icon: '🏆',
    title: 'Train Like the Pros',
    description:
      "TOCA's training methodology is trusted by professional clubs and academies around the world. Our curriculum is designed to accelerate skill development at every level.",
  },
  {
    icon: '👤',
    title: 'Expert Coaching',
    description:
      'Every session is guided by a certified TOCA trainer who tailors drills and intensity to each player\'s goals and current ability level.',
  },
]

const stats = [
  { value: '100+', label: 'Training Centers' },
  { value: '500K+', label: 'Sessions Completed' },
  { value: '50+', label: 'Pro Players Trained' },
  { value: '15+', label: 'Countries' },
]

export function About() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#1d1d1f] to-[#2d2d2f] rounded-3xl p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3">About TOCA</p>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Revolutionizing the<br />way players train.
          </h1>
          <p className="text-gray-400 text-[15px] leading-relaxed max-w-xl">
            TOCA Football's tech-enabled training centers combine cutting-edge ball delivery
            systems with expert coaching to help players of all levels reach their full
            potential on the pitch.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ value, label }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed text-[15px]">
          At TOCA, we believe every player deserves access to world-class training. Our mission
          is to make elite-level football development accessible to everyone — from youth players
          just starting out to seasoned competitors looking to sharpen their edge. We combine
          technology, data, and expert coaching to create personalized training experiences that
          deliver real results.
        </p>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">What We Offer</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map(({ icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-2xl">{icon}</span>
              <h3 className="font-semibold text-gray-900 text-[15px] mt-3 mb-1.5">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 text-center border border-blue-100">
        <p className="text-xl font-semibold text-gray-800 italic leading-snug">
          "The more you touch the ball,<br />the better you get."
        </p>
        <p className="text-sm text-gray-500 mt-3 font-medium">— TOCA Training Philosophy</p>
      </div>
    </div>
  )
}
