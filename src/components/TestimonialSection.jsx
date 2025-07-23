import React from 'react';

const testimonials = [
  {
    name: 'Alex P.',
    text: 'EasyGIFMaker is the fastest and easiest GIF tool I have ever used. Highly recommended!',
  },
  {
    name: 'Maria L.',
    text: 'I love the privacy-first approach. No sign-up, no hassle, just great GIFs!',
  },
  {
    name: 'Samir K.',
    text: 'The tools are intuitive and work perfectly on my phone. Great for quick social media posts.',
  },
];

export default function TestimonialSection() {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow text-center">
            <p className="text-lg text-gray-800 mb-4">"{t.text}"</p>
            <span className="block text-blue-700 font-semibold">- {t.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
} 