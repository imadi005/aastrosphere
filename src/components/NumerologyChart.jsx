'use client'

import React from 'react'

export default function NumerologyChart({ name, dob, location, coordinates }) {
  const digits = dob.replaceAll('-', '').split('').map(Number)

  const formatDate = (dob) => dob.split('-').join('-')

  const basicNum = (() => {
    const day = parseInt(dob.split('-')[2])
    return day < 10 ? day : [...String(day)].reduce((a, b) => a + Number(b), 0)
  })()

  const destinyNum = (() => {
    let sum = digits.reduce((a, b) => a + b, 0)
    while (sum >= 10) {
      sum = [...String(sum)].reduce((a, b) => a + Number(b), 0)
    }
    return sum
  })()

  const supportiveNums = (() => {
    const day = parseInt(dob.split('-')[2])
    if (day < 10) return []
    return String(day).split('').map(Number)
  })()

  const gridData = (() => {
    const excluded = ['1', '9'] // Ignore century digits like '19' or '20'
    const rawDigits = digits.filter(d => !excluded.includes(String(d)))
    const allDigits = [...rawDigits, ...String(basicNum), ...String(destinyNum)].map(Number)
    const freqMap = Array(10).fill(0)
    allDigits.forEach(num => {
      if (num !== 0) freqMap[num] += 1
    })
    return freqMap
  })()

  const renderCell = (number) => {
    const count = gridData[number]
    return (
      <div key={number} className="flex items-center justify-center border border-purple-500 h-16 text-white text-xl font-bold">
        {Array(count).fill(number).join(' ')}
      </div>
    )
  }

  return (
    <div className="text-white px-6 py-10 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">🔮 Numerology Chart</h2>
      <div className="bg-neutral-900 border border-purple-600 p-6 rounded-xl space-y-4">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Date of Birth:</strong> {formatDate(dob)}</p>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Coordinates:</strong> {coordinates.lat}, {coordinates.lng}</p>
        <p><strong>Basic Number:</strong> {basicNum}</p>
        <p><strong>Destiny Number:</strong> {destinyNum}</p>
        <p><strong>Supportive Numbers:</strong> {supportiveNums.length > 0 ? supportiveNums.join(' & ') : 'None'}</p>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">🧮 3x3 Numerology Grid</h3>
          <div className="grid grid-cols-3 gap-2 bg-black border border-purple-700 p-2 rounded-md">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(renderCell)}
          </div>
        </div>
      </div>

      <p className="text-center mt-6 text-sm italic text-neutral-400">
        Based on traditional Vedic Numerology principles.
      </p>
    </div>
  )
}
