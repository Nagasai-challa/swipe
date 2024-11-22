import './App.css';
import UploadSection from './components/UploadSection';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadSection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
