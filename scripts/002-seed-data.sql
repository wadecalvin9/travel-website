-- Insert admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (email, password_hash, name, role) 
SELECT 'admin@travelconnect.com', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeJ9QmjKjKjKjKjKjKjKjKjKjKjKjKjK', 'Admin User', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@travelconnect.com');

-- Insert a regular user (password: password123 - hashed with bcrypt)
INSERT INTO users (email, password_hash, name, role, phone, date_of_birth, nationality, travel_preferences) 
SELECT 'user@example.com', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeJ9QmjKjKjKjKjKjKjKjKjKjKjKjKjK', 'Jane Doe', 'user', '123-456-7890', '1990-01-01', 'American', '{"accommodationType": "mid-range", "groupSize": "couple", "activityLevel": "moderate", "interests": ["Wildlife Photography", "Cultural Experiences"]}'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@example.com');

-- Insert destinations
INSERT INTO destinations (name, description, image_url, country, featured) 
SELECT 'Serengeti National Park', 'Experience the Great Migration and witness millions of wildebeest crossing the plains.', '/placeholder.svg?height=400&width=600', 'Tanzania', true
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Serengeti National Park');

INSERT INTO destinations (name, description, image_url, country, featured) 
SELECT 'Masai Mara', 'Kenya''s premier safari destination known for its exceptional wildlife viewing.', '/placeholder.svg?height=400&width=600', 'Kenya', true
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Masai Mara');

INSERT INTO destinations (name, description, image_url, country, featured) 
SELECT 'Kruger National Park', 'South Africa''s flagship national park with incredible Big Five sightings.', '/placeholder.svg?height=400&width=600', 'South Africa', true
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Kruger National Park');

INSERT INTO destinations (name, description, image_url, country, featured) 
SELECT 'Okavango Delta', 'Botswana''s pristine wetland paradise offering unique water-based safaris.', '/placeholder.svg?height=400&width=600', 'Botswana', false
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Okavango Delta');

INSERT INTO destinations (name, description, image_url, country, featured) 
SELECT 'Ngorongoro Crater', 'Tanzania''s natural wonder - a wildlife haven in an ancient volcanic crater.', '/placeholder.svg?height=400&width=600', 'Tanzania', true
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Ngorongoro Crater');

-- Insert safari packages
INSERT INTO packages (title, description, detailed_description, price, duration_days, max_participants, image_url, destination_id, included, excluded, itinerary, featured) 
SELECT 
  'Great Migration Safari',
  'Witness the spectacular Great Migration in Serengeti National Park',
  'Experience one of nature''s most incredible spectacles as millions of wildebeest, zebras, and gazelles migrate across the Serengeti plains. This 7-day adventure includes game drives, cultural visits, and luxury accommodations.',
  2499.00,
  7,
  8,
  '/placeholder.svg?height=300&width=400',
  (SELECT id FROM destinations WHERE name = 'Serengeti National Park' LIMIT 1),
  ARRAY['Accommodation', 'All meals', 'Game drives', 'Professional guide', 'Park fees'],
  ARRAY['International flights', 'Visa fees', 'Personal expenses', 'Tips'],
  '{"day1": "Arrival in Arusha", "day2": "Serengeti National Park", "day3": "Central Serengeti", "day4": "Northern Serengeti", "day5": "Ngorongoro Crater", "day6": "Cultural visit", "day7": "Departure"}',
  true
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE title = 'Great Migration Safari');

INSERT INTO packages (title, description, detailed_description, price, duration_days, max_participants, image_url, destination_id, included, excluded, itinerary, featured) 
SELECT 
  'Big Five Adventure',
  'Complete Big Five safari experience in Masai Mara',
  'Track lions, elephants, buffalo, leopards, and rhinos in Kenya''s most famous reserve. This 5-day safari combines thrilling game drives with cultural experiences.',
  1899.00,
  5,
  6,
  '/placeholder.svg?height=300&width=400',
  (SELECT id FROM destinations WHERE name = 'Masai Mara' LIMIT 1),
  ARRAY['Accommodation', 'All meals', 'Game drives', 'Masai village visit', 'Professional guide'],
  ARRAY['International flights', 'Visa fees', 'Alcoholic beverages', 'Tips'],
  '{"day1": "Arrival in Nairobi", "day2": "Masai Mara", "day3": "Full day game drives", "day4": "Cultural visit", "day5": "Departure"}',
  true
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE title = 'Big Five Adventure');

INSERT INTO packages (title, description, detailed_description, price, duration_days, max_participants, image_url, destination_id, included, excluded, itinerary, featured) 
SELECT 
  'Kruger Explorer',
  'South African safari adventure in Kruger National Park',
  'Explore one of Africa''s largest game reserves with excellent Big Five viewing opportunities. Includes luxury lodge accommodation and expert guides.',
  1599.00,
  4,
  10,
  '/placeholder.svg?height=300&width=400',
  (SELECT id FROM destinations WHERE name = 'Kruger National Park' LIMIT 1),
  ARRAY['Lodge accommodation', 'All meals', 'Game drives', 'Professional guide', 'Park fees'],
  ARRAY['International flights', 'Visa fees', 'Personal expenses', 'Optional activities'],
  '{"day1": "Arrival in Johannesburg", "day2": "Southern Kruger", "day3": "Central Kruger", "day4": "Departure"}',
  false
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE title = 'Kruger Explorer');

