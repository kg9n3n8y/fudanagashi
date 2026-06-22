import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { SettingsContext } from './contexts/SettingsContext';
import { UpdateBanner } from './components/UpdateBanner';
import { useSettings } from './hooks/useSettings';
import { HomePage } from './pages/HomePage';
import { PracticePage } from './pages/PracticePage';
import { ResultPage } from './pages/ResultPage';

function AppRoutes() {
  const location = useLocation();
  const practiceActive = location.pathname === '/practice';

  return (
    <>
      <UpdateBanner practiceActive={practiceActive} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  const { settings, updateSettings } = useSettings();

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      <BrowserRouter basename="/fudanagashi">
        <AppRoutes />
      </BrowserRouter>
    </SettingsContext.Provider>
  );
}