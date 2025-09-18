-- Update package images with real safari photos
UPDATE packages SET 
  image_url = 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop&crop=center',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop&crop=center'
  ]
WHERE title = 'Great Migration Safari';

UPDATE packages SET 
  image_url = 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=400&fit=crop&crop=center',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&crop=center'
  ]
WHERE title = 'Big Five Adventure';

UPDATE packages SET 
  image_url = 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&h=400&fit=crop&crop=center',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'
  ]
WHERE title = 'Kruger Explorer';

UPDATE packages SET 
  image_url = 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop&crop=center',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop&crop=center'
  ]
WHERE title = 'Okavango Delta Experience';

-- Update destination images as well
UPDATE destinations SET 
  image_url = 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop&crop=center'
WHERE name = 'Serengeti National Park';

UPDATE destinations SET 
  image_url = 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop&crop=center'
WHERE name = 'Masai Mara';

UPDATE destinations SET 
  image_url = 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop&crop=center'
WHERE name = 'Kruger National Park';

UPDATE destinations SET 
  image_url = 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&crop=center'
WHERE name = 'Okavango Delta';

UPDATE destinations SET 
  image_url = 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop&crop=center'
WHERE name = 'Ngorongoro Crater';
