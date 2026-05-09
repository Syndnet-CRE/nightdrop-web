'use client'

import { useState } from 'react'

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'How does deal matching work?',
      answer:
        'You set your buy box criteria (location, asset type, price range, etc.) and Nightdrop continuously screens the market for matches. New deals appear in your feed automatically.',
    },
    {
      question: 'What data sources do you use?',
      answer:
        'We aggregate data from public tax records, MLS systems, commercial databases, and proprietary distress indicators. All data is cleaned and standardized.',
    },
    {
      question: 'Can I integrate with my CRM?',
      answer:
        'Yes, Nightdrop integrates with major CRM platforms. Contact our sales team for integration setup.',
    },
    {
      question: 'How often are deals updated?',
      answer:
        'Deals are updated daily as new properties match your criteria. You can set notifications to alert you immediately.',
    },
    {
      question: 'Do you offer a free trial?',
      answer:
        'Yes, we offer a 14-day free trial of all features. No credit card required to get started.',
    },
    {
      question: 'What if I need custom features?',
      answer:
        'Our Enterprise plan includes custom integrations and features tailored to your workflow. Contact us for details.',
    },
  ]

  return (
    <section id="faq" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition flex justify-between items-center"
              >
                {faq.question}
                <span className={`transition ${openIndex === idx ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openIndex === idx && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
