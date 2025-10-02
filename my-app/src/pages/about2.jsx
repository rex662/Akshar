import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Ab() {
  return (
    <div className="min-h-screen bg-[#E8C39E]">
      {/* Navbar */}
      <Navbar />

      {/* Content Container */}
      <div className="w-full px-4 sm:px-6 py-12 overflow-y-auto h-[800px]">
        <div className="bg-[#fdf5e6] border border-[#d2b48c] shadow-[0_4px_20px_rgba(0,0,0,0.2)] rounded-xl p-6 sm:p-8 font-serif text-[#5c3e2a] leading-relaxed tracking-wide max-w-8xl mx-auto text-base sm:text-lg space-y-6">
          <p>
            Dyslexia falls under the umbrella of <strong>“specific learning disorder.”</strong> That disorder has three main subtypes: <strong>Reading (dyslexia)</strong>, <strong>Writing (dysgraphia)</strong>, and <strong>Math (dyscalculia)</strong>.
          </p>

          <p>As a child gets older, dyslexia can often look like:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Difficulty spelling simple words.</li>
            <li>Trouble learning the names of letters.</li>
            <li>Problems telling apart letters with similar shapes, such as “d” and “b” or “p” and “q.”</li>
            <li>Trouble rhyming.</li>
            <li>Reluctance to read aloud in class.</li>
            <li>Trouble sounding out new words.</li>
            <li>Trouble associating sounds with letters or parts of words.</li>
            <li>Trouble learning how sounds go together.</li>
            <li>Mixing up the position of sounds in a word.</li>
          </ul>

          <p>
            Having one of the above doesn’t mean a person has dyslexia, but if they’re having trouble learning the basic skills for reading, then screening and testing is a good way to see if they need specialized help.
          </p>

          <p>
            Dyslexia affects an estimated <strong>10–20%</strong> of the global population. In India alone, over <strong>200 million</strong> individuals, including <strong>35 million students</strong>, live with this learning disability. However, a significant number, around <strong>1 in 20</strong>, remain unidentified.
          </p>

          <p>
            <strong>Standardized assessments:</strong> Formal assessments like the Comprehensive Test of Phonological Processing (CTOPP) or the Woodcock-Johnson Tests of Achievement can be used to evaluate specific skills related to dyslexia, such as phonological awareness and rapid naming.
          </p>

          {/* Myths vs Facts Section */}
          <div className="mt-10 w-full flex flex-col items-center">
            <h2 className="text-blue-800 text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4">
              MYTHS VS FACTS
            </h2>
            <div className="w-1/2 rounded-xl shadow-md p-6 sm:p-8  space-y-6">
              <p className="text-gray-900 text-base sm:text-lg md:text-xl font-semibold leading-relaxed">
                ❌ <span className="text-red-600 font-bold">Myth:</span> Dyslexia means low intelligence
                <br />✅ <span className="text-green-600 font-bold">Fact:</span> Many dyslexic individuals have average or above-average intelligence.
              </p>
              <p className="text-gray-900 text-base sm:text-lg md:text-xl font-semibold leading-relaxed">
                ❌ <span className="text-red-600 font-bold">Myth:</span> Children just need to try harder
                <br />✅ <span className="text-green-600 font-bold">Fact:</span> Dyslexia is neurological, not laziness.
              </p>
              <p className="text-gray-900 text-base sm:text-lg md:text-xl font-semibold leading-relaxed">
                ❌ <span className="text-red-600 font-bold">Myth:</span> Dyslexia can’t be managed
                <br />✅ <span className="text-green-600 font-bold">Fact:</span> With support and tools, people with dyslexia excel in school and beyond.
              </p>
            </div>
          </div>

          {/* Learn More Button */}
        </div>
      </div>
    </div>
  );
}
