import { sql, isDatabaseAvailable } from "./db"

// Auto-setup configuration
export const AUTO_SETUP_CONFIG = {
  enabled: process.env.AUTO_SETUP !== "false", // Enable by default, disable with AUTO_SETUP=false
  skipIfDataExists: true, // Don't overwrite existing data
}

// Check if database needs setup
export async function checkDatabaseSetup() {
  if (!isDatabaseAvailable()) {
    return {
      needsSetup: false,
      reason: "Database not configured. Please add DATABASE_URL environment variable.",
      requiresEnvVar: true,
    }
  }

  try {
    // Check if any packages exist (indicates setup is done)
    const packages = await sql!`SELECT COUNT(*) as count FROM packages LIMIT 1`
    const hasData = Number.parseInt(packages[0]?.count || "0") > 0

    if (hasData && AUTO_SETUP_CONFIG.skipIfDataExists) {
      return { needsSetup: false, reason: "Data already exists" }
    }

    // Check if all required tables exist
    const tables = await sql!`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('packages', 'destinations', 'testimonials', 'users', 'site_settings', 'inquiries', 'bookings', 'reviews', 'chat_sessions', 'chat_messages')
    `

    const requiredTables = [
      "packages",
      "destinations",
      "testimonials",
      "users",
      "site_settings",
      "inquiries",
      "bookings",
      "reviews",
      "chat_sessions",
      "chat_messages",
    ]

    const existingTables = tables.map((t: any) => t.table_name)
    const missingTables = requiredTables.filter((table) => !existingTables.includes(table))

    return {
      needsSetup: missingTables.length > 0,
      reason: missingTables.length > 0 ? `Missing tables: ${missingTables.join(", ")}` : "All tables exist",
      missingTables,
    }
  } catch (error) {
    console.error("Error checking database setup:", error)
    // If we get a connection error, it might be that tables don't exist yet
    return { needsSetup: true, reason: "Database needs initial setup" }
  }
}

// Auto-setup database with sample data
export async function autoSetupDatabase() {
  if (!isDatabaseAvailable()) {
    throw new Error("Database not available. Please configure DATABASE_URL environment variable.")
  }

  console.log("🚀 Starting auto-setup...")

  try {
    // 1. Create tables
    await createTables()
    console.log("✅ Tables created")

    // 2. Create sample destinations
    await createSampleDestinations()
    console.log("✅ Sample destinations created")

    // 3. Create sample packages
    await createSamplePackages()
    console.log("✅ Sample packages created")

    // 4. Create sample testimonials
    await createSampleTestimonials()
    console.log("✅ Sample testimonials created")

    // 5. Create default site settings
    await createDefaultSettings()
    console.log("✅ Default settings created")

    // 6. Create admin user
    await createAdminUser()
    console.log("✅ Admin user created")

    console.log("🎉 Auto-setup completed successfully!")
    return { success: true, message: "Database setup completed successfully!" }
  } catch (error) {
    console.error("❌ Auto-setup failed:", error)
    throw error
  }
}

