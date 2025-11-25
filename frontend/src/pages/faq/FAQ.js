import React, { useState } from 'react';
import './FAQ.css';

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
    <div className="faq">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq) => (
          <div key={faq.id} className="faq-item">
            <div className="faq-question" onClick={() => toggleQuestion(faq.id)}>
              <h4>{faq.question}</h4>
              <span>{openQuestion === faq.id ? '-' : '+'}</span>
            </div>
            {openQuestion === faq.id && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
