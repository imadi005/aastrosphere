'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EntryForm() {
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [location, setLocation] = useState('')
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null })
  const autocompleteRef = useRef(null)
  const router = useRouter()

  const handleNameChange = (e) => {
    const input = e.target.value
    const capitalized = input
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
    setName(capitalized)
  }

  const initAutocomplete = () => {
    if (!window.google || !window.google.maps) return

    const input = document.getElementById('location-input')
    autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
      types: ['geocode'],
    })

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace()
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        setCoordinates({ lat, lng })
        setLocation(place.formatted_address)
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const query = new URLSearchParams({
      name,
      dob,
      location,
      lat: coordinates.lat || '',
      lng: coordinates.lng || ''
    }).toString()

    router.push(`/result?${query}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/80 p-6 rounded-xl shadow-lg backdrop-blur-md w-full max-w-sm z-30 relative"
    >
      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-white">Name</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-full px-3 py-2 bg-neutral-900 text-white border border-neutral-700 rounded-md"
          placeholder="Enter your full name"
          required
        />
      </div>

      {/* DOB */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-white">Date of Birth</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full px-3 py-2 bg-neutral-900 text-white border border-neutral-700 rounded-md"
          required
        />
      </div>

    

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition"
      >
        Decode My Chart
      </button>
    </form>
  )
}
