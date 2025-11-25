import React, { useState } from "react";
import Navbar from "../components/Navbar";
import AboutDyslexia from "./About";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "EyeSpeech Screening Tool",
    description:
      "A unique combination of speech and vision-based screening that helps identify early signs of dyslexia.",
    img: "https://plus.unsplash.com/premium_photo-1670424200500-b8977f9e30be?w=1000&auto=format&fit=crop&q=60",
    link: "/test",
    button: "Playbook 1",
  },
  {
    title: "Handwriting Detection Tool",
    description:
      "This tool uses handwriting analysis to detect dyslexia-related challenges, providing valuable insights for parents and educators.",
    img: "https://images.unsplash.com/photo-1643877323795-f2edf55cd33c?w=1000&auto=format&fit=crop&q=60",
    link: "/handwriting",
    button: "Playbook 2",
  },
  {
    title: "QuirkQuest",
    description:
      "A structured and child-friendly quiz tool that highlights learning challenges and offers initial insights.",
    img: "https://plus.unsplash.com/premium_photo-1679957333039-285fb913aa2b?q=80&w=963&auto=format&fit=crop",
    link: "/quiz",
    button: "Quirk Quest",
  },
  {
    title: "Enhancer (Reading Support Tool)",
    description:
      "Our reading companion offers text-to-speech, line-by-line reading, and syllable splitting for confident learning.",
    img: "https://images.unsplash.com/photo-1638443436690-db587cc66f12?w=1000&auto=format&fit=crop",
    link: "/sol",
    button: "Enhancer",
  },
//   {
//   title: "Emotion Explorer (Game)",
//   description:
//     "Play an interactive game that detects emotions from facial expressions and helps you understand feelings better.",
//   img: "https://images.unsplash.com/photo-1533089860892-a7c3b5d5b83d?w=1000&auto=format&fit=crop",
//   link: "/emotion-game",
//   button: "Play Now",
// }

];

const HOME = () => {
  const [showConsentPopup, setShowConsentPopup] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const handleCardClick = (link) => {
    if (!consentGiven) {
      setShowConsentPopup(true);
      return;
    }
    window.location.href = link;
  };

  const handleConsentConfirm = () => {
    setConsentGiven(true);
    setShowConsentPopup(false);
  };

  const handleConsentCancel = () => {
    setShowConsentPopup(false);
  };

  return (
    <main className="min-h-screen flex flex-col w-full relative overflow-hidden bg-oklch(78.5% 0.115 274.713) text-gray-900">
      {/* Diagonal Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-[#F7F5F2]"
       //#f2e269
        // style={{
        //   backgroundImage: `
        //     repeating-linear-gradient(15deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 20px),
        //     repeating-linear-gradient(-15deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 20px)
        //   `,
        //   backgroundSize: "40px 40px",
        // }}
      />

      {/* All Content above background */}
      <div className="relative z-10">
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}

        {/* About Section */}
        <section id="about-us" className="px-6 py-8">
          <h1
            className=" text-[#B56B21] font-bold text-center uppercase 
text-[80px] sm:text-[80px] md:text-[100px] lg:text-[120px] 
leading-tight tracking-tight  [text-shadow:2px_2px_2px_black,0_0_10px_rgba(0,0,0,0.2)] "
          >
            AKSHAR MITRA
          </h1>
          <p className=" text-black-400 font-PlayfairDisplay text-base sm:text-lg md:text-xl font-medium text-center mt-3 bold mx-auto leading-snug font-bold">
            At Akshar Mitra, we believe that every child deserves the right
            support to learn, grow, and thrive—no matter their learning
            challenges. Our mission is to make early detection and personalized
            support for dyslexia accessible, simple, and empowering for
            children, parents, and educators. Dyslexia does not define a child’s
            intelligence; it simply changes the way they process information.
            With the right tools, we can bridge learning gaps and help children
            unlock their full potential.
          </p>
          </section>

          {/* Tools Cards as Horizontal Slider */}
<section className="px-6 py-10">
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-8 text-center text-black">
    Our Tools
  </h2>
  <div className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4">
    {cards.map((card, index) => (
      <div
        key={index}
        className="flex-shrink-0 w-64 sm:w-72 md:w-80 bg-[#fef9e2] rounded-2xl shadow-md shadow-blue-900 p-6 flex flex-col items-center text-center transition hover:scale-105 hover:shadow-lg snap-center"
      >
        <img
          src={card.img}
          alt={card.title}
          className="w-24 h-24 mb-4 object-cover"
        />
        <h3 className="text-lg md:text-xl font-bold text-black mb-2">
          {card.title}
        </h3>
        <p className="text-gray-600 text-sm md:text-base mb-6 flex-1">
          {card.description}
        </p>
        <Link
          to={card.link}
          className="bg-[#CC9966] hover:bg-amber-800 border border-white text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 w-full sm:w-auto text-center"
        >
          {card.button}
        </Link>
      </div>
    ))}2
  </div>
</section>


        {/* Consent Popup
        {showConsentPopup && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center">
              <h2 className="text-xl font-bold mb-3">Data Collection Consent</h2>
              <p className="text-gray-600 mb-4">
                We collect minimal data to improve learning support tools. Do you
                consent to share this information securely?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleConsentConfirm}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Yes, I Consent
                </button>
                <button
                  onClick={handleConsentCancel}
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-400"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* What is Dyslexia */}
        <section className="w-full px-6 py-8 flex flex-col items-center justify-center">
          <h1 className="text-black-800 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center leading-snug max-w-4xl mx-auto">
            WHAT IS DYSLEXIA
          </h1>
          <p className="text-black-400 font-PlayfairDisplay text-base sm:text-lg md:text-xl font-medium text-center mt-6 italic mx-auto leading-relaxed">
            Dyslexia is a neurological learning difference that affects how
            individuals process written and spoken language, making reading and
            spelling more challenging despite normal intelligence.
          </p>
          <div className="w-full flex justify-center mt-8">
            <a
              href="/about"
              className="bg-[#CC9966] hover:bg-amber-800 transition-colors duration-200 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#CC9966]  py-6 text-white mt-8">
          <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center  justify-center gap-4">
            <span className="text-xs sm:text-sm text-center md:text-center">
              © 2025 Akshar Mitr. All Rights Reserved.
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default HOME;
