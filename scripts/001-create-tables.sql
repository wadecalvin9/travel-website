-- Create users table with role-based access
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  phone VARCHAR(50),
  date_of_birth DATE,
  nationality VARCHAR(100),
  passport_number VARCHAR(100),
  emergency_contact JSONB, -- Stores name, phone, relationship
  travel_preferences JSONB, -- Stores accommodationType, groupSize, activityLevel, interests
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  country VARCHAR(100),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create safari packages table
CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  detailed_description TEXT,
  price DECIMAL(10,2),
  duration_days INTEGER,
  max_participants INTEGER,
  image_url VARCHAR(500),
  gallery_images TEXT[], -- Array of image URLs
  destination_id INTEGER REFERENCES destinations(id),
  included TEXT[],
  excluded TEXT[],
  itinerary JSONB,
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inquiries table (for general inquiries, not confirmed bookings)
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  package_id INTEGER REFERENCES packages(id),
  message TEXT,
  preferred_date DATE,
  participants INTEGER,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table (for confirmed user bookings)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  package_id INTEGER REFERENCES packages(id),
  package_title VARCHAR(255) NOT NULL,
  package_image VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending', -- e.g., 'pending', 'confirmed', 'cancelled', 'completed'
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  travel_date DATE NOT NULL,
  participants INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create testimonials table (for public testimonials)
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  image_url VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table (for user-submitted reviews linked to their profile and packages)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  package_id INTEGER REFERENCES packages(id),
  package_title VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  images TEXT[], -- Array of image URLs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, package_id) -- Ensure one review per user per package
);

-- Create content management table for dynamic content
CREATE TABLE IF NOT EXISTS content (
  id SERIAL PRIMARY KEY,
  page VARCHAR(100) NOT NULL,
  section VARCHAR(100) NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page, section)
);

-- Create site_settings table for website configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_packages_destination ON packages(destination_id);
CREATE INDEX IF NOT EXISTS idx_packages_featured ON packages(featured);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_package ON reviews(package_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);