// Create all required tables
async function createTables() {
  // Users table
  await sql!`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      phone VARCHAR(50),
      role VARCHAR(50) DEFAULT 'user',
      profile_data JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Destinations table
  await sql!`
    CREATE TABLE IF NOT EXISTS destinations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      country VARCHAR(100) NOT NULL,
      description TEXT,
      image_url TEXT,
      featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Packages table
  await sql!`
    CREATE TABLE IF NOT EXISTS packages (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      detailed_description TEXT,
      price DECIMAL(10,2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'USD',
      duration_days INTEGER NOT NULL,
      max_participants INTEGER,
      image_url TEXT,
      gallery_images JSONB DEFAULT '[]',
      destination_id INTEGER REFERENCES destinations(id),
      featured BOOLEAN DEFAULT false,
      included JSONB DEFAULT '[]',
      excluded JSONB DEFAULT '[]',
      itinerary JSONB DEFAULT '{}',
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Testimonials table
  await sql!`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      image_url TEXT,
      featured BOOLEAN DEFAULT false,
      approved BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Site settings table
  await sql!`
    CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY,
      setting_key VARCHAR(255) UNIQUE NOT NULL,
      setting_value JSONB NOT NULL,
      category VARCHAR(100) DEFAULT 'general',
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Inquiries table
  await sql!`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      package_id INTEGER REFERENCES packages(id),
      message TEXT NOT NULL,
      preferred_date DATE,
      participants INTEGER,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Bookings table
  await sql!`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      package_id INTEGER REFERENCES packages(id) NOT NULL,
      guest_name VARCHAR(255),
      guest_email VARCHAR(255),
      guest_phone VARCHAR(50),
      participants INTEGER NOT NULL DEFAULT 1,
      total_price DECIMAL(10,2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'USD',
      booking_date DATE NOT NULL,
      special_requests TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      payment_status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Reviews table
  await sql!`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      package_id INTEGER REFERENCES packages(id) NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
      comment TEXT,
      approved BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Chat sessions table
  await sql!`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id SERIAL PRIMARY KEY,
      user_email VARCHAR(255),
      user_name VARCHAR(255),
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Chat messages table
  await sql!`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      session_id INTEGER REFERENCES chat_sessions(id) NOT NULL,
      sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'agent')),
      content TEXT NOT NULL,
      read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
}

// Create sample destinations
async function createSampleDestinations() {
  const destinations = [
    {
      name: "Serengeti National Park",
      country: "Tanzania",
      description: "Home to the Great Migration and abundant wildlife",
      image_url:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      featured: true,
    },
    {
      name: "Maasai Mara",
      country: "Kenya",
      description: "Famous for its exceptional population of lions, leopards and cheetahs",
      image_url:
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      featured: true,
    },
    {
      name: "Kruger National Park",
      country: "South Africa",
      description: "One of Africa's largest game reserves with incredible biodiversity",
      image_url:
        "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      featured: false,
    },
  ]

  for (const dest of destinations) {
    await sql!`
      INSERT INTO destinations (name, country, description, image_url, featured)
      VALUES (${dest.name}, ${dest.country}, ${dest.description}, ${dest.image_url}, ${dest.featured})
      ON CONFLICT DO NOTHING
    `
  }
}

// Create sample packages
async function createSamplePackages() {
  const packages = [
    {
      title: "Serengeti Safari Adventure",
      description: "Experience the Great Migration in Tanzania's most famous national park",
      detailed_description:
        "Join us for an unforgettable 7-day safari adventure in the Serengeti. Witness the Great Migration, spot the Big Five, and immerse yourself in the raw beauty of African wilderness.",
      price: 2500.0,
      currency: "USD",
      duration_days: 7,
      max_participants: 8,
      image_url:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      destination_id: 1,
      featured: true,
      included: JSON.stringify(["Accommodation", "All meals", "Game drives", "Professional guide", "Park fees"]),
      excluded: JSON.stringify(["International flights", "Visa fees", "Personal expenses", "Tips"]),
      itinerary: JSON.stringify({
        "Day 1": "Arrival and transfer to Serengeti",
        "Day 2": "Full day game drive",
        "Day 3": "Great Migration viewing",
        "Day 4": "Big Five safari",
        "Day 5": "Cultural village visit",
        "Day 6": "Final game drive",
        "Day 7": "Departure",
      }),
    },
    {
      title: "Maasai Mara Big Five Safari",
      description: "Hunt for the Big Five in Kenya's premier wildlife destination",
      detailed_description:
        "A 5-day intensive safari focusing on spotting Africa's Big Five animals in their natural habitat.",
      price: 1800.0,
      currency: "USD",
      duration_days: 5,
      max_participants: 6,
      image_url:
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      destination_id: 2,
      featured: true,
      included: JSON.stringify(["Luxury tented camp", "All meals", "Game drives", "Professional guide"]),
      excluded: JSON.stringify(["Flights", "Drinks", "Personal items"]),
      itinerary: JSON.stringify({
        "Day 1": "Arrival at Maasai Mara",
        "Day 2": "Big Five tracking",
        "Day 3": "River crossing experience",
        "Day 4": "Cultural interaction",
        "Day 5": "Departure",
      }),
    },
  ]

  for (const pkg of packages) {
    await sql!`
      INSERT INTO packages (title, description, detailed_description, price, currency, duration_days, max_participants, image_url, destination_id, featured, included, excluded, itinerary)
      VALUES (${pkg.title}, ${pkg.description}, ${pkg.detailed_description}, ${pkg.price}, ${pkg.currency}, ${pkg.duration_days}, ${pkg.max_participants}, ${pkg.image_url}, ${pkg.destination_id}, ${pkg.featured}, ${pkg.included}, ${pkg.excluded}, ${pkg.itinerary})
      ON CONFLICT DO NOTHING
    `
  }
}

