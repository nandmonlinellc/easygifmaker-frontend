import React from 'react';
import { Helmet } from 'react-helmet-async';
import Meta from '@/components/Meta.jsx';
import { Link } from 'react-router-dom';
import DisplayAd from '@/components/ads/DisplayAd.jsx';
import InArticleAd from '@/components/ads/InArticleAd.jsx';
import AdsenseAd from '@/components/AdsenseAd.jsx';

export default function AddTextToGifsGuide() {
  // Article structured data
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Add Text to GIFs Guide: Create Memes and Captions Online",
    "description": "Learn how to add multiple text layers, custom fonts, and animations to GIFs using EasyGIFMaker. Wrap text neatly with max width and line height for pro captions.",
    "author": {
      "@type": "Organization",
      "name": "EasyGIFMaker Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EasyGIFMaker",
      "url": "https://easygifmaker.com"
    },
    "datePublished": "2025-07-15",
    "dateModified": "2025-08-09",
    "url": "https://easygifmaker.com/blog/add-text-to-gifs-guide",
    "image": [
      "https://easygifmaker.com/blog/add-text-to-gifs-guide-2.webp"
    ],
    "keywords": "Add text to GIF, multiple text layers GIF, custom fonts GIF, GIF captions, GIF memes, GIF watermark, animated text"
  };

  // HowTo structured data
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Add Text Layers to GIFs",
    "description": "Learn how to add multiple text layers, custom fonts, and simple animations to GIFs using EasyGIFMaker.",
    "tool": ["EasyGIFMaker Add Text to GIF Tool"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload GIF",
        "text": "Upload a GIF from your device or paste a direct GIF URL. The tool auto-detects duration and frames."
      },
      {
        "@type": "HowToStep",
        "name": "Add first text layer",
        "text": "Enter your text and adjust font, size, color, stroke, alignment, and offsets. Click ‘Add Layer’."
      },
      {
        "@type": "HowToStep",
        "name": "Set timing and animation",
        "text": "Use the timing slider to pick when the layer appears. Choose an animation like fade or slide up."
      },
      {
        "@type": "HowToStep",
        "name": "Fine-tune layout",
        "text": "Adjust Max Text Width and Line Height. Enable Auto-Fit to keep multi-line captions within frame."
      },
      {
        "@type": "HowToStep",
        "name": "Add more layers",
        "text": "Repeat for additional captions, watermarks, or callouts. Select a layer chip to edit or delete it."
      },
      {
        "@type": "HowToStep",
        "name": "Generate and Download",
        "text": "Click ‘Add Text to GIF’ to render all layers. Download the final GIF."
      }
    ]
  };

  return (
    <>
      <Meta
        title="Add Text to GIFs Guide: Layers, Custom Fonts, and Captions"
        description="Learn multi-layer text, custom fonts, animations, and pro layout controls (max width, line height, auto-fit) to create perfect GIF captions and watermarks."
        url="/blog/add-text-to-gifs-guide"
        image="https://easygifmaker.com/blog/add-text-to-gifs-guide-2.webp"
        imageAlt="Add Text to GIFs Guide"
      />
      <Helmet>
        <meta property="og:type" content="article" />
        {/* Structured Data - Article */}
        <script type="application/ld+json">
          {JSON.stringify(articleStructuredData)}
        </script>
        
        {/* Structured Data - HowTo */}
        <script type="application/ld+json">
          {JSON.stringify(howToStructuredData)}
        </script>
        {/* Structured Data - Breadcrumbs */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {"@type":"ListItem","position":1,"name":"Home","item":"https://easygifmaker.com/"},
              {"@type":"ListItem","position":2,"name":"Blog","item":"https://easygifmaker.com/blog"},
              {"@type":"ListItem","position":3,"name":"Add Text to GIFs Guide","item":"https://easygifmaker.com/blog/add-text-to-gifs-guide"}
            ]
          })}
        </script>
      </Helmet>
  <div className="container mx-auto px-4 py-12 max-w-4xl">
        <nav className="mb-6 text-sm text-blue-700">
          <Link to="/blog" className="hover:underline">← Back to Blog</Link>
        </nav>
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Add Text to GIFs: Layers, Custom Fonts, and Pro Captions</h1>
        <p className="text-gray-700 mb-6">Updated on August 9, 2025 by EasyGIFMaker Team</p>
        <picture>
          <source srcSet="/blog/add-text-to-gifs-guide-2.webp" type="image/webp" />
          <img src="/blog/add-text-to-gifs-guide.svg" alt="Adding Text to GIFs Guide" className="rounded-xl border border-blue-100 shadow mb-8 w-full" width="1200" height="675" />
        </picture>
        {/* Table of Contents */}
        <aside className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-8">
          <h2 className="text-xl font-bold text-blue-700 mb-2">On this page</h2>
          <ul className="list-disc pl-6 text-blue-900 text-sm grid md:grid-cols-2 gap-x-6">
            <li><a href="#upload" className="underline">Step 1: Upload your GIF</a></li>
            <li><a href="#first-layer" className="underline">Step 2: First text layer</a></li>
            <li><a href="#layers" className="underline">Step 3: Manage layers</a></li>
            <li><a href="#timing" className="underline">Step 4: Timing & animation</a></li>
            <li><a href="#layout" className="underline">Step 5: Layout controls</a></li>
            <li><a href="#fonts" className="underline">Step 6: Custom fonts</a></li>
            <li><a href="#generate" className="underline">Step 7: Generate & download</a></li>
            <li><a href="#best-practices" className="underline">Best practices</a></li>
            <li><a href="#ideas" className="underline">Creative ideas</a></li>
          </ul>
        </aside>
        <article className="prose prose-blue max-w-none mb-8">
          <p>
            Text overlays can turn a simple GIF into a standout meme, tutorial, or branded asset. With EasyGIFMaker’s layered text editor, you can add multiple captions and watermarks with precise timing, simple animations, and clean multi-line wrapping for professional results.
          </p>

          <div className="my-8">
            <AdsenseAd
              adSlot="8336674411"
              adFormat="fluid"
              adLayout="in-article"
              style={{ textAlign: 'center' }}
            />
          </div>

          <h2 id="upload" className="mt-8"><b>Step 1: Upload Your GIF</b></h2>
          <p>
            Head to the <Link to="/add-text" className="text-blue-600 underline font-semibold">Add Text to GIF Tool</Link>. Upload a GIF or paste a direct URL. We’ll auto-detect duration and frames for accurate timing.
          </p>
          <h2 id="first-layer" className="mt-8"><b>Step 2: Add Your First Text Layer</b></h2>
          <p>
            Type your caption, choose the font and size, set color and stroke, then pick alignment (left/center/right) and vertical placement (top/middle/bottom). Use offsets for fine positioning. Click <b>Add Layer</b> to save it.
          </p>
          <h2 id="layers" className="mt-8"><b>Step 3: Select and Edit Layers</b></h2>
          <p>
            Each layer appears as a chip under the preview. Click a chip to edit or delete that layer. You can stack multiple layers for headings, sublines, and watermarks.
          </p>
          <figure>
            <img src="/blog/layer-chips.svg" alt="Text layer chips showing selected and inactive layers with an Add Layer button" width="1200" height="360" />
            <figcaption className="text-sm text-slate-600">Select a layer chip to edit its text, style, timing, and animation.</figcaption>
          </figure>
          <h2 id="timing" className="mt-8"><b>Step 4: Timing and Animation</b></h2>
          <p>
            Use the timing slider to choose when a layer appears and disappears. Add subtle polish with the <b>fade</b> or <b>slide up</b> animation options (or pick <b>none</b> for static text).
          </p>
          <figure>
            <img src="/blog/timing-slider.svg" alt="Timing slider with draggable start and end handles and second markers" width="1200" height="360" />
            <figcaption className="text-sm text-slate-600">Drag the handles to set the layer’s start and end times in seconds.</figcaption>
          </figure>
          <h2 id="layout" className="mt-8"><b>Step 5: Nail the Layout (Wrap & Fit)</b></h2>
          <ul>
            <li><b>Max Text Width:</b> Controls wrapping width so long captions don’t stretch edge-to-edge.</li>
            <li><b>Line Height:</b> Adjusts the spacing between lines for readability.</li>
            <li><b>Auto-Fit:</b> Automatically reduces font size slightly if a long caption would overflow the frame height.</li>
          </ul>
          {/* Mid Article Ad */}
          <div className="my-6 flex justify-center">
            <InArticleAd 
              slot="8336674411"
              className="max-w-2xl w-full"
            />
          </div>
          <h2 id="fonts" className="mt-8"><b>Step 6: Optional — Custom Fonts</b></h2>
          <p>
            Upload a <b>.ttf</b> or <b>.otf</b> to apply a custom font to the selected layer. If a font can’t be loaded, the tool safely falls back to a readable font.
          </p>
          <figure>
            <img src="/blog/font-upload.svg" alt="Custom font upload field showing a Choose File button with .ttf and .otf badges" width="1200" height="360" />
            <figcaption className="text-sm text-slate-600">Upload a .ttf or .otf to use a custom font on the selected layer.</figcaption>
          </figure>
          <h2 id="generate" className="mt-8"><b>Step 7: Generate and Download</b></h2>
          <p>
            Preview your changes in real time. When you’re happy, click <b>Add Text to GIF</b>. We’ll render all layers and give you a download link.
          </p>
          <h2 id="best-practices" className="mt-8"><b>Best Practices for Readable Captions</b></h2>
          <ul>
            <li><b>Contrast & Stroke:</b> Use high-contrast colors and a subtle stroke (outline) for clarity.</li>
            <li><b>Short Lines:</b> Break long captions into multiple lines; aim for 4–8 words per line.</li>
            <li><b>Smart Placement:</b> Center captions and nudge with offsets to avoid busy.</li>
            <li><b>Keep It Simple:</b> Use gentle animations; don’t overwhelm the motion in the GIF itself.</li>
          </ul>
          <h2 id="ideas" className="mt-8"><b>Creative Ideas</b></h2>
          <ul>
            <li><b>Memes:</b> Pair bold Impact-like fonts with white text + black stroke.</li>
            <li><b>Branding:</b> Add a small bottom-right watermark layer using your brand font.</li>
            <li><b>Tutorials:</b> Use stacked layers: title (top), step text (middle), and tip (bottom).</li>
          </ul>
          <p>
            Ready to try it? <Link to="/add-text" className="text-blue-600 underline font-semibold">Open the Add Text to GIF tool</Link> and start layering your captions.
          </p>
        </article>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          {/* Bottom Article Ad */}
          <div className="my-6 flex justify-center">
            <DisplayAd 
              slot="1125232950"
              className="max-w-2xl w-full"
            />
          </div>
          <h3 className="text-xl font-bold text-blue-700 mb-2">Related Posts</h3>
          <ul className="list-disc pl-6 text-blue-900">
            <li><Link to="/blog/how-to-make-gifs-from-videos" className="text-blue-600 underline">How to Make GIFs from Videos Instantly</Link></li>
            <li><Link to="/blog/top-5-gif-optimization-tips" className="text-blue-600 underline">Top 5 Tips for Optimizing GIFs for Social Media</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
}