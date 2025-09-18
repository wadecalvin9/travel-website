-- Create site_settings table for customizable frontend elements
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default site settings using WHERE NOT EXISTS
INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'site_name', '"Travel Connect Expeditions"', 'branding', 'Main site name displayed in header and title'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'site_name');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'site_tagline', '"African Safari Adventures"', 'branding', 'Tagline displayed under site name'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'site_tagline');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'site_logo', '"/placeholder.svg?height=60&width=200"', 'branding', 'Main site logo URL'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'site_logo');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'favicon', '"/favicon.ico"', 'branding', 'Site favicon URL'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'favicon');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'primary_color', '"#16a34a"', 'theme', 'Primary brand color (green)'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'primary_color');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'secondary_color', '"#059669"', 'theme', 'Secondary brand color (darker green)'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'secondary_color');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'accent_color', '"#f59e0b"', 'theme', 'Accent color for highlights'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'accent_color');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'text_primary', '"#111827"', 'theme', 'Primary text color'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'text_primary');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'text_secondary', '"#6b7280"', 'theme', 'Secondary text color'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'text_secondary');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'background_primary', '"#ffffff"', 'theme', 'Primary background color'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'background_primary');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'background_secondary', '"#f9fafb"', 'theme', 'Secondary background color'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'background_secondary');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'hero_title', '"Discover Africa''s Wild Heart"', 'hero', 'Main hero section title'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'hero_title');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'hero_subtitle', '"Embark on unforgettable safari adventures across East and Southern Africa"', 'hero', 'Hero section subtitle'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'hero_subtitle');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'hero_cta_text', '"Explore Packages"', 'hero', 'Hero call-to-action button text'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'hero_cta_text');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'hero_background_image', '"/placeholder.svg?height=600&width=1200"', 'hero', 'Hero section background image'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'hero_background_image');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'hero_video_url', '""', 'hero', 'Optional hero background video URL'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'hero_video_url');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'contact_phone_primary', '"+254 700 123 456"', 'contact', 'Primary phone number'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'contact_phone_primary');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'contact_phone_secondary', '"+1 (555) 123-4567"', 'contact', 'Secondary phone number'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'contact_phone_secondary');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'contact_email_primary', '"info@travelconnectexpeditions.com"', 'contact', 'Primary email address'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'contact_email_primary');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'contact_email_bookings', '"bookings@travelconnectexpeditions.com"', 'contact', 'Bookings email address'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'contact_email_bookings');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'contact_address', '"Safari Center, 2nd Floor\\nNairobi, Kenya\\nP.O. Box 12345-00100"', 'contact', 'Physical address'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'contact_address');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'contact_hours', '"Monday - Friday: 8:00 AM - 6:00 PM\\nSaturday: 9:00 AM - 4:00 PM\\nSunday: Closed"', 'contact', 'Business hours'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'contact_hours');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'whatsapp_number', '"+254700123456"', 'contact', 'WhatsApp contact number'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'whatsapp_number');

