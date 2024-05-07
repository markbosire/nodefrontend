import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  const faqData = [
    {
      question: 'What is React?',
      answer: 'React is a JavaScript library for building user interfaces.',
    },
    {
      question: 'What are the advantages of using React?',
      answer: 'React offers advantages like component-based architecture, virtual DOM, and a large ecosystem of libraries and tools.',
    },
    // Add more FAQ items here
  ];

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div>
      <h2>Frequently Asked Questions</h2>
      {faqData.map((faq, index) => (
        <div key={index}>
          <div onClick={() => toggleAnswer(index)} style={{ cursor: 'pointer' }}>
            <h3>{faq.question}</h3>
          </div>
          {openIndex === index && <p>{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
};

export default FAQ;