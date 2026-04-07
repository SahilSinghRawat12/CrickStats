import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assests/resize.png"
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white">

      {/* 🔥 NAVBAR */}
      <nav className="flex justify-between items-center px-6 md:px-16 py-4 bg-black/40 backdrop-blur-md fixed w-full z-50">
        <h1 className="text-xl font-bold text-green-400">CrickScore</h1>

        <div className="flex gap-6 text-sm md:text-base">
          <button onClick={() => navigate("/matches")} className="hover:text-green-400">Matches</button>
          <button onClick={() => navigate("/teams")} className="hover:text-green-400">Teams</button>
          <button onClick={() => navigate("/login")} className="hover:text-green-400">Login</button>
        </div>
      </nav>

      {/* 🔥 HERO */}
      <section className="relative flex flex-col items-center justify-center h-screen text-center px-6">

        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593766827228-8737b4534aa6')] bg-cover bg-center"></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 max-w-3xl">

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Experience <span className="text-green-400">Cricket</span> Like Never Before
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Live scores, real-time stats, and complete match control in one place.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate("/matches")}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold shadow-lg hover:scale-105 transition"
            >
              Live Matches
            </button>

            <button
              onClick={() => navigate("/teams")}
              className="px-6 py-3 border border-white hover:bg-white hover:text-black rounded-lg transition"
            >
              Manage Teams
            </button>
          </div>

        </div>
      </section>

      

      {/* FEATURES */}
      <section className="py-16 px-6 md:px-20 bg-gray-950">

        <h2 className="text-3xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {[
            {
              title: "Team Management",
              desc: "Create teams, assign players, and manage squads easily."
            },
            {
              title: "Live Scoring",
              desc: "Ball-by-ball updates with real-time accuracy."
            },
            {
              title: "Advanced Stats",
              desc: "Detailed batting, bowling, and match analytics."
            }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-green-500 hover:scale-105 transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 text-green-400">
                {item.title}
              </h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}

        </div>

      </section>

      {/*CTA */}
      <section className="py-16 px-6 md:px-20 bg-gradient-to-r from-green-600 to-blue-800 text-center">

        <h2 className="text-3xl font-bold mb-6">
          Ready to Start Scoring?
        </h2>

        <button
          onClick={() => navigate("/matches")}
          className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:scale-105 transition"
        >
          Start Now
        </button>

      </section>

      {/* FOOTER */}
      <footer className="bg-black py-8 text-center text-gray-400">
        <p className="mb-2">© 2026 CrickScore - Sahil Singh Rawat</p>
        <div className="flex justify-center gap-6 text-sm">
          <span className="hover:text-white cursor-pointer">Privacy</span>
          <span className="hover:text-white cursor-pointer">Terms</span>
          <span className="hover:text-white cursor-pointer">Contact</span>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;