-- Insert sample destinations first
INSERT INTO destinations (name, country, description, image_url, featured) 
SELECT 'Serengeti National Park', 'Tanzania', 'Home to the Great Migration and abundant wildlife', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600', true
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Serengeti National Park' AND country = 'Tanzania');

INSERT INTO destinations (name, country, description, image_url, featured) 
SELECT 'Maasai Mara', 'Kenya', 'Famous for its exceptional population of lions, leopards and cheetahs', 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600', true
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Maasai Mara' AND country = 'Kenya');

INSERT INTO destinations (name, country, description, image_url, featured) 
SELECT 'Kruger National Park', 'South Africa', 'One of Africa''s largest game reserves', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600', true
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Kruger National Park' AND country = 'South Africa');

INSERT INTO destinations (name, country, description, image_url, featured) 
SELECT 'Okavango Delta', 'Botswana', 'A pristine wilderness area with diverse wildlife', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600', false
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Okavango Delta' AND country = 'Botswana');

-- Insert sample packages
INSERT INTO packages (
  title, 
  description, 
  detailed_description,
  price, 
  duration_days, 
  max_participants, 
  destination_id, 
  image_url,
  featured,
  included,
  excluded,
  itinerary,
  gallery_images,
  view_count
) 
SELECT 
  'Great Migration Safari',
  'Witness the spectacular wildebeest migration in the Serengeti',
  'Experience one of nature''s most incredible spectacles as over 2 million wildebeest, zebras, and gazelles migrate across the Serengeti plains. This 7-day adventure includes game drives, cultural visits, and luxury accommodations.',
  3500,
  7,
  8,
  (SELECT id FROM destinations WHERE name = 'Serengeti National Park' LIMIT 1),
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600',
  true,
  ARRAY['All meals', 'Accommodation', 'Game drives', 'Professional guide', 'Park fees', 'Airport transfers'],
  ARRAY['International flights', 'Visa fees', 'Travel insurance', 'Personal expenses', 'Tips'],
  '{"day1": "Arrival in Arusha, transfer to hotel", "day2": "Drive to Serengeti, afternoon game drive", "day3": "Full day game drive in Central Serengeti", "day4": "Migration tracking and photography", "day5": "Visit Maasai village and cultural experience", "day6": "Final game drive and departure preparation", "day7": "Return to Arusha and departure"}',
  ARRAY['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400', 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=400', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&h=400'],
  156
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE title = 'Great Migration Safari');

INSERT INTO packages (
  title, 
  description, 
  detailed_description,
  price, 
  duration_days, 
  max_participants, 
  destination_id, 
  image_url,
  featured,
  included,
  excluded,
  itinerary,
  gallery_images,
  view_count
) 
SELECT 
  'Big Five Adventure',
  'Encounter Africa''s Big Five in their natural habitat',
  'Join us for an unforgettable 5-day safari adventure in Kenya''s Maasai Mara. Track lions, elephants, buffalo, leopards, and rhinos while staying in comfortable safari lodges with experienced guides.',
  2800,
  5,
  6,
  (SELECT id FROM destinations WHERE name = 'Maasai Mara' LIMIT 1),
  'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600',
  true,
  ARRAY['All meals', 'Lodge accommodation', 'Game drives', 'Professional guide', 'Park fees', 'Airport transfers'],
  ARRAY['International flights', 'Visa fees', 'Travel insurance', 'Personal expenses', 'Alcoholic beverages'],
  '{"day1": "Arrival in Nairobi, transfer to Maasai Mara", "day2": "Morning and afternoon game drives", "day3": "Full day exploring the reserve", "day4": "Hot air balloon safari (optional)", "day5": "Final game drive and return to Nairobi"}',
  ARRAY['https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=400', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400'],
  89
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE title = 'Big Five Adventure');

