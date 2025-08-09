import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

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
      <Helmet>
        <title>Add Text to GIFs Guide: Layers, Custom Fonts, and Captions | EasyGIFMaker Blog</title>
        <meta name="description" content="Learn multi-layer text, custom fonts, animations, and pro layout controls (max width, line height, auto-fit) to create perfect GIF captions and watermarks." />
        <link rel="canonical" href="https://easygifmaker.com/blog/add-text-to-gifs-guide" />
        
        {/* Structured Data - Article */}
        <script type="application/ld+json">
          {JSON.stringify(articleStructuredData)}
        </script>
        
        {/* Structured Data - HowTo */}
        <script type="application/ld+json">
          {JSON.stringify(howToStructuredData)}
        </script>
      </Helmet>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <nav className="mb-6 text-sm text-blue-700">
          <Link to="/blog" className="hover:underline">← Back to Blog</Link>
        </nav>
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Add Text to GIFs: Layers, Custom Fonts, and Pro Captions</h1>
        <p className="text-gray-700 mb-6">Updated on August 9, 2025 by EasyGIFMaker Team</p>
        <picture>
          <source srcSet="/blog/add-text-to-gifs-guide-2.webp" type="image/webp" />
          <img src="/blog/add-text-to-gifs-guide.webp" alt="Adding Text to GIFs Guide" className="rounded-xl border border-blue-100 shadow mb-8 w-full" width="1200" height="675" />
        </picture>
        <article className="prose prose-blue max-w-none mb-8">
          <p>
            Text overlays can turn a simple GIF into a standout meme, tutorial, or branded asset. With EasyGIFMaker’s layered text editor, you can add multiple captions and watermarks with precise timing, simple animations, and clean multi-line wrapping for professional results.
          </p>
          <h2 className="mt-8"><b>Step 1: Upload Your GIF</b></h2>
          <p>
            Head to the <Link to="/add-text" className="text-blue-600 underline font-semibold">Add Text to GIF Tool</Link>. Upload a GIF or paste a direct URL. We’ll auto-detect duration and frames for accurate timing.
          </p>
          <h2 className="mt-8"><b>Step 2: Add Your First Text Layer</b></h2>
          <p>
            Type your caption, choose the font and size, set color and stroke, then pick alignment (left/center/right) and vertical placement (top/middle/bottom). Use offsets for fine positioning. Click <b>Add Layer</b> to save it.
          </p>
          <h2 className="mt-8"><b>Step 3: Select and Edit Layers</b></h2>
          <p>
            Each layer appears as a chip under the preview. Click a chip to edit or delete that layer. You can stack multiple layers for headings, sublines, and watermarks.
          </p>
          <figure>
            <img src="/blog/layer-chips.svg" alt="Text layer chips showing selected and inactive layers with an Add Layer button" width="1200" height="360" />
            <figcaption className="text-sm text-slate-600">Select a layer chip to edit its text, style, timing, and animation.</figcaption>
          </figure>
          <h2 className="mt-8"><b>Step 4: Timing and Animation</b></h2>
          <p>
            Use the timing slider to choose when a layer appears and disappears. Add subtle polish with the <b>fade</b> or <b>slide up</b> animation options (or pick <b>none</b> for static text).
          </p>
          <figure>
            <img src="/blog/timing-slider.svg" alt="Timing slider with draggable start and end handles and second markers" width="1200" height="360" />
            <figcaption className="text-sm text-slate-600">Drag the handles to set the layer’s start and end times in seconds.</figcaption>
          </figure>
          <h2 className="mt-8"><b>Step 5: Nail the Layout (Wrap & Fit)</b></h2>
          <ul>
            <li><b>Max Text Width:</b> Controls wrapping width so long captions don’t stretch edge-to-edge.</li>
            <li><b>Line Height:</b> Adjusts the spacing between lines for readability.</li>
            <li><b>Auto-Fit:</b> Automatically reduces font size slightly if a long caption would overflow the frame height.</li>
          </ul>
          <h2 className="mt-8"><b>Step 6: Optional — Custom Fonts</b></h2>
          <p>
            Upload a <b>.ttf</b> or <b>.otf</b> to apply a custom font to the selected layer. If a font can’t be loaded, the tool safely falls back to a readable font.
          </p>
          <figure>
            <img src="/blog/font-upload.svg" alt="Custom font upload field showing a Choose File button with .ttf and .otf badges" width="1200" height="360" />
            <figcaption className="text-sm text-slate-600">Upload a .ttf or .otf to use a custom font on the selected layer.</figcaption>
          </figure>
          <h2 className="mt-8"><b>Step 7: Generate and Download</b></h2>
          <p>
            Preview your changes in real time. When you’re happy, click <b>Add Text to GIF</b>. We’ll render all layers and give you a download link.
          </p>
          <h2 className="mt-8"><b>Best Practices for Readable Captions</b></h2>
          <ul>
            <li><b>Contrast & Stroke:</b> Use high-contrast colors and a subtle stroke (outline) for clarity.</li>
            <li><b>Short Lines:</b> Break long captions into multiple lines; aim for 4–8 words per line.</li>
            <li><b>Smart Placement:</b> Center captions and nudge with offsets to avoid busy areas.</li>
            <li><b>Keep It Simple:</b> Use gentle animations; don’t overwhelm the motion in the GIF itself.</li>
          </ul>
          <h2 className="mt-8"><b>Creative Ideas</b></h2>
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