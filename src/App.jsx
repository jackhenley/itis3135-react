import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Itis3135Home from './pages/Itis3135Home';
import Contract from './pages/Contract';
import Introduction from './pages/Introduction';
import WebsiteEvaluations from './pages/WebsiteEvaluations';
import Survey from './pages/Survey';
import Gallery from './pages/Gallery';
import Inventory from './pages/Inventory';
import Highlight from './pages/Highlight';
import Instructions from './pages/Instructions';
import IntroForm from './pages/IntroForm';
import Hobby from './pages/Hobby';
import GamesIndex from './pages/GamesIndex';
import TypingGame from './pages/TypingGame';
import WallStreetGame from './pages/WallStreetGame';
import JackHenleyDesigns from './pages/JackHenleyDesigns';
import CrappyPage from './pages/CrappyPage';
import Slideshow from './pages/Slideshow';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/itis3135" element={<Itis3135Home />} />
        <Route path="/itis3135/contract" element={<Contract />} />
        <Route path="/itis3135/introduction" element={<Introduction />} />
        <Route path="/itis3135/website-evaluations" element={<WebsiteEvaluations />} />
        <Route path="/itis3135/survey" element={<Survey />} />
        <Route path="/itis3135/gallery" element={<Gallery />} />
        <Route path="/itis3135/inventory" element={<Inventory />} />
        <Route path="/itis3135/highlight" element={<Highlight />} />
        <Route path="/itis3135/instructions" element={<Instructions />} />
        <Route path="/itis3135/intro-form" element={<IntroForm />} />
        <Route path="/itis3135/hobby" element={<Hobby />} />
        <Route path="/itis3135/jackhenleydesigns" element={<JackHenleyDesigns />} />
        <Route path="/games" element={<GamesIndex />} />
        <Route path="/games/typing" element={<TypingGame />} />
        <Route path="/games/wallstreet" element={<WallStreetGame />} />
        <Route path="/stuff/crappy-page" element={<CrappyPage />} />
        <Route path="/itis3135/slideshow" element={<Slideshow />} />
      </Routes>
    </BrowserRouter>
  );
}
