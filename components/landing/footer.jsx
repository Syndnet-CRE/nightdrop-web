'use client'

import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const LOGIN_URL = `${APP_URL}/login`
const SIGNUP_URL = `${APP_URL}/signup`

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-green-500 mb-2">Nightdrop</h3>
            <p className="text-gray-400">Smart deal flow for CRE investors</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#features" className="hover:text-green-500 transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-green-500 transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href={SIGNUP_URL} className="hover:text-green-500 transition">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-green-500 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-green-500 transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
          <p className="text-gray-400">© 2026 Nightdrop. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-green-500 transition">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-green-500 transition">
              GitHub
            </a>
            <a href="#" className="text-gray-400 hover:text-green-500 transition">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
