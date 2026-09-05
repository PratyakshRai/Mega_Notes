import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import HomePage from '@/pages/HomePage';
import NotePage from '@/pages/NotePage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  // Initialize theme on mount
  useTheme();

  return (
    <BrowserRouter basename="/Mega_Notes">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:categorySlug/:topicSlug" element={<NotePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
