// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Game simulation data for multiple games
let gamesData = [
  {
    id: 1,
    homeTeam: {
      city: "Los Angeles",
      name: "Lakers",
      abbreviation: "LAL",
      wins: 51,
      losses: 31,
      score: 52,
      stats: {
        fgPercentage: "36.2%",
        threePointMade: 4,
        threePointAttempts: 28,
        rebounds: 35
      }
    },
    awayTeam: {
      city: "Boston",
      name: "Celtics",
      abbreviation: "BOS",
      wins: 56,
      losses: 26,
      score: 69,
      stats: {
        fgPercentage: "44.8%",
        threePointMade: 14,
        threePointAttempts: 34,
        rebounds: 32
      }
    },
    period: 3,
    timeRemaining: "6:42",
    gameStatus: "live" // can be 'scheduled', 'live', 'halftime', 'final'
  },
  {
    id: 2,
    homeTeam: {
      city: "Golden State",
      name: "Warriors",
      abbreviation: "GSW",
      wins: 49,
      losses: 33,
      score: 84,
      stats: {
        fgPercentage: "47.5%",
        threePointMade: 12,
        threePointAttempts: 31,
        rebounds: 40
      }
    },
    awayTeam: {
      city: "Brooklyn",
      name: "Nets",
      abbreviation: "BKN",
      wins: 42,
      losses: 40,
      score: 76,
      stats: {
        fgPercentage: "41.3%",
        threePointMade: 8,
        threePointAttempts: 27,
        rebounds: 36
      }
    },
    period: 4,
    timeRemaining: "9:18",
    gameStatus: "live"
  },
  {
    id: 3,
    homeTeam: {
      city: "Miami",
      name: "Heat",
      abbreviation: "MIA",
      wins: 48,
      losses: 34,
      score: 63,
      stats: {
        fgPercentage: "39.7%",
        threePointMade: 7,
        threePointAttempts: 25,
        rebounds: 31
      }
    },
    awayTeam: {
      city: "Milwaukee",
      name: "Bucks",
      abbreviation: "MIL",
      wins: 50,
      losses: 32,
      score: 67,
      stats: {
        fgPercentage: "42.1%",
        threePointMade: 9,
        threePointAttempts: 29,
        rebounds: 33
      }
    },
    period: 2,
    timeRemaining: "2:54",
    gameStatus: "live"
  }
];

// Function to randomly update the scores for all games
function simulateGameProgress() {
  gamesData.forEach(game => {
    if (game.gameStatus !== 'live') return;

    const scoringTeamKey = Math.random() > 0.5 ? 'homeTeam' : 'awayTeam';
    const team = game[scoringTeamKey];
    const points = Math.floor(Math.random() * 4); // 0–3 points

    if (!team.stats.totalAttempts) team.stats.totalAttempts = 0;
    if (!team.stats.totalMade) team.stats.totalMade = 0;

    // Update scores and stats
    if (points > 0) {
      team.score += points;
      team.stats.totalAttempts += 1;
      team.stats.totalMade += 1;

      if (points === 3) {
        team.stats.threePointMade += 1;
        team.stats.threePointAttempts += 1;
      } else {
        team.stats.threePointAttempts += Math.random() > 0.7 ? 1 : 0;
      }
    } else {
      team.stats.totalAttempts += 1;
      if (Math.random() > 0.5) {
        team.stats.threePointAttempts += 1; // missed 3PT
      }
    }

    // Update FG%
    team.stats.fgPercentage = ((team.stats.totalMade / team.stats.totalAttempts) * 100).toFixed(1) + "%";

    // Update REB
    const rebTeam = Math.random() > 0.5 ? 'homeTeam' : 'awayTeam';
    game[rebTeam].stats.rebounds += Math.random() > 0.5 ? 1 : 0;

    // Time parsing and decrement
    let [min, sec] = game.timeRemaining.split(':').map(s => parseInt(s, 10));
    if (isNaN(min) || isNaN(sec)) {
      min = 12;
      sec = 0;
    }

    let newSec = sec - Math.floor(Math.random() * 10 + 3);
    let newMin = min;

    if (newSec < 0) {
      newMin -= 1;
      newSec += 60;
    }

    if (newMin < 0) {
      game.period += 1;
      if (game.period > 4) {
        game.gameStatus = "final";
        game.timeRemaining = "0:00";
      } else {
        game.timeRemaining = "12:00";
      }
    } else {
      game.timeRemaining = `${newMin}:${String(newSec).padStart(2, '0')}`;
    }
  });
}



// Simulate game progress every 3 seconds
setInterval(simulateGameProgress, 3000);

// API endpoint to get all games data
app.get('/api/games', (req, res) => {
  res.json(gamesData);
});


// API endpoint to get a specific game by ID
app.get('/api/game/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const game = gamesData.find(game => game.id === id);
  
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }
  
  res.json(game);
});

// Keep the original endpoint for backwards compatibility
app.get('/api/game', (req, res) => {
  res.json(gamesData[0]);
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});