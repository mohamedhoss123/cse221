import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import {
  Star,
  MapPin,
  Wifi,
  Waves,
  Car,
  Utensils,
  Shield,
  Clock,
  Heart,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--expressive-primary)] to-[var(--expressive-accent)]" />
              <span className="text-xl font-light text-slate-900">
                Luxury
                <span className="font-semibold text-[var(--expressive-primary)]">Stays</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium">
                Features
              </a>
              <a href="#amenities" className="text-slate-600 hover:text-slate-900 font-medium">
                Amenities
              </a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 font-medium">
                Reviews
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/auth/login">
                <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
                  Sign in
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button className="bg-gradient-to-r from-[var(--expressive-primary)] to-[var(--expressive-accent)] hover:from-[var(--expressive-primary)] hover:to-[var(--expressive-accent)] text-black shadow-lg shadow-[#F5C518]/30">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(30deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37),
              linear-gradient(150deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37),
              linear-gradient(30deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37),
              linear-gradient(150deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37)`,
              backgroundSize: '80px 140px',
              backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px',
            }}
          />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--expressive-accent)]/10 border border-[var(--expressive-accent)]/20 text-[var(--expressive-accent)] text-sm font-medium mb-8">
            <Star className="w-4 h-4 fill-[#F5C518]" />
            <span>5-Star Luxury Experience</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6">
            Discover
            <span className="block font-semibold text-[var(--expressive-accent)] mt-2">Extraordinary Stays</span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-300 font-light max-w-3xl mx-auto mb-10 leading-relaxed">
            Experience unparalleled luxury at our curated collection of premium properties.
            Where every detail is crafted for perfection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/register">
              <Button
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-[var(--expressive-primary)] to-[var(--expressive-accent)] hover:from-[var(--expressive-primary)] hover:to-[var(--expressive-accent)] text-black font-medium shadow-2xl shadow-[#F5C518]/40 text-lg"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/customer/rooms">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 text-lg"
              >
                Explore Rooms
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20">
            {[
              { value: '500+', label: 'Luxury Rooms' },
              { value: '50+', label: 'Locations' },
              { value: '10K+', label: 'Happy Guests' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-semibold text-[#F5C518]">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F5C518] to-transparent" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-[var(--expressive-background)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-light text-slate-900 mb-4">
              Why Choose <span className="font-semibold text-[var(--expressive-primary)]">LuxuryStays</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the perfect blend of elegance, comfort, and exceptional service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: 'Luxury Accommodations',
                description: 'From elegantly appointed standard rooms to breathtaking penthouse suites with panoramic views.',
              },
              {
                icon: MapPin,
                title: 'Prime Locations',
                description: 'Our properties are strategically located near attractions, business centers, and cultural landmarks.',
              },
              {
                icon: Shield,
                title: 'Safe & Secure',
                description: '24/7 security, advanced surveillance systems, and secure booking protection for your peace of mind.',
              },
              {
                icon: Clock,
                title: '24/7 Concierge',
                description: 'Our dedicated team is always ready to assist you with personalized services around the clock.',
              },
              {
                icon: Heart,
                title: 'Personalized Experience',
                description: 'We tailor every aspect of your stay to your preferences, ensuring a truly memorable experience.',
              },
              {
                icon: ChevronRight,
                title: 'Easy Booking',
                description: 'Seamless online reservation process with instant confirmation and flexible payment options.',
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-[#F5C518]"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--expressive-primary)] to-[var(--expressive-accent)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-light text-slate-900 mb-4">
              World-Class <span className="font-semibold text-[var(--expressive-primary)]">Amenities</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Every detail designed for your comfort and convenience
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Wifi,
                title: 'High-Speed WiFi',
                description: 'Complimentary fiber optic internet throughout the property',
              },
              {
                icon: Waves,
                title: 'Infinity Pool',
                description: 'Temperature-controlled pool with stunning views',
              },
              {
                icon: Car,
                title: 'Valet Parking',
                description: 'Complimentary secure on-site parking',
              },
              {
                icon: Utensils,
                title: 'Fine Dining',
                description: 'Award-winning restaurants with world-renowned chefs',
              },
            ].map((amenity) => {
              const Icon = amenity.icon
              return (
                <div
                  key={amenity.title}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-[var(--expressive-background)] to-white border border-slate-200"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--expressive-primary)] to-[var(--expressive-accent)] flex items-center justify-center">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{amenity.title}</h3>
                  <p className="text-sm text-slate-600">{amenity.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(30deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37),
              linear-gradient(150deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37)`,
              backgroundSize: '80px 140px',
              backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-light text-white mb-4">
              Guest <span className="font-semibold text-[#F5C518]">Testimonials</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Hear what our guests have to say about their extraordinary experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Mitchell',
                location: 'New York, USA',
                text: 'An absolutely unforgettable experience. The attention to detail and personalized service exceeded all my expectations.',
                rating: 5,
              },
              {
                name: 'James Chen',
                location: 'Singapore',
                text: 'The perfect blend of luxury and comfort. I felt like royalty from the moment I arrived until checkout.',
                rating: 5,
              },
              {
                name: 'Emma Thompson',
                location: 'London, UK',
                text: 'Exceptional in every way. The amenities, the service, the views - everything was simply perfection.',
                rating: 5,
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F5C518] text-[#F5C518]" />
                  ))}
                </div>
                <p className="text-slate-200 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F5C518] to-transparent" />
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[var(--expressive-background)] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-light text-slate-900 mb-6">
            Ready to Experience
            <span className="block font-semibold text-[var(--expressive-primary)] mt-2">True Luxury?</span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Join thousands of discerning travelers who have made LuxuryStays their preferred destination
            for extraordinary accommodations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/register">
              <Button
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-[var(--expressive-primary)] to-[var(--expressive-accent)] hover:from-[var(--expressive-primary)] hover:to-[var(--expressive-accent)] text-black font-medium shadow-xl shadow-[#F5C518]/30 text-lg"
              >
                Create Your Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/customer/rooms">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 border-2 border-slate-300 text-slate-700 hover:bg-[var(--expressive-background)] text-lg"
              >
                Browse Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--expressive-primary)] to-[var(--expressive-accent)]" />
              <span className="text-lg font-light text-white">
                Luxury
                <span className="font-semibold text-[#F5C518]">Stays</span>
              </span>
            </div>
            <div className="text-sm">
              © 2025 LuxuryStays. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