INSERT INTO packages (
  title, 
  description, 
  detailed_description,
  price, 
  duration_days, 
  max_participants, 
  destination_id, 
  image_url,
  featured,
  included,
  excluded,
  itinerary,
  gallery_images,
  view_count
) 
SELECT 
  'Kruger Explorer',
  'Explore South Africa''s premier wildlife destination',
  'Discover the incredible biodiversity of Kruger National Park on this 4-day safari. From the Big Five to over 500 bird species, experience the best of South African wildlife with expert guides.',
  1900,
  4,
  10,
  (SELECT id FROM destinations WHERE name = 'Kruger National Park' LIMIT 1),
  'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600',
  false,
  ARRAY['All meals', 'Lodge accommodation', 'Game drives', 'Professional guide', 'Park fees'],
  ARRAY['Flights', 'Visa fees', 'Travel insurance', 'Personal expenses', 'Tips'],
  '{"day1": "Arrival and afternoon game drive", "day2": "Full day game drives in different sections", "day3": "Bush walk and night drive", "day4": "Final morning drive and departure"}',
  ARRAY['https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&h=400'],
  67
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE title = 'Kruger Explorer');

INSERT INTO packages (
  title, 
  description, 
  detailed_description,
  price, 
  duration_days, 
  max_participants, 
  destination_id, 
  image_url,
  featured,
  included,
  excluded,
  itinerary,
  gallery_images,
  view_count
) 
SELECT 
  'Okavango Delta Experience',
  'Navigate the pristine waterways of Botswana',
  'Experience the unique ecosystem of the Okavango Delta on this 6-day water and land safari. Travel by mokoro (traditional canoe) and 4x4 vehicle to explore this UNESCO World Heritage site.',
  4200,
  6,
  8,
  (SELECT id FROM destinations WHERE name = 'Okavango Delta' LIMIT 1),
  'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600',
  true,
  ARRAY['All meals', 'Tented camp accommodation', 'Mokoro excursions', 'Game drives', 'Professional guide', 'Park fees'],
  ARRAY['International flights', 'Visa fees', 'Travel insurance', 'Personal expenses', 'Tips'],
  '{"day1": "Arrival in Maun, transfer to delta", "day2": "Mokoro excursions and island walks", "day3": "Game drives and bird watching", "day4": "Fishing and cultural activities", "day5": "Final mokoro trip and wildlife viewing", "day6": "Return to Maun and departure"}',
  ARRAY['https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400'],
  134
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE title = 'Okavango Delta Experience');

-- Insert sample testimonials
INSERT INTO testimonials (name, email, comment, rating, featured, approved, image_url) 
SELECT 'Sarah Johnson', 'sarah@example.com', 'The Great Migration safari was absolutely breathtaking! Our guide was knowledgeable and the accommodations were perfect.', 5, true, true, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE email = 'sarah@example.com');

INSERT INTO testimonials (name, email, comment, rating, featured, approved, image_url) 
SELECT 'Michael Chen', 'michael@example.com', 'Best safari experience ever! Saw all the Big Five and the Maasai Mara exceeded all expectations.', 5, true, true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE email = 'michael@example.com');

INSERT INTO testimonials (name, email, comment, rating, featured, approved, image_url) 
SELECT 'Emma Wilson', 'emma@example.com', 'The Okavango Delta trip was magical. The mokoro rides and wildlife sightings were unforgettable.', 5, false, true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE email = 'emma@example.com');

-- Insert sample site settings
INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'hero_title', '"Discover Africa''s Wild Heart"', 'homepage', 'Main hero section title'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'hero_title');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'hero_subtitle', '"Experience unforgettable safari adventures with our expert guides and carefully crafted itineraries."', 'homepage', 'Hero section subtitle'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'hero_subtitle');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'hero_cta_text', '"Explore Safari Packages"', 'homepage', 'Hero call-to-action button text'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'hero_cta_text');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'hero_background_image', '"https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800&q=80"', 'homepage', 'Hero background image URL'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'hero_background_image');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'site_name', '"Travel Connect Expeditions"', 'general', 'Website name'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'site_name');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'site_description', '"Experience unforgettable safari adventures across East and Southern Africa"', 'general', 'Website description'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'site_description');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'phone', '"+1 (555) 123-4567"', 'contact', 'Contact phone number'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'phone');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'email', '"info@travelconnectexpeditions.com"', 'contact', 'Contact email address'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'email');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'whatsapp_number', '"+1234567890"', 'contact', 'WhatsApp contact number'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'whatsapp_number');
