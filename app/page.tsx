'use client'
import { useEffect, useRef, useState } from "react";
import TriangleCanvas from "./components/canvasComponent";
import ParallaxImage from "./components/logo";
import Navbar from "./components/Navbar";

export default function Home() {
  const [canvasOffset, setCanvasOffset] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [showNavbar, setShowNavbar] = useState(false);
  const [isBackgroundDark, setIsBackgroundDark] = useState(false);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = sectionsRef.current?.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(sections || []).indexOf(entry.target as HTMLElement);
            setCanvasOffset(index * -100);
            setActiveSection(index);
            setShowNavbar(index === 1);
            setIsBackgroundDark(index === 1);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections?.forEach((section) => observer.observe(section));

    return () => {
      sections?.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <main className={`relative min-h-screen text-primary overflow-hidden transition-colors duration-1000 ${isBackgroundDark ? 'bg-black' : 'pattern-grid-lg'
      }`}>
      {/* Background noise */}
      <div className={`absolute w-full h-full transition-opacity duration-300 ${isBackgroundDark ? 'opacity-0' : 'opacity-100'
        }`}>
        <div
          className="h-full w-full z-10 absolute bg-[url('/background/noise.png')] bg-repeat opacity-5"
          style={{
            backgroundSize: "auto",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      {/* Triangle canvas */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${isBackgroundDark ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        style={{
          transform: `translateY(${canvasOffset}vh)`,
        }}
      >
        <div className="blur-[80px] z-0">
          <TriangleCanvas />
        </div>
      </div>

      {/* Navbar */}
      <div className={`fixed top-0 left-0 w-full z-30 transition-opacity duration-1000 ${showNavbar ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
        <Navbar />
      </div>

      {/* Content */}
      <div
        className="snap-mandatory snap-y overflow-y-scroll h-screen z-20 relative"
        ref={sectionsRef}
      >
        <section className="snap-center h-screen flex flex-col items-center justify-center">
          <ParallaxImage src={'/logos/big.png'} alt="" />
        </section>

        <section className={`flex flex-col items-center justify-start min-h-screen gap-3 ${activeSection === 1 ? '' : 'snap-center'
          }`}>
          {/* Content for the second section */}
          <div className="h-screen flex items-center justify-center">
            <h2 className="text-4xl font-bold text-text">Welcome to Section 2</h2>
          </div>
          {/* Add more content here as needed */}
        </section>
      </div>
    </main>
  );
}