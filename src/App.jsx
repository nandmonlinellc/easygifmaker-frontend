import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './components/Layout'
import './App.css'

// A simple loader component to show while pages are loading
const Loader = () => <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;

// Lazy load all pages and tools
const HomePage = lazy(() => import('./pages/HomePage'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Help = lazy(() => import('./pages/Help'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/Terms'))
const Blog = lazy(() => import('./pages/Blog'))
const Api = lazy(() => import('./pages/Api'))
const HowToMakeGifsFromVideos = lazy(() => import('./pages/blog/HowToMakeGifsFromVideos'))
const Top5GifOptimizationTips = lazy(() => import('./pages/blog/Top5GifOptimizationTips'))
const AddTextToGifsGuide = lazy(() => import('./pages/blog/AddTextToGifsGuide'))
const UltimateGuideToViralGifs = lazy(() => import('./pages/blog/UltimateGuideToViralGifs'))
const ComprehensiveGifMakingGuide = lazy(() => import('./pages/blog/ComprehensiveGifMakingGuide'))
const CreativeGifDesignTutorial = lazy(() => import('./pages/blog/CreativeGifDesignTutorial'))
const GifAccessibilityGuide = lazy(() => import('./pages/blog/GifAccessibilityGuide'))
const GifForBusinessMarketing = lazy(() => import('./pages/blog/GifForBusinessMarketing'))
const GifOptimizationTechniques = lazy(() => import('./pages/blog/GifOptimizationTechniques'))
const SocialMediaGifStrategy = lazy(() => import('./pages/blog/SocialMediaGifStrategy'))
const MasterTheArtofAddingTextToGIFs = lazy(() => import('./pages/blog/MasterTheArtofAddingTextToGIFs'))
const ProfessionalGIFCroppingandCompositionGuide = lazy(() => import('./pages/blog/ProfessionalGIFCroppingandCompositionGuide'))
const CompleteGuideToResizeGif = lazy(() => import('./pages/blog/CompleteGuideToResizeGif'))
const GifMakerTool = lazy(() => import('./tools/GifMakerTool'))
const VideoToGifTool = lazy(() => import('./tools/VideoToGifTool'))
const ResizeTool = lazy(() => import('./tools/ResizeTool'))
const CropTool = lazy(() => import('./tools/CropTool'))
const OptimizeTool = lazy(() => import('./tools/OptimizeTool'))
const ReverseTool = lazy(() => import('./tools/ReverseTool'))
const AddTextTool = lazy(() => import('./tools/AddTextTool'))

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="gif-maker" element={<GifMakerTool />} />
              <Route path="video-to-gif" element={<VideoToGifTool />} />
              <Route path="resize" element={<ResizeTool />} />
              <Route path="crop" element={<CropTool />} />
              <Route path="optimize" element={<OptimizeTool />} />
                <Route path="reverse" element={<ReverseTool />} />
              <Route path="add-text" element={<AddTextTool />} />
              <Route path="blog" element={<Blog />} />
              <Route path="api" element={<Api />} />
              <Route path="blog/how-to-make-gifs-from-videos" element={<HowToMakeGifsFromVideos />} />
              <Route path="blog/top-5-gif-optimization-tips" element={<Top5GifOptimizationTips />} />
              <Route path="blog/add-text-to-gifs-guide" element={<AddTextToGifsGuide />} />
              <Route path="blog/ultimate-guide-to-viral-gifs" element={<UltimateGuideToViralGifs />} />
              <Route path="blog/comprehensive-gif-making-guide" element={<ComprehensiveGifMakingGuide />} />
              <Route path="blog/creative-gif-design-tutorial" element={<CreativeGifDesignTutorial />} />
              <Route path="blog/gif-accessibility-guide" element={<GifAccessibilityGuide />} />
              <Route path="blog/gif-for-business-marketing" element={<GifForBusinessMarketing />} />
              <Route path="blog/gif-optimization-techniques" element={<GifOptimizationTechniques />} />
              <Route path="blog/social-media-gif-strategy" element={<SocialMediaGifStrategy />} />
              <Route path="blog/master-the-art-of-adding-text-to-gifs" element={<MasterTheArtofAddingTextToGIFs />} />
              <Route path="blog/professional-gif-cropping-and-composition-guide" element={<ProfessionalGIFCroppingandCompositionGuide />} />
              <Route path="blog/complete-guide-to-resize-gif" element={<CompleteGuideToResizeGif />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="cookie-policy" element={<CookiePolicy />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="help" element={<Help />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  )
}

export default App
