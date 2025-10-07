import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout.jsx'
import HomePage from '@/pages/HomePage.jsx'
import About from '@/pages/About.jsx'
import Help from '@/pages/Help.jsx'
import FAQ from '@/pages/FAQ.jsx'
import ContactPage from '@/pages/Contact.jsx'
import PrivacyPolicy from '@/pages/PrivacyPolicy.jsx'
import Terms from '@/pages/Terms.jsx'
import CookiePolicy from '@/pages/CookiePolicy.jsx'
import ApiPage from '@/pages/Api.jsx'
import BlogPage from '@/pages/Blog.jsx'
import VideoToGifTool from '@/tools/VideoToGifTool.jsx'
import GifMakerTool from '@/tools/GifMakerTool.jsx'
import ResizeTool from '@/tools/ResizeTool.jsx'
import CropTool from '@/tools/CropTool.jsx'
import OptimizeTool from '@/tools/OptimizeTool.jsx'
import AddTextTool from '@/tools/AddTextTool.jsx'
import ReverseTool from '@/tools/ReverseTool.jsx'
import PromptToGifTool from '@/tools/PromptToGifTool.jsx'
import AddTextToGifsGuide from '@/pages/blog/AddTextToGifsGuide.jsx'
import CompleteGuideToResizeGif from '@/pages/blog/CompleteGuideToResizeGif.jsx'
import ComprehensiveGifMakingGuide from '@/pages/blog/ComprehensiveGifMakingGuide.jsx'
import CreativeGifDesignTutorial from '@/pages/blog/CreativeGifDesignTutorial.jsx'
import GifAccessibilityGuide from '@/pages/blog/GifAccessibilityGuide.jsx'
import GifForBusinessMarketing from '@/pages/blog/GifForBusinessMarketing.jsx'
import GifOptimizationTechniques from '@/pages/blog/GifOptimizationTechniques.jsx'
import HowToMakeGifsFromVideos from '@/pages/blog/HowToMakeGifsFromVideos.jsx'
import MasterTheArtOfAddingTextToGIFs from '@/pages/blog/MasterTheArtofAddingTextToGIFs.jsx'
import ProfessionalGifCroppingAndCompositionGuide from '@/pages/blog/ProfessionalGIFCroppingandCompositionGuide.jsx'
import SocialMediaGifStrategy from '@/pages/blog/SocialMediaGifStrategy.jsx'
import Top5GifOptimizationTips from '@/pages/blog/Top5GifOptimizationTips.jsx'
import UltimateGuideToViralGifs from '@/pages/blog/UltimateGuideToViralGifs.jsx'

function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you&#39;re looking for doesn&#39;t exist or has been moved.</p>
    </div>
  )
}

const blogRoutes = [
  { slug: 'add-text-to-gifs-guide', Component: AddTextToGifsGuide },
  { slug: 'complete-guide-to-resize-gif', Component: CompleteGuideToResizeGif },
  { slug: 'comprehensive-gif-making-guide', Component: ComprehensiveGifMakingGuide },
  { slug: 'creative-gif-design-tutorial', Component: CreativeGifDesignTutorial },
  { slug: 'gif-accessibility-guide', Component: GifAccessibilityGuide },
  { slug: 'gif-for-business-marketing', Component: GifForBusinessMarketing },
  { slug: 'gif-optimization-techniques', Component: GifOptimizationTechniques },
  { slug: 'how-to-make-gifs-from-videos', Component: HowToMakeGifsFromVideos },
  { slug: 'master-the-art-of-adding-text-to-gifs', Component: MasterTheArtOfAddingTextToGIFs },
  { slug: 'professional-gif-cropping-and-composition-guide', Component: ProfessionalGifCroppingAndCompositionGuide },
  { slug: 'social-media-gif-strategy', Component: SocialMediaGifStrategy },
  { slug: 'top-5-gif-optimization-tips', Component: Top5GifOptimizationTips },
  { slug: 'ultimate-guide-to-viral-gifs', Component: UltimateGuideToViralGifs },
]

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="help" element={<Help />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="cookie-policy" element={<CookiePolicy />} />
          <Route path="api" element={<ApiPage />} />
          <Route path="blog" element={<BlogPage />} />
          {blogRoutes.map(({ slug, Component }) => (
            <Route key={slug} path={`blog/${slug}`} element={<Component />} />
          ))}

          <Route path="video-to-gif" element={<VideoToGifTool />} />
          <Route path="gif-maker" element={<GifMakerTool />} />
          <Route path="resize" element={<ResizeTool />} />
          <Route path="crop" element={<CropTool />} />
          <Route path="optimize" element={<OptimizeTool />} />
          <Route path="add-text" element={<AddTextTool />} />
          <Route path="reverse" element={<ReverseTool />} />
          <Route path="prompt-gif" element={<PromptToGifTool />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
