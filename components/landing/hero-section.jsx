'use client'

import Link from 'next/link'
import { Header } from './header'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const SIGNUP_URL = `${APP_URL}/signup`

export function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-green-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>

      <div className="relative">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Deal Flow for CRE Investors
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Nightdrop matches distressed properties to your buy box. Smart screening, real data, faster deals.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Link
              href={SIGNUP_URL}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
            >
              Join the Waitlist
            </Link>
            <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              Watch Demo
            </button>
          </div>

          <div className="inline-block bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Coming soon</p>
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Dashboard Preview</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
