import { MdOutlineDashboard } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { PiMicrosoftTeamsLogoLight } from "react-icons/pi";
import { BiSolidCricketBall } from "react-icons/bi";




export const navItems = [
    {
        title : "Dashboard",
        icons : MdOutlineDashboard,
        href : "/dashboard"
    },
    
    {
        title : "Teams",
        icons : PiMicrosoftTeamsLogoLight ,
         href : "/teams"
    },

    {
        title : "Matches",
        icons : BiSolidCricketBall,
         href : "/matches"
    },

]

export const playersList = [
    {
        player : "Rohit Sharma",
        role : "Batsman"
    },

    {
        player : "Virat Kohli",
        role : "Batsman"
    },

    {
        player : "Hardik Pandya",
        role : "All Rounder"
    },

    {
        player : "Jasprit Bumrah",
        role : "Bowler"
    },
]

export const category = [
    {
        category : "Batsman"
    },
    {
        category : "Bowler"
    },
    {
        category : "Wicket Keeper"
    },
    {
        category : "All Rounder"
    }
]

export const teamsNames = [
    {
        teamName : "Delhi Warriors",
        totalPlayers : "11 PLayers"
    },
    {
        teamName : "Hyderabad Hybrid",
        totalPlayers : "11 PLayers"
    },
    {
        teamName : "Mumbai Master",
        totalPlayers : "11 PLayers"
    },
    {
        teamName : "Chennai Champions",
        totalPlayers : "11 PLayers"
    },
]


export const battingPlayers = [
  { name: "Rohit Sharma", runs: 72, balls: 45, fours: 8, sixes: 3, sr: 160.0 },
  { name: "Suryakumar Yadav", runs: 38, balls: 26, fours: 4, sixes: 2, sr: 146.1 },
  { name: "Ishan Kishan", runs: 15, balls: 12, fours: 2, sixes: 0, sr: 125.0 },
  { name: "Hardik Pandya", runs: 0, balls: 0, fours: 0, sixes: 0, sr: "-" },
  { name: "Tilak Varma", runs: 0, balls: 0, fours: 0, sixes: 0, sr: "-" },
  { name: "Tim David", runs: 0, balls: 0, fours: 0, sixes: 0, sr: "-" },
  { name: "Shams Mulani", runs: 0, balls: 0, fours: 0, sixes: 0, sr: "-" },
  { name: "Piyush Chawla", runs: 0, balls: 0, fours: 0, sixes: 0, sr: "-" },
  { name: "Jason Behrendorff", runs: 0, balls: 0, fours: 0, sixes: 0, sr: "-" },
  { name: "Jasprit Bumrah", runs: 0, balls: 0, fours: 0, sixes: 0, sr: "-" }
];


export const bowlingPlayers = [
  { name: "Deepak Chahar", overs: "4.0", runs: 28, wickets: 2, er: 7.0 },
  { name: "Ravindra Jadeja", overs: "4.0", runs: 24, wickets: 1, er: 6.0 },
  { name: "Maheesh Theekshana", overs: "4.0", runs: 32, wickets: 1, er: 8.0 },
  { name: "Matheesha Pathirana", overs: "4.0", runs: 30, wickets: 2, er: 7.5 },
  { name: "Moeen Ali", overs: "2.0", runs: 18, wickets: 0, er: 9.0 },
  { name: "Shivam Dube", overs: "2.0", runs: 20, wickets: 0, er: 10.0 }
];
