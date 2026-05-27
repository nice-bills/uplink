/**
 * App — routing; cinematic hero only on home (no global grid canvas)
 */

import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AnimatedBackground } from './components/AnimatedBackground';
import { HomePage } from './pages/HomePage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CampaignDetailPage } from './pages/CampaignDetailPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CreateCampaignPage } from './pages/CreateCampaignPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { EmbedPage } from './pages/EmbedPage';
import '@rainbow-me/rainbowkit/styles.css';

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <ErrorBoundary>
      {!isHome && <AnimatedBackground />}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/campaign/:id" element={<CampaignDetailPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/create" element={<CreateCampaignPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/embed/:id" element={<EmbedPage />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
