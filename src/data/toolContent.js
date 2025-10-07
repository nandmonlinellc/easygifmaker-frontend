export const toolContent = {
  videoToGif: {
    introHeading: 'Where a video-to-GIF really shines',
    intro: 'Convert snappy product walkthroughs, event highlights, or quick reaction clips into lightweight GIFs that can autoplay everywhere without audio. Tight control over timing keeps the story moving while staying under shareable file-size limits.',
    useCases: [
      'Product teams showcase feature updates or animate release notes without embedding full videos.',
      'Creators turn stream highlights into looping social teasers sized for Discord, Slack, or community forums.',
      'Marketing teams repurpose webinar intros or hero clips into fast-loading blog companions.'
    ],
    tips: [
      'Aim for 6–12 seconds per GIF and trim aggressively; looped motion feels more polished than long clips.',
      'Match resolution to the final channel—480px wide for chat apps, 720px when you need detail.',
      'Brightness/contrast tweaks help footage recorded on phones stand out after compression.',
      'Export a WebP alongside the GIF when you need higher colour fidelity for modern browsers.'
    ],
    privacy: 'Uploaded videos are processed in a secure temporary workspace and routinely purged by our cleanup jobs. Skip sensitive recordings and prefer trimmed clips so less data ever leaves your machine.',
    relatedLinks: [
      { label: 'How to Make GIFs From Videos', href: '/blog/how-to-make-gifs-from-videos' },
      { label: 'Top GIF Optimization Tips', href: '/blog/top-5-gif-optimization-tips' }
    ],
    altTools: [
      { label: 'Resize a GIF', href: '/resize-gif', desc: 'Adjust dimensions after you export the first cut.' },
      { label: 'Optimize a GIF', href: '/optimize-gif', desc: 'Crunch the final file size without losing quality.' }
    ],
    guide: {
      quickFeatures: [
        { emoji: '🧩', text: 'Trim multiple video segments and stitch them into one loop.' },
        { emoji: '🎚️', text: 'Tweak brightness and contrast before the export runs.' },
        { emoji: '🎞️', text: 'Export GIF plus optional MP4 and WebP companions.' },
        { emoji: '⚡', text: 'Watermark-free processing tuned for quick turnarounds.' }
      ],
      steps: [
        { title: 'Add a video source', description: 'Upload MP4, WebM, MOV, and more or paste a direct/public URL.' },
        { title: 'Mark the moments', description: 'Drag timeline handles or add extra segments to keep only the highlights.' },
        { title: 'Tune the look', description: 'Balance brightness, contrast, frame rate, resolution, and optional audio/WebP outputs.' },
        { title: 'Generate the loop', description: 'Start conversion, then preview the GIF and any extra formats.' },
        { title: 'Download & share', description: 'Save the results or tweak settings and rerun without re-uploading.' }
      ],
      limits: {
        formats: ['MP4', 'WebM', 'AVI', 'MOV', 'MKV', 'FLV'],
        maxResolution: 'Set width/height manually—staying at or below 720px keeps exports speedy.',
        maxFrames: 'We handle long clips, but keep combined segments under ~450 frames for the best experience.',
        recommendedDuration: 'Aim for 6–12 seconds so the GIF loads instantly.',
        notes: 'URL uploads must be publicly accessible.'
      },
      faqs: [
        { question: 'How are multiple segments combined?', answer: 'Each trimmed segment is stitched in the order you add them. Remove and re-add a segment to change the sequence.' },
        { question: 'Where is the MP4 download?', answer: 'Enable “Include audio” before converting. We only create an MP4 when the source contains audio.' },
        { question: 'What frame rate should I choose?', answer: '15 fps keeps motion smooth while limiting file size. Use 20+ only for fast, detailed action.' }
      ],
      troubleshooting: {
        issues: [
          'Conversion fails for URL uploads: confirm the link is public and not behind authentication.',
          'Output feels too large: lower the resolution, shorten segments, or reduce fps before exporting.'
        ],
        quickFixes: [
          'Trim to the highlights instead of exporting the full clip.',
          'Reset brightness and contrast toward neutral if the GIF looks harsh.',
          'Switch to a local upload when a host blocks direct downloads.'
        ]
      },
      sharing: {
        title: 'Share your loop',
        description: 'Drop the GIF into release notes, support threads, or social updates—tag #EasyGIFMaker if you want us to feature it.'
      }
    }
  },
  gifMaker: {
    introHeading: 'Build animated stories frame by frame',
    intro: 'Arrange still images or layered exports into a cohesive animation. Frame-level timing, transitions, and quality controls help your story feel deliberate instead of stitched together hastily.',
    useCases: [
      'Design teams preview UI states or motion studies before shipping to production.',
      'Educators create rapid-fire slides that animate key steps for tutorials or courseware.',
      'Photographers layer before/after sequences to show retouching progress in portfolios.'
    ],
    tips: [
      'Keep source images in the same aspect ratio to avoid jump cuts during playback.',
      'Use incremental frame durations (e.g. 200, 300, 500 ms) to emphasise key slides.',
      'Transitions with 4–6 steps feel smooth without ballooning total frames.',
      'Export at “high” quality first, then run the GIF through the Optimizer to balance size and clarity.'
    ],
    privacy: 'Images stay private—uploads live in an isolated session directory and are automatically removed after the job finishes. Delete the browser preview URL when you are done sharing.',
    relatedLinks: [
      { label: 'Comprehensive GIF Making Guide', href: '/blog/comprehensive-gif-making-guide' },
      { label: 'Creative GIF Design Tutorial', href: '/blog/creative-gif-design-tutorial' }
    ],
    altTools: [
      { label: 'Add Text to GIF', href: '/add-text-to-gif', desc: 'Layer captions or callouts on top of the animation.' },
      { label: 'Reverse a GIF', href: '/reverse-gif', desc: 'Create fun bounce loops from the same frames.' }
    ],
    guide: {
      quickFeatures: [
        { emoji: '✨', text: 'Add per-frame transitions and subtle motion effects.' },
        { emoji: '🔁', text: 'Set custom frame durations and loop counts.' },
        { emoji: '🧲', text: 'Drag-and-drop to reorder frames at any time.' },
        { emoji: '👀', text: 'Preview the animation before you export.' }
      ],
      steps: [
        { title: 'Collect your frames', description: 'Upload still images or paste image URLs in the sequence you want.' },
        { title: 'Arrange the sequence', description: 'Drag frames into place and tweak individual durations or effects.' },
        { title: 'Fine-tune timing', description: 'Use global controls to set default duration, canvas size, and loop count.' },
        { title: 'Preview the animation', description: 'Play the loop to confirm pacing and make fast adjustments.' },
        { title: 'Create & download', description: 'Generate the GIF and save the final loop when it feels right.' }
      ],
      limits: {
        formats: ['JPG', 'PNG', 'GIF', 'WebP', 'APNG', 'HEIC', 'HEIF', 'MNG', 'JP2', 'AVIF', 'JXL', 'BMP', 'PDF'],
        maxResolution: 'Stay below ~800px on the longest edge to keep files manageable.',
        maxFrames: 'Up to roughly 300 frames before processing slows.',
        recommendedDuration: 'Keep total runtime under 20 seconds for easy sharing.',
        notes: 'Mixed aspect ratios are letterboxed to fit the selected canvas.'
      },
      faqs: [
        { question: 'Can I mix portrait and landscape frames?', answer: 'Yes. We letterbox the canvas as needed—choose a consistent size to avoid borders.' },
        { question: 'How do I keep file size down?', answer: 'Limit frame count, stay under 640px wide, and run the result through the Optimizer if you need extra savings.' },
        { question: 'Can I import existing GIFs?', answer: 'Absolutely. Each GIF counts as one frame. Split it first if you want granular control.' }
      ],
      troubleshooting: {
        issues: [
          'Upload stalls on large assets: very high-resolution images or PDFs can take a moment—wait or resize before uploading.',
          'Preview looks jittery: drastically different per-frame durations can cause visible jumps.'
        ],
        quickFixes: [
          'Use the same aspect ratio for every frame to avoid sudden letterboxing shifts.',
          'Duplicate a frame and extend its duration instead of adding multiple copies for emphasis.'
        ]
      },
      sharing: {
        title: 'Publish your animation',
        description: 'Export a WebP alongside the GIF for modern sites, then share across product updates, social threads, or presentations.'
      }
    }
  },
  resizeGif: {
    introHeading: 'Resize GIFs without losing the punch',
    intro: 'Reformat loops for different canvases—switch from desktop hero banners to mobile-first carousels with aspect presets and pixel-perfect output.',
    useCases: [
      'Social media teams adapt the same GIF for feed posts, vertical stories, and in-app replies.',
      'Support agents shrink bug reproductions so they load instantly in ticket threads.',
      'Product marketers prep hero animations for landing pages and newsletter embeds.'
    ],
    tips: [
      'Start from the original source file when possible; resizing already compressed GIFs can add artifacts.',
      'Lock aspect ratio to avoid stretched faces or logos, then export multiple widths for testing.',
      'Combine percentage mode with preset ratios to quickly generate platform-specific variants.',
      'After resizing, inspect playback speed—changing dimensions can subtly change perceived pacing.'
    ],
    privacy: 'We process resize jobs in-memory and purge the temp directory on a schedule. If you share by URL, double-check that the remote file is publicly accessible before submitting.',
    relatedLinks: [
      { label: 'Complete Guide to Resize GIF', href: '/blog/complete-guide-to-resize-gif' },
      { label: 'GIF Accessibility Checklist', href: '/blog/gif-accessibility-guide' }
    ],
    altTools: [
      { label: 'Optimize a GIF', href: '/optimize-gif', desc: 'Reduce file weight after resizing.' },
      { label: 'Crop a GIF', href: '/crop-gif', desc: 'Remove UI chrome or letterboxing before scaling.' }
    ],
    guide: {
      quickFeatures: [
        { emoji: '📏', text: 'Specify exact width and height in pixels.' },
        { emoji: '⚖️', text: 'Lock aspect ratio so nothing looks stretched.' },
        { emoji: '📐', text: 'Scale by percentage for quick presets.' },
        { emoji: '💎', text: 'Quality-preserving resizing pipeline.' }
      ],
      steps: [
        { title: 'Upload your GIF', description: 'Select a GIF from your device or paste a direct GIF URL.' },
        { title: 'Pick target dimensions', description: 'Enter width and height or choose a percentage scale.' },
        { title: 'Keep proportions in check', description: 'Toggle maintain-aspect or pick a preset ratio to avoid distortion.' },
        { title: 'Preview the resized loop', description: 'Review the playback to confirm sharpness and pacing.' },
        { title: 'Export the new size', description: 'Process the GIF and download the resized version immediately.' }
      ],
      limits: {
        formats: ['GIF'],
        maxResolution: 'Resize up to ~1600px on the longest edge; larger files may take longer.',
        maxFrames: 'We preserve every frame from the source animation.',
        recommendedDuration: 'Loops under 15 seconds export quickest.',
        notes: 'Original frame timing is maintained during resizing.'
      },
      faqs: [
        { question: 'Does resizing change animation speed?', answer: 'No. We keep the original frame timing. Only the visual size changes.' },
        { question: 'Can I stretch the GIF?', answer: 'You can, but we recommend keeping aspect ratio locked for natural results.' },
        { question: 'Should I resize before or after adding text?', answer: 'Resize first so text overlays stay sharp and sized correctly.' }
      ],
      troubleshooting: {
        issues: [
          'Output looks blurry: avoid enlarging far beyond the source resolution.',
          'Upload fails: confirm the file is a GIF and within the upload size limit.'
        ],
        quickFixes: [
          'Try percentage mode for fast reductions without remembering dimensions.',
          'Export multiple sizes for different channels and pick the sharpest result.'
        ]
      },
      sharing: {
        title: 'Ready to publish',
        description: 'Run the resized GIF through the Optimizer next if you need to meet tight file-size caps.'
      }
    }
  },
  cropGif: {
    introHeading: 'Focus attention with precise cropping',
    intro: 'Trim out UI chrome, sensitive information, or empty borders so your animation spotlights what matters most.',
    useCases: [
      'Customer success teams hide usernames or account balances before sharing demos.',
      'Designers reframe animations for app store screenshots and marketing decks.',
      'Communities clip the funniest part of a meme without surrounding clutter.'
    ],
    tips: [
      'Choose an aspect preset first, then fine-tune the crop so key elements stay centered.',
      'Use zoom controls to ensure text remains legible after the crop is applied.',
      'Export the cropped result and pass it through the Optimizer to reclaim extra savings.',
      'Preview on both light and dark backgrounds to confirm there are no ghost borders.'
    ],
    privacy: 'Cropping replaces the original frames with a new rendition stored in your session directory. Files are cleaned automatically—still, avoid uploading confidential captures that should not leave your device.',
    relatedLinks: [
      { label: 'Professional GIF Cropping Guide', href: '/blog/professional-gif-cropping-and-composition-guide' },
      { label: 'Troubleshooting GIF Artifacts', href: '/blog/gif-optimization-techniques' }
    ],
    altTools: [
      { label: 'Resize a GIF', href: '/resize-gif', desc: 'Scale the cropped loop for each platform.' },
      { label: 'Add Text to GIF', href: '/add-text-to-gif', desc: 'Drop in labels after you focus the frame.' }
    ],
    guide: {
      quickFeatures: [
        { emoji: '✂️', text: 'Crop freely or snap to preset aspect ratios.' },
        { emoji: '🖱️', text: 'Drag handles on an interactive preview canvas.' },
        { emoji: '🔍', text: 'Zoom in for pixel-level framing before exporting.' },
        { emoji: '⚡', text: 'Fast processing with no watermark.' }
      ],
      steps: [
        { title: 'Upload your GIF', description: 'Select a GIF or paste a direct GIF URL to begin.' },
        { title: 'Choose a framing style', description: 'Pick a preset aspect ratio or stay in freeform mode.' },
        { title: 'Adjust the crop', description: 'Drag the crop box and use zoom to keep the important action centered.' },
        { title: 'Preview the result', description: 'Confirm the cropped animation looks right before exporting.' },
        { title: 'Download the focused loop', description: 'Apply the crop and save the new GIF instantly.' }
      ],
      limits: {
        formats: ['GIF'],
        maxResolution: 'Very large GIFs may take longer—crop first, then optimize if you need extra savings.',
        maxFrames: 'All frames are processed; extremely long loops simply take more time.',
        recommendedDuration: 'Works best on loops under 20 seconds.',
        notes: 'Cropping retains animation and transparency throughout the export.'
      },
      faqs: [
        { question: 'How do I crop a GIF without breaking animation?', answer: 'Upload the GIF, position the crop box, and export—we apply the crop to every frame automatically.' },
        { question: 'Can I choose a fixed aspect ratio?', answer: 'Yes. Select presets like 1:1, 4:5, or 16:9 before adjusting the handles.' },
        { question: 'What if I only need to hide sensitive info?', answer: 'Zoom in and set a tight crop; the export removes everything outside the box.' }
      ],
      troubleshooting: {
        issues: [
          'Crop handles feel laggy: large GIFs can be heavy—toggle zoom or resize after cropping.',
          'Result shows blank frames: ensure the crop box has a non-zero width and height before exporting.'
        ],
        quickFixes: [
          'Use preset ratios that match the platform you are publishing on.',
          'Zoom in for precise edges and keep key elements centered.'
        ]
      },
      sharing: {
        title: 'Highlight the good stuff',
        description: 'Share the cropped GIF to spotlight just the detail you want viewers to see—no extra editing passes required.'
      }
    }
  },
  optimizeGif: {
    introHeading: 'Deliver smaller GIFs without dull colours',
    intro: 'Fine-tune palettes, dithering, and lossy compression to hit strict message-size limits while keeping motion smooth and on-brand.',
    useCases: [
      'Email marketers squeeze animated headers under 1 MB to beat client throttles.',
      'Growth teams prepare ultra-light assets for in-app tooltips and notification trays.',
      'Developers compress documentation snippets so they render instantly in wikis.'
    ],
    tips: [
      'Lower colours in small steps—dropping from 256 to 128 often halves file size with minimal quality hit.',
      'Use selective lossy compression on busy backgrounds and leave text overlays sharp.',
      'Preview with different dithering options to balance gradients and graininess.',
      'Track original vs optimized size to validate that tweaks actually save bytes.'
    ],
    privacy: 'Optimized copies replace the originals in our temp storage, covered by the same automated deletion policy. Sensitive material should be anonymised before uploading.',
    relatedLinks: [
      { label: 'GIF Optimization Techniques', href: '/blog/gif-optimization-techniques' },
      { label: 'Ultimate Guide to Viral GIFs', href: '/blog/ultimate-guide-to-viral-gifs' }
    ],
    altTools: [
      { label: 'Video to GIF', href: '/video-to-gif', desc: 'Start from raw footage before optimising output.' },
      { label: 'Reverse a GIF', href: '/reverse-gif', desc: 'Create playful boomerang loops after optimising.' }
    ],
    guide: {
      quickFeatures: [
        { emoji: '🎯', text: 'Adjust palette size, lossy compression, and dithering.' },
        { emoji: '⚙️', text: 'Use presets or granular sliders for precise control.' },
        { emoji: '📉', text: 'Watch estimated savings update as you tweak settings.' },
        { emoji: '📬', text: 'Hit strict email, chat, and support upload limits.' }
      ],
      steps: [
        { title: 'Upload your GIF', description: 'Choose a GIF from your device or paste a direct link.' },
        { title: 'Pick an optimisation approach', description: 'Start with a preset or dial in quality, colours, lossy amount, and dithering manually.' },
        { title: 'Review the estimates', description: 'Keep an eye on the projected size reduction while you iterate.' },
        { title: 'Run the optimisation', description: 'Process the GIF once you are happy with the balance between quality and size.' },
        { title: 'Download the smaller file', description: 'Grab the optimised GIF and compare it with the original if needed.' }
      ],
      limits: {
        formats: ['GIF'],
        maxResolution: 'Works best up to ~1200px on the longest edge—trim or resize first for very large loops.',
        maxFrames: 'Long loops are supported but take longer beyond ~300 frames.',
        recommendedDuration: 'Shorter loops (≤15s) compress more efficiently.',
        notes: 'Animation speed remains intact; optimisation focuses on palette data.'
      },
      faqs: [
        { question: 'Will optimisation reduce animation smoothness?', answer: 'Not when you keep the original frame rate—changes focus on palette and compression.' },
        { question: 'How low can I set colours?', answer: 'Most UI demos look crisp at 128 colours. Drop to 64 only after previewing text and gradients.' },
        { question: 'Does lossy compression add artefacts?', answer: 'Mild lossy (10–20) smooths noise with minimal artefacts. Push higher values only for photographic footage.' }
      ],
      troubleshooting: {
        issues: [
          'Output looks grainy: reduce lossy compression or increase the colour count.',
          'File size barely changes: drop colours further, raise lossy slightly, or trim the clip first.'
        ],
        quickFixes: [
          'Toggle dithering styles to control banding.',
          'Run optimisation after resizing or cropping for best results.',
          'Compare estimated vs actual size to confirm improvements.'
        ]
      },
      sharing: {
        title: 'Ready for tight budgets',
        description: 'Use the optimised GIF in email campaigns, help centres, or chat threads without hitting upload caps.'
      }
    }
  },
  reverseGif: {
    introHeading: 'Add playful bounce loops to any GIF',
    intro: 'Reverse playback creates instant boomerangs that keep viewers watching. Perfect for emphasizing physical motion, reveals, or quick comedic beats.',
    useCases: [
      'Social teams craft back-and-forth loops from product unboxings or lifestyle clips.',
      'UX researchers highlight looping micro-interactions from prototype recordings.',
      'Memers double the punchline by rewinding reactions without editing suites.'
    ],
    tips: [
      'Keep clips short—reversing long GIFs can double the runtime and feel sluggish.',
      'Combine “reverse only” with “append original” to create seamless boomerang effects.',
      'If motion feels jittery, lower the frame rate slightly before reversing.',
      'Use after Optimizer to ensure the doubled frames still meet sharing limits.'
    ],
    privacy: 'Reversed GIFs are rendered in new session folders and inherit the same automatic cleanup policy. Avoid sharing confidential footage; reversed loops do not remove sensitive pixels.',
    relatedLinks: [
      { label: 'Social Media GIF Strategy', href: '/blog/social-media-gif-strategy' },
      { label: 'Troubleshooting Section', href: '/blog/gif-optimization-techniques' }
    ],
    altTools: [
      { label: 'Add Text to GIF', href: '/add-text-to-gif', desc: 'Caption the boomerang to guide viewers.' },
      { label: 'Optimize a GIF', href: '/optimize-gif', desc: 'Shrink the reversed loop for messaging apps.' }
    ],
    guide: {
      quickFeatures: [
        { emoji: '↩️', text: 'Flip any GIF into a boomerang-style reverse loop.' },
        { emoji: '🎞️', text: 'Keeps every frame and original timing intact.' },
        { emoji: '⚡', text: 'Cloud processing finishes in seconds.' },
        { emoji: '🧰', text: 'Works with animated GIFs of all sizes.' }
      ],
      steps: [
        { title: 'Upload your GIF', description: 'Select a GIF or paste a direct URL to start.' },
        { title: 'Preview the original', description: 'Check the animation before you flip the playback direction.' },
        { title: 'Reverse the loop', description: 'Trigger the reverse pass—optionally append the original for a bounce effect.' },
        { title: 'Download & share', description: 'Save the reversed GIF and post it wherever you need a playful loop.' }
      ],
      limits: {
        formats: ['GIF'],
        maxResolution: 'Best results under ~800px on the longest edge for quick rendering.',
        maxFrames: 'Handles roughly 300 frames comfortably before slowing down.',
        recommendedDuration: 'Short clips reverse fastest—aim for loops under 10 seconds.',
        notes: 'Appending the original doubles the perceived runtime and file size.'
      },
      faqs: [
        { question: 'Does reversing change file size?', answer: 'The size stays close to the original. Expect a slight increase only if you append the forward playback.' },
        { question: 'Will the GIF loop backwards automatically?', answer: 'Yes. The animation plays from the last frame back to the first by default.' },
        { question: 'Can I reverse very large GIFs?', answer: 'You can, but big files take longer. Keep uploads under 200 MB for the smoothest experience.' }
      ],
      troubleshooting: {
        issues: [
          'Upload fails: confirm the file is a valid GIF and within the upload size limit.',
          'Processing takes a long time: long or high-resolution loops naturally take more time—trim or optimise first.'
        ],
        quickFixes: [
          'Use shorter clips when you only need a quick boomerang.',
          'Run the reversed GIF through the Optimizer if the file size crept up.'
        ]
      },
      sharing: {
        title: 'Create playful bounce loops',
        description: 'Pair the reversed GIF with text overlays or the original clip, then share on social or in chat for extra punch.'
      }
    }
  },
  addText: {
    introHeading: 'Narrate your GIFs with layered typography',
    intro: 'Responsive text layers, stroke controls, and per-frame timing let you annotate clips without exporting to a full video editor.',
    useCases: [
      'Product managers label UI hotspots in release notes or pitch decks.',
      'Educators overlay subtitles so silent clips stay accessible.',
      'Marketers build promo stickers or callouts that match brand fonts.'
    ],
    tips: [
      'Use auto-fit with a max width under 90% so captions never touch the edges.',
      'Stagger layer start/end times to create multi-step callouts without extra frames.',
      'Upload custom fonts via URL to maintain brand consistency across platforms.',
      'Preview on both light and dark backgrounds to ensure stroke contrast is adequate.'
    ],
    privacy: 'Fonts and GIF layers are saved only for the lifetime of the editing session. Remove any uploaded font files you no longer need from your own storage to keep licensing clean.',
    relatedLinks: [
      { label: 'Master the Art of Adding Text to GIFs', href: '/blog/master-the-art-of-adding-text-to-gifs' },
      { label: 'Add Text to GIFs Guide', href: '/blog/add-text-to-gifs-guide' }
    ],
    altTools: [
      { label: 'Optimize a GIF', href: '/optimize-gif', desc: 'Compress the captioned export before sharing.' },
      { label: 'Video to GIF', href: '/video-to-gif', desc: 'Create source clips before applying text layers.' }
    ],
    guide: {
      quickFeatures: [
        { emoji: '🔤', text: 'Add layered titles, captions, and callouts.' },
        { emoji: '🧩', text: 'Stack multiple text layers with independent timing.' },
        { emoji: '🖊️', text: 'Upload custom fonts and fine-tune colours, strokes, and animations.' },
        { emoji: '📐', text: 'Alignment, offsets, wrapping, and auto-fit controls.' }
      ],
      steps: [
        { title: 'Upload your GIF', description: 'Select a GIF from your device or paste a direct URL to annotate.' },
        { title: 'Create a text layer', description: 'Pick fonts, colours, animation style, and enter your copy.' },
        { title: 'Position & time the caption', description: 'Drag text on the canvas and set start/end times for each layer.' },
        { title: 'Preview the overlay', description: 'Play the loop to confirm legibility and timing before export.' },
        { title: 'Download the captioned GIF', description: 'Render the final animation with text baked in and share it anywhere.' }
      ],
      limits: {
        formats: ['GIF'],
        maxResolution: 'Very large GIFs may render slower—keep under ~1200px on the longest edge when possible.',
        maxFrames: 'Supports long loops, but more frames increase processing time.',
        recommendedDuration: 'No hard duration limit, but shorter loops keep captions easy to read.',
        notes: 'Custom fonts must be .ttf or .otf files.'
      },
      faqs: [
        { question: 'Can I add multiple text elements?', answer: 'Yes. Add as many layers as you need—each can have its own timing, font, and animation.' },
        { question: 'Will my font upload be embedded?', answer: 'Uploaded .ttf or .otf fonts are baked into the export so viewers see the correct typography.' },
        { question: 'Why isn’t my text visible?', answer: 'Check the layer’s start/end times, colour contrast, and order. Enable stroke for extra legibility on busy footage.' }
      ],
      troubleshooting: {
        issues: [
          'Layer disappears mid-loop: verify timing overlaps and that the layer is not fully transparent.',
          'Upload fails: ensure the source is a GIF and custom fonts use the .ttf or .otf format.'
        ],
        quickFixes: [
          'Use auto-fit with a max width so captions stay comfortably inside the frame.',
          'Preview on light and dark backgrounds to confirm contrast is strong enough.'
        ]
      },
      sharing: {
        title: 'Caption and share',
        description: 'Export the GIF with on-brand typography, then drop it into release notes, tutorials, or social posts.'
      }
    }
  },
  promptGif: {
    introHeading: 'Prototype animated ideas with text prompts',
    intro: 'Skip storyboards and jump straight into motion concepts. AnimateDiff turns short textual briefs into looping GIFs so you can validate a look before committing time to production.',
    useCases: [
      'Product marketers spin up atmospheric hero loops for launch pages.',
      'Designers explore motion branding concepts without opening full desktop suites.',
      'Educators generate visual metaphors or character loops for presentations.'
    ],
    tips: [
      'Lead with subject, setting, and motion. Style cues (lens, lighting, art medium) tighten the result.',
      'Keep generations short—12 to 16 frames at 8 fps produce natural loops while staying under the duration cap.',
      'Reuse seeds to iterate on a composition without introducing random changes.',
      'Use the negative prompt to exclude “text” or “watermark” artefacts in final renders.'
    ],
    privacy: 'Prompts and outputs follow the same temporary storage policy as other tools. Outputs live in isolated session directories and scheduled cleanup tasks remove them after processing. Avoid entering sensitive data in your prompts.',
    relatedLinks: [
      { label: 'Creative GIF Design Tutorial', href: '/blog/creative-gif-design-tutorial' },
      { label: 'Gif Accessibility Guide', href: '/blog/gif-accessibility-guide' }
    ],
    altTools: [
      { label: 'Optimize a GIF', href: '/optimize', desc: 'Compress AI loops before you share them widely.' },
      { label: 'Add Text to GIF', href: '/add-text', desc: 'Caption AI animations with on-brand typography.' }
    ],
    guide: {
      quickFeatures: [
        { emoji: '✨', text: 'AnimateDiff pipeline tuned for fast iteration.' },
        { emoji: '🧠', text: 'Prompt and negative prompt fields keep outputs on brief.' },
        { emoji: '🎚️', text: 'Adjust guidance, frames, steps, and FPS for precise control.' },
        { emoji: '🪄', text: 'Optional seed makes renders reproducible when iterating.' }
      ],
      steps: [
        { title: 'Describe the loop', description: 'Write a prompt with subject, setting, motion, and style cues.' },
        { title: 'Add constraints', description: 'Optionally set a negative prompt or seed to influence the output.' },
        { title: 'Dial in diffusion', description: 'Adjust frame count, fps, guidance scale, and steps to balance fidelity with speed.' },
        { title: 'Generate & download', description: 'Queue the job, wait for rendering, then preview and save the GIF output.' }
      ],
      limits: {
        formats: ['Prompt input'],
        maxResolution: 'Model dependent (typically 512×512).',
        maxFrames: 'Up to 24 frames per generation.',
        maxFps: 'Up to 16 fps on the default pipeline.',
        recommendedDuration: 'Keep loops under ~10 seconds to stay within compute limits.',
        notes: 'Jobs need GPU acceleration—queues may pause briefly when demand spikes.'
      },
      faqs: [
        { question: 'How long can the GIF be?', answer: 'Generations cap at roughly 12 seconds. Reduce frames or raise fps if you hit the limit.' },
        { question: 'Do I need a GPU?', answer: 'Yes. AnimateDiff expects GPU acceleration—CPU-only environments are extremely slow.' },
        { question: 'Why did my job fail?', answer: 'Common causes are missing dependencies or a busy queue. Try again after a short pause.' }
      ],
      troubleshooting: {
        issues: [
          'Generation stalls at “queueing”: no GPU worker is currently available—wait a moment and retry.',
          'Output looks noisy or off-topic: the prompt may be underspecified or guidance too low.'
        ],
        quickFixes: [
          'Reduce frames to 12–16 when you bump against the duration limit.',
          'Add style cues such as “cinematic lighting” or “watercolour illustration” to tighten the result.',
          'Use a negative prompt like “text, watermark, blurry” to suppress artefacts.'
        ]
      },
      sharing: {
        title: 'Show off your concept',
        description: 'Download the AI-generated GIF, then run it through Optimise or Add Text before posting to social or pitching in decks.'
      }
    }
  }
}

export default toolContent