-- Insert testimonials
INSERT INTO testimonials (name, email, rating, comment, featured, approved) 
SELECT 'Sarah Johnson', 'sarah@email.com', 5, 'Absolutely incredible experience! The Great Migration was breathtaking and our guide was exceptional.', true, true
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE email = 'sarah@email.com');

INSERT INTO testimonials (name, email, rating, comment, featured, approved) 
SELECT 'Michael Chen', 'michael@email.com', 5, 'Best safari experience ever! Saw all Big Five and the accommodations were luxury.', true, true
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE email = 'michael@email.com');

INSERT INTO testimonials (name, email, rating, comment, featured, approved) 
SELECT 'Emma Wilson', 'emma@email.com', 4, 'Amazing wildlife viewing and professional service. Would definitely recommend!', false, true
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE email = 'emma@email.com');

INSERT INTO testimonials (name, email, rating, comment, featured, approved) 
SELECT 'David Brown', 'david@email.com', 5, 'The Kruger safari exceeded all expectations. Perfect organization and unforgettable memories.', true, true
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE email = 'david@email.com');

-- Insert homepage content
INSERT INTO content (page, section, content) 
SELECT 'homepage', 'hero', '{"title": "Discover Africa''s Wild Heart", "subtitle": "Embark on unforgettable safari adventures", "cta": "Explore Packages"}'
WHERE NOT EXISTS (SELECT 1 FROM content WHERE page = 'homepage' AND section = 'hero');

INSERT INTO content (page, section, content) 
SELECT 'homepage', 'intro', '{"title": "Welcome to Travel Connect Expeditions", "description": "We specialize in creating extraordinary safari experiences across East and Southern Africa. Our expert guides and carefully crafted itineraries ensure you witness Africa''s incredible wildlife in their natural habitat."}'
WHERE NOT EXISTS (SELECT 1 FROM content WHERE page = 'homepage' AND section = 'intro');

INSERT INTO content (page, section, content) 
SELECT 'about', 'story', '{"title": "Our Story", "content": "Founded in 2010, Travel Connect Expeditions has been creating life-changing safari experiences for over a decade. Our passion for wildlife conservation and sustainable tourism drives everything we do."}'
WHERE NOT EXISTS (SELECT 1 FROM content WHERE page = 'about' AND section = 'story');

-- Insert mock bookings for the demo user (user@example.com)
INSERT INTO bookings (user_id, package_id, package_title, package_image, status, travel_date, participants, total_amount, special_requests) 
SELECT 
  (SELECT id FROM users WHERE email = 'user@example.com'), 
  (SELECT id FROM packages WHERE title = 'Great Migration Safari'), 
  'Great Migration Safari', 
  '/placeholder.svg?height=200&width=300', 
  'confirmed', 
  '2024-08-20', 
  2, 
  4998.00, 
  'Vegetarian meals preferred'
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'user@example.com') 
  AND EXISTS (SELECT 1 FROM packages WHERE title = 'Great Migration Safari')
  AND NOT EXISTS (SELECT 1 FROM bookings WHERE user_id = (SELECT id FROM users WHERE email = 'user@example.com') AND package_id = (SELECT id FROM packages WHERE title = 'Great Migration Safari'));

INSERT INTO bookings (user_id, package_id, package_title, package_image, status, travel_date, participants, total_amount, special_requests) 
SELECT 
  (SELECT id FROM users WHERE email = 'user@example.com'), 
  (SELECT id FROM packages WHERE title = 'Big Five Adventure'), 
  'Big Five Adventure', 
  '/placeholder.svg?height=200&width=300', 
  'completed', 
  '2024-06-15', 
  1, 
  1899.00, 
  NULL
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'user@example.com') 
  AND EXISTS (SELECT 1 FROM packages WHERE title = 'Big Five Adventure')
  AND NOT EXISTS (SELECT 1 FROM bookings WHERE user_id = (SELECT id FROM users WHERE email = 'user@example.com') AND package_id = (SELECT id FROM packages WHERE title = 'Big Five Adventure'));

-- Insert mock reviews for the demo user (user@example.com)
INSERT INTO reviews (user_id, package_id, package_title, rating, comment, images, approved) 
SELECT 
  (SELECT id FROM users WHERE email = 'user@example.com'), 
  (SELECT id FROM packages WHERE title = 'Big Five Adventure'), 
  'Big Five Adventure', 
  5, 
  'Absolutely incredible experience! The guides were knowledgeable and we saw all the Big Five. The accommodations were excellent and the food was amazing. Would definitely book again!', 
  ARRAY['/placeholder.svg?height=200&width=300'], 
  true
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'user@example.com') 
  AND EXISTS (SELECT 1 FROM packages WHERE title = 'Big Five Adventure')
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE user_id = (SELECT id FROM users WHERE email = 'user@example.com') AND package_id = (SELECT id FROM packages WHERE title = 'Big Five Adventure'));
