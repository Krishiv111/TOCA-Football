import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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
      'Every session generates detailed stats on accuracy, ball touches, speed, and drill performance, so players and coaches can measure progress over time.',
  },
  {
    icon: '🏆',
    title: 'Train Like the Pros',
    description:
      'TOCA\'s training methodology is trusted by professional clubs and academies around the world. Our curriculum is designed to accelerate skill development at every level.',
  },
  {
    icon: '👥',
    title: '1-on-1 and Group Sessions',
    description:
      'Choose from private 1-on-1 training, group sessions, or skills assessments. All sessions are led by certified TOCA coaches in a state-of-the-art facility.',
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
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">About TOCA Football</h1>
        <p className="text-blue-100 text-base max-w-2xl leading-relaxed">
          TOCA Football is revolutionizing the way players train. Our tech-enabled training
          centers combine cutting-edge ball delivery systems with expert coaching to help
          players of all levels reach their full potential on the pitch.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ value, label }) => (
          <Card key={label} className="text-center border-blue-100">
            <CardContent className="py-5">
              <p className="text-3xl font-bold text-blue-600">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Mission */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          At TOCA, we believe every player deserves access to world-class training. Our mission
          is to make elite-level football development accessible to everyone — from youth players
          just starting out to seasoned competitors looking to sharpen their edge. We combine
          technology, data, and expert coaching to create personalized training experiences that
          deliver real results.
        </p>
      </section>

      <Separator />

      {/* Features */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">What We Offer</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon, title, description }) => (
            <Card key={title} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Quote */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-6 text-center">
          <p className="text-lg italic text-gray-700">
            "The more you touch the ball, the better you get. TOCA makes sure every rep counts."
          </p>
          <p className="text-sm text-gray-500 mt-2">— TOCA Training Philosophy</p>
        </CardContent>
      </Card>
    </div>
  )
}
