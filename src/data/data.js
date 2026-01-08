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