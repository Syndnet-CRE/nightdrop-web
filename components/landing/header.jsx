'use client'

import Link from 'next/link'
import { useState } from 'react'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const LOGIN_URL = `${APP_URL}/login`
const SIGNUP_URL = `${APP_URL}/signup`

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSmoothScroll = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-600">
          Nightdrop
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          <a
            href="#features"
            onClick={(e) => handleSmoothScroll(e, 'features')}
            className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            onClick={(e) => handleSmoothScroll(e, 'pricing')}
            className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={(e) => handleSmoothScroll(e, 'faq')}
            className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition"
          >
            FAQ
          </a>
        </nav>

        <div className="flex gap-4 items-center">
          <Link href={LOGIN_URL} className="text-gray-700 dark:text-gray-300 hover:text-green-600">
            Sign In
          </Link>
          <Link
            href={SIGNUP_URL}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}
