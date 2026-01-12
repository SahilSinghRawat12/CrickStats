import React from "react";
import { battingPlayers, bowlingPlayers } from "../data/data";

const LiveScore = () => {
  return (
    <div className="w-full min-h-screen px-10 py-8 bg-gray-50">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">MI vs CSK</h1>
        <p className="text-gray-600 mt-1">
          Innings 1 of 2 · Batting: MI · Bowling: CSK · 20 Overs
        </p>
      </div>

      {/* Score Summary */}
      <div className="bg-white border rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold">MI 125/3 (14.2)</h2>
        <p className="text-gray-500 mt-1">Target: —</p>
      </div>

      {/* Batting + Bowling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* Batting */}
        <div className="bg-white border rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">Batting — MI</h3>

          <div className="border-b pb-2 flex text-sm font-medium text-gray-600">
            <span className="w-1/2">Batsman</span>
            <div className="flex w-1/2 text-center">
              <span className="w-full">R</span>
              <span className="w-full">B</span>
              <span className="w-full">4s</span>
              <span className="w-full">6s</span>
              <span className="w-full">SR</span>
            </div>
          </div>

          {battingPlayers.map((p, i) => (
            <div key={i} className="py-3 flex border-b last:border-none">
              <span className="w-1/2">{p.name}</span>
              <div className="flex w-1/2 text-center">
                <span className="w-full">{p.runs}</span>
                <span className="w-full">{p.balls}</span>
                <span className="w-full">{p.fours}</span>
                <span className="w-full">{p.sixes}</span>
                <span className="w-full">{p.sr}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bowling */}
        <div className="bg-white border rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">Bowling — CSK</h3>

          <div className="border-b pb-2 flex text-sm font-medium text-gray-600">
            <span className="w-1/2">Bowler</span>
            <div className="flex w-1/2 text-center">
              <span className="w-full">O</span>
              <span className="w-full">R</span>
              <span className="w-full">W</span>
              <span className="w-full">ER</span>
            </div>
          </div>

          {bowlingPlayers.map((b, i) => (
            <div key={i} className="py-3 flex border-b last:border-none">
              <span className="w-1/2">{b.name}</span>
              <div className="flex w-1/2 text-center">
                <span className="w-full">{b.overs}</span>
                <span className="w-full">{b.runs}</span>
                <span className="w-full">{b.wickets}</span>
                <span className="w-full">{b.er}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Run Buttons */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Add Runs</h3>
        <div className="flex gap-3 flex-wrap">
          {[0, 1, 2, 3, 4, 6].map((run) => (
            <button
              key={run}
              className="px-6 py-2 bg-white border rounded-md
                         hover:bg-black hover:text-white
                         transition-colors duration-200"
            >
              {run}
            </button>
          ))}
        </div>
      </div>

      {/* Extras */}
      <div className="flex gap-3 mb-8">
        {["Wide", "No-ball", "Byes", "Leg Byes", "Wicket"].map((extra) => (
          <button
            key={extra}
            className="px-4 py-2 border rounded bg-white
                       hover:bg-gray-900 hover:text-white
                       transition-colors duration-200"
          >
            {extra}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md
                     hover:bg-blue-700 transition-colors duration-200"
        >
          End Innings
        </button>

        <button
          className="px-6 py-2 bg-red-600 text-white rounded-md
                     hover:bg-red-700 transition-colors duration-200"
        >
          Finish Match
        </button>
      </div>

    </div>
  );
};

export default LiveScore;
