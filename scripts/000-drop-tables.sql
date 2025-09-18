-- Drop tables in reverse order of dependency to avoid foreign key issues
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS content CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
