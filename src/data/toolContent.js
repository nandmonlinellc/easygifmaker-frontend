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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  }
}

export default toolContent
