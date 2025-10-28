// src/app/layout.js
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyA1lFSMKLk2HtkkpjjXLmWP4fhGFntbBqM&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
