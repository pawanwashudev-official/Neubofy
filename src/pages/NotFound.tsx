
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParallaxBackground from "../components/ParallaxBackground";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-200 via-blue-200 to-purple-200">
      <Navbar />
      <ParallaxBackground>
        <main className="flex-1 flex flex-col items-center justify-center py-24 relative z-10">
          <div className="relative flex flex-col items-center">
            <div className="animate-bounce-slow">
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="90" cy="90" r="80" fill="url(#paint0_radial_404)" />
                <text x="50%" y="54%" textAnchor="middle" className="font-extrabold text-[4rem] fill-white drop-shadow-lg" style={{dominantBaseline: 'middle'}}>
                  404
                </text>
                <defs>
                  <radialGradient id="paint0_radial_404" cx="0" cy="0" r="1" gradientTransform="translate(90 90) rotate(90) scale(80)">
                    <stop stopColor="#38bdf8" />
                    <stop offset="0.5" stopColor="#818cf8" />
                    <stop offset="1" stopColor="#a78bfa" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
            <h1 className="mt-8 text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-fade-in">
              Oops! Page Not Found
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-700 max-w-xl text-center animate-fade-in delay-200">
              We're grateful you explored this far!<br />
              <span className="font-semibold text-primary">The page you’re looking for doesn’t exist.</span>
            </p>
            <Link
              to="/"
              className="mt-10 px-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-white font-bold shadow-lg hover:scale-105 transition-transform animate-fade-in delay-300"
            >
              Go Home
            </Link>
          </div>
        </main>
      </ParallaxBackground>
      <Footer />
    </div>
  );
};

export default NotFound;
