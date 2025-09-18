"use client"

import { useSettings } from "@/components/settings-provider"

export default function AboutPage() {
  const { settings, loading } = useSettings()

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Story Section */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold font-playfair mb-8">{settings.about_story_title || "Our Story"}</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {settings.about_story_content ||
                "Founded in 2010, Travel Connect Expeditions has been creating life-changing safari experiences for over a decade. Our passion for wildlife conservation and sustainable tourism drives everything we do."}
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold font-playfair mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              {settings.about_mission ||
                "To provide authentic, educational, and transformative safari experiences that create lasting memories and inspire conservation action."}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-playfair mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              {settings.about_vision ||
                "To be Africa's leading sustainable safari operator, connecting travelers with wildlife while supporting conservation and local communities."}
            </p>
          </div>
        </div>

        {/* Values */}
        {settings.about_values && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-playfair mb-6">Our Values</h2>
            <p className="text-gray-600 leading-relaxed">{settings.about_values}</p>
          </section>
        )}

        {/* Team */}
        {settings.about_team_description && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-playfair mb-6">Our Team</h2>
            <p className="text-gray-600 leading-relaxed">{settings.about_team_description}</p>
          </section>
        )}

        {/* History */}
        {settings.about_history && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-playfair mb-6">Our History</h2>
            <p className="text-gray-600 leading-relaxed">{settings.about_history}</p>
          </section>
        )}

        {/* Awards */}
        {settings.about_awards && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-playfair mb-6">Awards & Recognition</h2>
            <p className="text-gray-600 leading-relaxed">{settings.about_awards}</p>
          </section>
        )}
      </div>
    </div>
  )
}