// Create sample testimonials
async function createSampleTestimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      rating: 5,
      comment:
        "Absolutely incredible experience! The guides were knowledgeable and the wildlife viewing was beyond our expectations.",
      image_url:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      featured: true,
      approved: true,
    },
    {
      name: "Michael Chen",
      email: "michael@example.com",
      rating: 5,
      comment: "A once-in-a-lifetime adventure! Every detail was perfectly planned and executed.",
      image_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      featured: true,
      approved: true,
    },
    {
      name: "Emma Wilson",
      email: "emma@example.com",
      rating: 5,
      comment: "The best safari experience we could have asked for. Professional, safe, and absolutely magical!",
      image_url:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      featured: true,
      approved: true,
    },
  ]

  for (const testimonial of testimonials) {
    await sql!`
      INSERT INTO testimonials (name, email, rating, comment, image_url, featured, approved)
      VALUES (${testimonial.name}, ${testimonial.email}, ${testimonial.rating}, ${testimonial.comment}, ${testimonial.image_url}, ${testimonial.featured}, ${testimonial.approved})
      ON CONFLICT DO NOTHING
    `
  }
}

// Create default site settings
async function createDefaultSettings() {
  const settings = [
    { key: "site_name", value: "Travel Connect Expeditions" },
    { key: "site_description", value: "Experience unforgettable safari adventures across East and Southern Africa" },
    { key: "hero_title", value: "Discover Africa's Wild Heart" },
    {
      key: "hero_subtitle",
      value: "Experience unforgettable safari adventures with our expert guides and carefully crafted itineraries.",
    },
    { key: "hero_cta_text", value: "Explore Safari Packages" },
    {
      key: "hero_background_image",
      value:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800&q=80",
    },
    { key: "primary_color", value: "#f59e0b" },
    { key: "secondary_color", value: "#d97706" },
    { key: "accent_color", value: "#92400e" },
    { key: "phone", value: "+1 (555) 123-4567" },
    { key: "email", value: "info@travelconnectexpeditions.com" },
    { key: "address", value: "123 Safari Street, Adventure City, AC 12345" },
    { key: "whatsapp_number", value: "+1234567890" },
    { key: "about_story_title", value: "Welcome to Travel Connect Expeditions" },
    {
      key: "about_story_content",
      value:
        "We specialize in creating extraordinary safari experiences across East and Southern Africa. Our expert guides and carefully crafted itineraries ensure you witness Africa's incredible wildlife in their natural habitat.",
    },
    {
      key: "footer_description",
      value:
        "Creating extraordinary safari experiences across East and Southern Africa with expert guides and carefully crafted itineraries.",
    },
    { key: "copyright_text", value: "© 2024 Travel Connect Expeditions. All rights reserved." },
    { key: "chat_widget_enabled", value: "true" },
  ]

  for (const setting of settings) {
    await sql!`
      INSERT INTO site_settings (setting_key, setting_value, category, description)
      VALUES (${setting.key}, ${JSON.stringify(setting.value)}, 'general', 'Auto-generated default setting')
      ON CONFLICT (setting_key) DO NOTHING
    `
  }
}

// Create admin user (with simple password for demo)
async function createAdminUser() {
  await sql!`
    INSERT INTO users (name, email, password_hash, role)
    VALUES ('Admin User', 'admin@travelconnect.com', 'admin123', 'admin')
    ON CONFLICT (email) DO NOTHING
  `
}
