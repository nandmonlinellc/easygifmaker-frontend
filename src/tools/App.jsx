import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import About from './pages/About'
import Contact from './pages/Contact'
import CookiePolicy from './pages/CookiePolicy'
import FAQ from './pages/FAQ'
import Help from './pages/Help'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import GifMakerTool from './tools/GifMakerTool'
import VideoToGifTool from './tools/VideoToGifTool'
import ResizeTool from './tools/ResizeTool'
import CropTool from './tools/CropTool'
import OptimizeTool from './tools/OptimizeTool'
import AddTextTool from './tools/AddTextTool'
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="gif-maker" element={<GifMakerTool />} />
            <Route path="video-to-gif" element={<VideoToGifTool />} />
            <Route path="resize" element={<ResizeTool />} />
            <Route path="crop" element={<CropTool />} />
            <Route path="optimize" element={<OptimizeTool />} />
            <Route path="add-text" element={<AddTextTool />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cookie-policy" element={<CookiePolicy />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="help" element={<Help />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<Terms />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  )
}

export default App


