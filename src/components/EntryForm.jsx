'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EntryForm() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const autocompleteRef = useRef(null);
  const router = useRouter();

  const handleNameChange = (e) => {
    const input = e.target.value;
    const capitalized = input
      .split(' ')
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
    setName(capitalized);
  };

  const initAutocomplete = () => {
    if (!window.google || !window.google.maps) return;
    const input = document.getElementById('location-input');
    autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
      types: ['geocode'],
    });
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setCoordinates({ lat, lng });
        setLocation(place.formatted_address);
      }
    });
  };

  useEffect(() => {
    initAutocomplete();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      name,
      dob,
      location,
      lat: coordinates.lat || '',
      lng: coordinates.lng || '',
    }).toString();
    router.push(`/result?${query}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-surface)]/80 border border-[var(--line)] p-5 sm:p-6 rounded-2xl shadow-glow backdrop-blur-md w-[85%] max-w-xs sm:max-w-sm md:max-w-md z-30 text-[var(--text-primary)]"
    >
      <h2 className="text-center text-2xl sm:text-3xl font-semibold font-[Cinzel] text-[var(--accent-gold)] mb-6">
        Enter Your Details
      </h2>

      {/* Name */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2 text-[var(--accent-gold-light)]">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-full px-4 py-2 bg-[#0b0f1a]/80 text-[var(--text-primary)] border border-[var(--line)] rounded-md focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] outline-none transition-all duration-200"
          placeholder="Enter your full name"
          required
        />
      </div>

{/* DOB */}
<div className="mb-5 relative">
  <label className="block text-sm font-medium mb-2 text-[var(--accent-gold-light)]">
    Date of Birth
  </label>

  <input
    type="date"
    value={dob}
    onChange={(e) => setDob(e.target.value)}
    className="w-full px-4 py-3 bg-[#0b0f1a]/80 text-[var(--text-primary)] 
               border border-[var(--line)] rounded-md 
               focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] 
               outline-none transition-all duration-200 relative z-10 
               text-base appearance-none"
    required
  />

  {/* Mobile-only fake placeholder, vertically centered */}
  <span
    className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none 
                transition-opacity duration-200 sm:hidden 
                text-[var(--accent-gold-light)] text-base ${
      dob ? 'opacity-0' : 'opacity-70'
    }`}
  >
    dd/mm/yyyy
  </span>
</div>





      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2.5 px-4 font-semibold text-[var(--bg-primary)] bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] rounded-md transition-all duration-300 shadow-glow"
      >
        Decode My Chart
      </button>
    </form>
  );
}
