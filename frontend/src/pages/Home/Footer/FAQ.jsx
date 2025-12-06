import React, { useState } from 'react';

function FAQ() {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'What payment methods do you accept?',
      answer: 'We accept Cash & Bkash only.. Soon there will be multiple payment options..',
    },
    {
      id: 2,
      question: 'What is your return policy?',
      answer: 'We offer a 2-day return policy. Items must be in their original condition and packaging based on product types.',
    },
    {
      id: 3,
      question: 'Do you ship outside Dhaka?',
      answer: 'Yes, we ship allover Bangladesh. Shipping fees and delivery times vary by location.',
    },
    {
      id: 4,
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, we will message you a tracking number and a link to track your package.',
    },
    {
      id: 5,
      question: 'Can I cancel or modify my order?',
      answer: 'Orders can be modified or canceled within 1 hours of placing the order. But it can only be modified or cancel through emails. After that, it is processed for shipping.',
    },
  ];

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Have questions? We're here to help.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <button
                onClick={() => toggleQuestion(faq.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <span className={`ml-6 flex-shrink-0 transition-transform duration-200 ${openQuestion === faq.id ? 'rotate-180' : ''}`}>
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openQuestion === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;
