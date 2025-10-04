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
            Dyslexia is a specific learning disorder that primarily affects reading and language processing. 
            It does not reflect a child’s intelligence or motivation, but rather the way their brain processes written 
            and spoken language. Children and adults with dyslexia often struggle with matching letters to sounds, 
            blending sounds into words, and recognizing words quickly. 
          </p>

          <p>
            <strong>Example:</strong>  
            Imagine a child named Aarav who is bright and curious, loves building with blocks, and asks many 
            thoughtful questions. However, when it comes to reading, Aarav finds it difficult to recognize the 
            difference between letters like “b” and “d.” When he tries to read the word <em>“bat”</em>, 
            he might confuse it with <em>“dat”</em> or read it as <em>“tab.”</em>  
            Even though Aarav is intelligent, his reading skills do not match his thinking ability. This gap 
            often leads to frustration and self-doubt if not supported early on.  
          </p>

          <p>
            <strong>Biological Explanation:</strong>  
            Dyslexia has its roots in how the brain is wired. Research using brain imaging has shown that 
            people with dyslexia process language in different areas of the brain compared to typical readers. 
            Normally, reading involves three main regions of the left side of the brain:
          </p>

          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>
              <strong>Broca’s Area (frontal lobe):</strong> Involved in speech production and analyzing words.
            </li>
            <li>
              <strong>Parieto-Temporal Region:</strong> Helps in word analysis, breaking words into smaller sounds.
            </li>
            <li>
              <strong>Occipito-Temporal Region:</strong> Responsible for rapid word recognition and fluent reading.
            </li>
          </ul>

          <p>
            In people with dyslexia, the parieto-temporal and occipito-temporal regions are often underactive. 
            Instead, they may rely more on the frontal regions, which makes reading slower and more effortful. 
            This biological difference explains why children with dyslexia take longer to process words 
            and why traditional reading methods can feel so challenging for them.
          </p>

          <p>
            Scientists also believe genetics play a strong role, as dyslexia tends to run in families. 
            Differences in how brain cells (neurons) connect and communicate during reading and language tasks 
            further contribute to these challenges. Importantly, these differences are not a “defect” 
            but simply a variation in brain functioning. With the right strategies, 
            like phonics-based instruction and multisensory learning, individuals with dyslexia 
            can learn to read effectively and thrive academically.
          </p>

          {/* Myths vs Facts Section */}
          <div className="mt-10 w-full flex flex-col items-center">
            <p>
              Our suite of tools is designed to make dyslexia screening and support more 
              <strong> accessible, accurate, and child-friendly</strong>. From analyzing eye 
              movements and speech patterns, to studying handwriting and providing 
              interactive quizzes, each tool offers a unique way to uncover learning 
              differences. Paired with our reading companion, these solutions aim to 
              build <strong>confidence, clarity, and independence</strong> in every learner’s 
              journey.
            </p>
          </div>
 <div className="w-full flex justify-center mt-8">
            <Link
              to="/test"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
             Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