-- Continue with remaining settings...
INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'social_facebook', '"https://facebook.com/travelconnectexpeditions"', 'social', 'Facebook page URL'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'social_facebook');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'social_instagram', '"https://instagram.com/travelconnectexpeditions"', 'social', 'Instagram profile URL'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'social_instagram');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'social_twitter', '"https://twitter.com/travelconnectexp"', 'social', 'Twitter profile URL'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'social_twitter');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'social_youtube', '"https://youtube.com/@travelconnectexpeditions"', 'social', 'YouTube channel URL'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'social_youtube');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'social_linkedin', '"https://linkedin.com/company/travel-connect-expeditions"', 'social', 'LinkedIn company page URL'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'social_linkedin');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'map_embed_url', '"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8197!2d36.8219!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM2wrA0OSczMS4wIkU!5e0!3m2!1sen!2ske!4v1234567890"', 'contact', 'Google Maps embed URL'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'map_embed_url');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'map_latitude', '"-1.2921"', 'contact', 'Office location latitude'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'map_latitude');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'map_longitude', '"36.8219"', 'contact', 'Office location longitude'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'map_longitude');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'footer_description', '"Creating unforgettable safari experiences across Africa since 2010."', 'footer', 'Footer company description'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'footer_description');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'footer_copyright', '"© 2024 Travel Connect Expeditions. All rights reserved."', 'footer', 'Footer copyright text'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'footer_copyright');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'about_story_title', '"Our Story"', 'about', 'About page story section title'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'about_story_title');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'about_story_content', '"Founded in 2010, Travel Connect Expeditions has been creating life-changing safari experiences for over a decade. Our passion for wildlife conservation and sustainable tourism drives everything we do."', 'about', 'About page story content'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'about_story_content');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'about_mission', '"To provide authentic, educational, and transformative safari experiences that create lasting memories and inspire conservation action."', 'about', 'Company mission statement'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'about_mission');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'about_vision', '"To be Africa''s leading sustainable safari operator, connecting travelers with wildlife while supporting conservation and local communities."', 'about', 'Company vision statement'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'about_vision');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'feature_1_title', '"Expert Local Guides"', 'features', 'First unique selling point title'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'feature_1_title');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'feature_1_description', '"Our experienced guides bring decades of knowledge and passion for African wildlife."', 'features', 'First unique selling point description'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'feature_1_description');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'feature_1_icon', '"users"', 'features', 'First feature icon name (Lucide icon)'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'feature_1_icon');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'feature_2_title', '"Conservation Focus"', 'features', 'Second unique selling point title'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'feature_2_title');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'feature_2_description', '"Supporting wildlife conservation and sustainable tourism practices."', 'features', 'Second unique selling point description'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'feature_2_description');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'feature_2_icon', '"heart"', 'features', 'Second feature icon name'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'feature_2_icon');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'feature_3_title', '"Small Group Experience"', 'features', 'Third unique selling point title'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'feature_3_title');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'feature_3_description', '"Intimate safari experiences with personalized attention and flexibility."', 'features', 'Third unique selling point description'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'feature_3_description');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'feature_3_icon', '"users"', 'features', 'Third feature icon name'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'feature_3_icon');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'meta_title', '"Travel Connect Expeditions - African Safari Adventures"', 'seo', 'Default page title for SEO'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'meta_title');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'meta_description', '"Discover extraordinary safari experiences across East and Southern Africa with Travel Connect Expeditions. Expert guides, luxury accommodations, and unforgettable wildlife encounters."', 'seo', 'Default meta description'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'meta_description');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'meta_keywords', '"safari, africa, wildlife, travel, kenya, tanzania, serengeti, masai mara"', 'seo', 'Default meta keywords'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'meta_keywords');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'google_analytics_id', '""', 'analytics', 'Google Analytics tracking ID'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'google_analytics_id');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'facebook_pixel_id', '""', 'analytics', 'Facebook Pixel ID'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'facebook_pixel_id');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'google_tag_manager_id', '""', 'analytics', 'Google Tag Manager ID'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'google_tag_manager_id');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'booking_deposit_percentage', '30', 'booking', 'Required deposit percentage for bookings'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'booking_deposit_percentage');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'booking_cancellation_policy', '"Free cancellation up to 30 days before departure. 50% refund for cancellations 15-29 days before. No refund for cancellations within 14 days."', 'booking', 'Booking cancellation policy'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'booking_cancellation_policy');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'booking_terms_url', '"/terms"', 'booking', 'Terms and conditions page URL'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'booking_terms_url');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'booking_privacy_url', '"/privacy"', 'booking', 'Privacy policy page URL'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'booking_privacy_url');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'testimonials_auto_approve', 'false', 'testimonials', 'Auto-approve new testimonials'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'testimonials_auto_approve');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'testimonials_show_count', '6', 'testimonials', 'Number of testimonials to show on homepage'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'testimonials_show_count');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'gallery_images', '[]', 'gallery', 'Homepage gallery images array'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'gallery_images');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'gallery_show_on_homepage', 'true', 'gallery', 'Show gallery section on homepage'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'gallery_show_on_homepage');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'newsletter_enabled', 'true', 'newsletter', 'Enable newsletter signup'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'newsletter_enabled');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'newsletter_provider', '"mailchimp"', 'newsletter', 'Newsletter service provider'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'newsletter_provider');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'newsletter_api_key', '""', 'newsletter', 'Newsletter service API key'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'newsletter_api_key');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'custom_css', '""', 'advanced', 'Custom CSS to inject into the site'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'custom_css');

INSERT INTO site_settings (setting_key, setting_value, category, description) 
SELECT 'custom_js', '""', 'advanced', 'Custom JavaScript to inject into the site'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'custom_js');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
