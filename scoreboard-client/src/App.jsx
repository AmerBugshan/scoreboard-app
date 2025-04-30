import { useState, useEffect } from 'react';
import './App.css';
import GameCard from './components/GameCard';

function App() {
  const [gamesData, setGamesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For demo/development: If we can't connect to the real API, use mock data
    const mockGamesData = [
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
        gameStatus: "live"
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

    const fetchGamesData = async () => {
      try {
        // Try to fetch from server
        const response = await fetch('http://localhost:4000/api/games');

        
        if (!response.ok) {
          throw new Error('Failed to fetch games data');
        }
        
        const data = await response.json();
        setGamesData(data);
        setLoading(false);
      } catch (err) {
        console.error("API fetch failed:", err);
        
        // Fall back to mock data if the API request fails
        console.log("Using mock data instead");
        setGamesData(mockGamesData);
        setLoading(false);
      }
    };

    fetchGamesData();

    // Set up polling every 3 seconds
    const interval = setInterval(fetchGamesData, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading">Loading games data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app">
      <header className="app-header">
        <h1>NBA Live Scoreboard</h1>
      </header>
      <main className="games-container">
        {gamesData && gamesData.length > 0 ? (
          gamesData.map((game) => (
            <GameCard key={game.id} game={game} />
          ))
        ) : (
          <div className="no-games">No games available</div>
        )}
      </main>
    </div>
  );
}

export default App;