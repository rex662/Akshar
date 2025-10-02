import React from "react";
import Navbar from "../components/Navbar";
import AboutDyslexia from "./About";

const HOME = () => {
  return (
    <main className="min-h-screen flex flex-col w-full relative overflow-hidden bg-[#F3E8FF] text-gray-900">
      {/* Diagonal Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(15deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-15deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 20px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* All Content above background */}
      <div className="relative z-10">
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <section className="w-full flex flex-col items-center px-6 py-12">
          <div className="text-center mb-6">
            <h1 className=" focus-in-expand-normal   text-black-800 text-4xl sm:text-3xl md:text-4xl lg:text-6xl font-bold leading-snug">
              WELCOME TO AKSHAR MITR
            </h1>
            <h2 className="focus-in-expand-normal font-PlayfairDisplay text-red-600 text-xl sm:text-2xl md:text-2xl lg:text-2xl italic font-medium mt-4">
              "Dyslexia doesn’t define intelligence—it redefines learning. Explore resources,
              tools, and support to help every individual thrive in school, work, and life."
            </h2>
          </div>
        </section>

        {/* About Section */}
        <section id="about-us" className="px-6 py-8">
          <h1 className="floating-text  text-black-800 text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-center leading-snug max-w-4xl mx-auto">
            AKSHAR MITR
          </h1>
          <p className=" text-black-400 font-PlayfairDisplay text-base sm:text-lg md:text-xl font-medium text-center mt-6 italic mx-auto leading-relaxed">
            At Akshar Mitr, we believe that every child deserves the right support to learn,
            grow, and thrive—no matter their learning challenges. Our mission is to make early
            detection and personalized support for dyslexia accessible, simple, and empowering
            for children, parents, and educators. Dyslexia does not define a child’s
            intelligence; it simply changes the way they process information. With the right
            tools, we can bridge learning gaps and help children unlock their full potential.
          </p>

          {/* Tools Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {/* Card 1 */}
            <div className="floating-card bg-white rounded-2xl shadow-md shadow-blue-900 p-6 flex flex-col items-center text-center transition hover:scale-105 hover:shadow-lg">
              <img
                src="https://plus.unsplash.com/premium_photo-1670424200500-b8977f9e30be?w=1000&auto=format&fit=crop&q=60"
                alt="EyeSpeech Tool"
                className="w-24 h-24 mb-4"
              />
              <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                EyeSpeech Screening Tool
              </h3>
              <p className="text-gray-600 text-sm md:text-base mb-4">
                A unique combination of speech and vision-based screening that helps identify
                early signs of dyslexia.
              </p>
              <a
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                href="/test"
              >
                Playbook 1
              </a>
            </div>

            {/* Card 2 */}
            <div className="floating-card  bg-white rounded-2xl shadow-md shadow-blue-900 p-6 flex flex-col items-center text-center transition hover:scale-105 hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1643877323795-f2edf55cd33c?w=1000&auto=format&fit=crop&q=60"
                alt="Handwriting Tool"
                className="w-24 h-24 mb-4"
              />
              <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                Handwriting Detection Tool
              </h3>
              <p className="text-gray-600 text-sm md:text-base mb-4">
                This tool uses handwriting analysis to detect dyslexia-related challenges,
                providing valuable insights for parents and educators.
              </p>
              <a
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                href="/handwriting"
              >
                Playbook 2
              </a>
            </div>

            {/* Card 3 */}
            <div className="floating-card  bg-white rounded-2xl shadow-md shadow-blue-900 p-6 flex flex-col items-center text-center transition hover:scale-105 hover:shadow-lg">
              <img
                src="https://plus.unsplash.com/premium_photo-1679957333039-285fb913aa2b?q=80&w=963&auto=format&fit=crop"
                alt="Quiz Tool"
                className="w-24 h-24 mb-4"
              />
              <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                QuirkQuest
              </h3>
              <p className="text-gray-600 text-sm md:text-base mb-4">
                A structured and child-friendly quiz tool that highlights learning challenges
                and offers initial insights.
              </p>
              <a
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                href="/quiz"
              >
                Quirktest
              </a>
            </div>

            {/* Card 4 */}
            <div className="floating-card  bg-white rounded-2xl shadow-md shadow-blue-900 p-6 flex flex-col items-center text-center transition hover:scale-105 hover:shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1638443436690-db587cc66f12?w=1000&auto=format&fit=crop"
                alt="Reading Tool"
                className="w-24 h-24 mb-4"
              />
              <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                Enhancer (Reading Support Tool)
              </h3>
              <p className="text-gray-600 text-sm md:text-base mb-4">
                Our reading companion offers text-to-speech, line-by-line reading, and
                syllable splitting for confident learning.
              </p>
              <a
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                href="/sol"
              >
                Enhancer
              </a>
            </div>
          </div>
        </section>

        {/* What is Dyslexia */}
        <section className="w-full px-6 py-8 flex flex-col items-center justify-center">
          <h1 className="text-black-800 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center leading-snug max-w-4xl mx-auto">
            WHAT IS DYSLEXIA
          </h1>
          <p className="text-black-400 font-PlayfairDisplay text-base sm:text-lg md:text-xl font-medium text-center mt-6 italic mx-auto leading-relaxed">
            Dyslexia is a neurological learning difference that affects how individuals
            process written and spoken language, making reading and spelling more challenging
            despite normal intelligence.
          </p>
          <div className="w-full flex justify-center mt-8">
            <a
              href="/about"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-blue-800 py-6 text-white mt-8">
          <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs sm:text-sm text-center md:text-left">
              © 2025 Akshar Mitr. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap justify-center md:justify-end gap-4 text-xs sm:text-sm font-medium">
              <li>
                <a href="#" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default HOME;
