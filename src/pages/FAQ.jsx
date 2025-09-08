import React from 'react';
import { Helmet } from 'react-helmet-async';
import Meta from '@/components/Meta.jsx';
import { Link } from 'react-router-dom';

export default function FAQ() {
  return (
    <main className="min-h-[60vh] bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center py-12 px-4" aria-label="FAQ - Frequently Asked Questions">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100">
      <Meta
        title="FAQ | EasyGIFMaker Frequently Asked Questions"
        description="Find answers to common questions about EasyGIFMaker's GIF and video editing tools, features, and troubleshooting."
        url="/faq"
        image="https://easygifmaker.com/og-image.png"
        imageAlt="EasyGIFMaker FAQ"
      />
      <Helmet>
        <meta property="og:type" content="website" />
      </Helmet>
        <header className="text-center" aria-label="FAQ Header">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-8">Frequently Asked Questions</h1>
        </header>
        <section className="space-y-8 text-gray-800" aria-label="FAQ Content">
          {/* Limits & Supported Formats */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Limits & Supported Formats</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <ul className="text-sm text-blue-900 space-y-2">
                <li><strong>Max file size:</strong> 200MB</li>
                <li><strong>Accepted formats:</strong> Images — GIF, JPG, PNG, WebP, APNG, HEIC/HEIF, MNG, JP2, AVIF, JXL, BMP, PDF. Video — MP4, WebM, AVI, MOV, MKV, FLV.</li>
                <li><strong>FPS:</strong> up to ~30 FPS (higher FPS increases file size)</li>
                <li><strong>Frames:</strong> ~300 frame safety cap on complex operations</li>
                <li><strong>Resolution:</strong> up to ~800×800 px equivalent for heavy edits; higher sizes supported for simple conversions</li>
                <li><strong>Recommended duration:</strong> keep clips ≤ 15s for fast, shareable GIFs</li>
              </ul>
              <div className="mt-3 text-sm">
                <div className="font-semibold">If it fails:</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Trim duration and/or lower FPS</li>
                  <li>Resize to a smaller width (e.g. 480–720 px)</li>
                  <li>Ensure the file is a supported type and under 200MB</li>
                  <li>Try another browser or clear cache</li>
                </ul>
              </div>
            </div>
          </div>
          {/* General Questions */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">General Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Is EasyGIFMaker really free to use?</h3>
                <p className="text-gray-700 mt-1">Yes, all our tools are 100% free. We support our service through on-site advertising, which allows us to keep everything accessible to you without any charges.</p>
              </div>
              <div>
                <h3 className="font-semibold">Do I need to create an account?</h3>
                <p className="text-gray-700 mt-1">No, you can use all our tools without signing up. Just upload your file and start creating right away.</p>
              </div>
              <div>
                <h3 className="font-semibold">What is the maximum file size I can upload?</h3>
                <p className="text-gray-700 mt-1">You can upload files up to 200MB. This allows for high-quality video and image processing.</p>
              </div>
              <div>
                <h3 className="font-semibold">What file formats do you support?</h3>
                <p className="text-gray-700 mt-1">We support a wide range of formats! For videos, we accept MP4, WebM, AVI, MOV, MKV, FLV, 3GP, WMV, and more. For images, we support GIF, JPG, PNG, WebP, BMP, TIFF, and many others. Each tool page lists the specific formats it supports.</p>
              </div>
              <div>
                <h3 className="font-semibold">Can I use EasyGIFMaker on my phone or tablet?</h3>
                <p className="text-gray-700 mt-1">Absolutely! Our website is fully responsive and designed to work seamlessly on all modern devices, including desktops, tablets, and smartphones.</p>
              </div>
              <div>
                <h3 className="font-semibold">How long does it take to process my files?</h3>
                <p className="text-gray-700 mt-1">Processing times vary depending on file size, complexity, and current server load. Most conversions complete within 30 seconds to 2 minutes. Large video files or complex operations may take longer.</p>
              </div>
              <div>
                <h3 className="font-semibold">What makes EasyGIFMaker different from other online tools?</h3>
                <p className="text-gray-700 mt-1">We prioritize speed, quality, and privacy. Our tools use advanced algorithms for optimal results, process files quickly, never store your data, and work on all devices without requiring software downloads or registrations.</p>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Privacy & Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Are my uploaded files safe? Do you store them?</h3>
                <p className="text-gray-700 mt-1">Your privacy and security are our top priorities. We do not store, view, or share your files. All uploaded files are processed securely and are automatically and permanently deleted from our servers within a few hours. You can read more in our <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.</p>
              </div>
              <div>
                <h3 className="font-semibold">Is my personal information collected or shared?</h3>
                <p className="text-gray-700 mt-1">We only collect minimal technical information necessary for service operation (like IP addresses for security). We never collect personal information, track users across sessions, or share data with third parties for marketing purposes.</p>
              </div>
              <div>
                <h3 className="font-semibold">How do you ensure my files remain private during processing?</h3>
                <p className="text-gray-700 mt-1">All file processing happens on secure servers with encrypted connections. Files are processed in isolated environments and are never accessible to other users or external parties. Our systems automatically purge all temporary files after processing completion.</p>
              </div>
              <div>
                <h3 className="font-semibold">Can I delete my files immediately after processing?</h3>
                <p className="text-gray-700 mt-1">Yes, you can close your browser tab immediately after downloading your result. Our system automatically cleans up all temporary files, and closing your session triggers immediate deletion of any remaining data.</p>
              </div>
            </div>
          </div>

          {/* Technical Questions */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Technical Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">What browsers are supported?</h3>
                <p className="text-gray-700 mt-1">EasyGIFMaker works with all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. We recommend using the latest browser versions for optimal performance and security.</p>
              </div>
              <div>
                <h3 className="font-semibold">Why is my processed file quality lower than expected?</h3>
                <p className="text-gray-700 mt-1">GIFs are limited to 256 colors per frame, which can affect quality compared to original videos or photos. We use advanced optimization techniques to maintain the best possible quality within these constraints. You can adjust quality settings on most tools for better results.</p>
              </div>
              <div>
                <h3 className="font-semibold">Can I batch process multiple files at once?</h3>
                <p className="text-gray-700 mt-1">Currently, our tools process files individually to ensure optimal quality and performance. However, you can use multiple browser tabs to process different files simultaneously.</p>
              </div>
              <div>
                <h3 className="font-semibold">How do you optimize GIFs for web performance?</h3>
                <p className="text-gray-700 mt-1">We use sophisticated algorithms including color palette optimization, frame deduplication, temporal compression, and intelligent dithering to minimize file sizes while preserving visual quality. Our optimization considers the intended use case and viewing context.</p>
              </div>
            </div>
          </div>

          {/* Tool-Specific Questions */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Tool-Specific Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Can I convert a video from a URL like YouTube?</h3>
                <p className="text-gray-700 mt-1">Yes! Our Video to GIF tool supports URLs from popular sites. Just paste the video URL, and our tool will fetch it for you to edit.</p>
              </div>
              <div>
                <h3 className="font-semibold">I converted a video, but the GIF has no sound. Why?</h3>
                <p className="text-gray-700 mt-1">The GIF file format does not support audio. However, our Video to GIF tool gives you the option to "Include Audio," which will generate a downloadable MP4 file with sound in addition to your GIF. If the original video has no audio, only a GIF will be created.</p>
              </div>
              <div>
                <h3 className="font-semibold">How can I make my GIF loop seamlessly?</h3>
                <p className="text-gray-700 mt-1">For seamless loops, choose video segments where the end frame closely matches the beginning frame. Our tools automatically set GIFs to loop infinitely by default. You can adjust loop settings in the conversion options.</p>
              </div>
              <div>
                <h3 className="font-semibold">What's the difference between GIF quality settings?</h3>
                <p className="text-gray-700 mt-1">Higher quality settings preserve more colors and detail but create larger files. Lower settings reduce file size by simplifying colors and compression. Choose based on your intended use - high quality for professional use, medium for social media, low for email or bandwidth-limited scenarios.</p>
              </div>
              <div>
                <h3 className="font-semibold">Can I add text or watermarks to my GIFs?</h3>
                <p className="text-gray-700 mt-1">Yes! Our Add Text to GIF tool allows you to overlay custom text, choose fonts, colors, and positioning. You can create captions, watermarks, or branded content with professional typography options.</p>
              </div>
              <div>
                <h3 className="font-semibold">How do I resize a GIF without losing quality?</h3>
                <p className="text-gray-700 mt-1">Our GIF Resizer uses advanced algorithms like bicubic interpolation to maintain quality during resizing. For best results, avoid extreme size changes and consider the content type - simple graphics resize better than complex photographic content.</p>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Troubleshooting</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">My file upload failed. What should I do?</h3>
                <p className="text-gray-700 mt-1">Please check that your file is under the 200MB size limit and is one of our supported formats. A slow or unstable internet connection can also cause issues. Try uploading the file again, and if the problem persists, feel free to <Link to="/contact" className="text-blue-600 hover:underline">contact us</Link>.</p>
              </div>
              <div>
                <h3 className="font-semibold">The tool seems stuck or unresponsive. What can I do?</h3>
                <p className="text-gray-700 mt-1">Large files or complex operations may take several minutes to process. If the tool appears stuck for more than 5 minutes, try refreshing the page and uploading again. Clear your browser cache if problems persist.</p>
              </div>
              <div>
                <h3 className="font-semibold">My GIF appears corrupted or doesn't play correctly.</h3>
                <p className="text-gray-700 mt-1">This can happen if the source file was corrupted or if there was an interruption during processing. Try uploading the file again, or use a different source file. Ensure your original file plays correctly before conversion.</p>
              </div>
              <div>
                <h3 className="font-semibold">The download isn't working on my device.</h3>
                <p className="text-gray-700 mt-1">Some mobile browsers or older browsers may have download restrictions. Try using a desktop browser, or on mobile, long-press the download link and select "Save Link As" or similar option.</p>
              </div>
              <div>
                <h3 className="font-semibold">Why does my video to GIF conversion take so long?</h3>
                <p className="text-gray-700 mt-1">Conversion time depends on video length, resolution, frame rate, and complexity. Longer videos, higher resolutions, and complex motion require more processing time. Try reducing the clip length or resolution for faster processing.</p>
              </div>
              <div>
                <h3 className="font-semibold">I have another question. How can I get in touch?</h3>
                <p className="text-gray-700 mt-1">We'd love to hear from you! For any other questions, feedback, or support, please visit our <Link to="/contact" className="text-blue-600 hover:underline">Contact</Link> page.</p>
              </div>
            </div>
          </div>

          {/* Advanced Usage */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Advanced Usage</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Can I customize frame rates and timing?</h3>
                <p className="text-gray-700 mt-1">Yes! Most of our tools offer advanced settings for frame rate, timing, and animation speed. You can create fast-paced action GIFs or slow, detailed animations depending on your creative vision.</p>
              </div>
              <div>
                <h3 className="font-semibold">How do I optimize GIFs for specific social media platforms?</h3>
                <p className="text-gray-700 mt-1">Different platforms have different requirements. Instagram favors square or vertical formats, Twitter prefers horizontal layouts, and all platforms benefit from optimized file sizes. Our tools include platform-specific presets for optimal results.</p>
              </div>
              <div>
                <h3 className="font-semibold">Can I create transparent GIFs?</h3>
                <p className="text-gray-700 mt-1">Yes, if your source images have transparent backgrounds (like PNG files), our tools preserve transparency in the resulting GIF. This is perfect for overlays, logos, and graphics that need to blend with different backgrounds.</p>
              </div>
              <div>
                <h3 className="font-semibold">What's the best approach for creating cinemagraphs?</h3>
                <p className="text-gray-700 mt-1">Cinemagraphs work best with videos where most of the frame is static with subtle motion in specific areas. Choose clips with repetitive motion like flowing water, moving hair, or swaying objects. Use our cropping and timing tools to focus on the moving elements.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
