import React from 'react'
import { Share2, Instagram, Twitter, Facebook, Youtube, MessageCircle } from 'lucide-react'

export default function SocialSharingSection({ 
  title = "Share Your GIF!", 
  description = "Share your new GIF on Instagram, Twitter, TikTok, Facebook, or embed it in your blog or website. Tag us with #EasyGIFMaker for a chance to be featured!",
  hashtag = "#EasyGIFMaker",
  websiteUrl = "https://easygifmaker.com"
}) {
  
  const socialPlatforms = [
    {
      name: "Instagram",
      icon: Instagram,
      emoji: "📸",
      description: "Perfect for stories & posts",
      color: "from-pink-500 to-purple-600",
      hoverColor: "from-pink-600 to-purple-700",
      url: `https://www.instagram.com/`,
      shareUrl: (text) => `https://www.instagram.com/?url=${encodeURIComponent(websiteUrl)}&text=${encodeURIComponent(text)}`
    },
    {
      name: "Twitter",
      icon: Twitter,
      emoji: "🐦",
      description: "Great for reactions & memes",
      color: "from-blue-400 to-blue-600",
      hoverColor: "from-blue-500 to-blue-700",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing GIF I made with ${hashtag}! ${websiteUrl}`)}`,
      shareUrl: (text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    },
    {
      name: "Facebook",
      icon: Facebook,
      emoji: "📘",
      description: "Share with friends",
      color: "from-blue-600 to-blue-800",
      hoverColor: "from-blue-700 to-blue-900",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}`,
      shareUrl: (text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}&quote=${encodeURIComponent(text)}`
    },
    {
      name: "TikTok",
      icon: MessageCircle,
      emoji: "🎵",
      description: "Add to your videos",
      color: "from-black to-gray-800",
      hoverColor: "from-gray-800 to-black",
      url: `https://www.tiktok.com/`,
      shareUrl: (text) => `https://www.tiktok.com/`
    }
  ]

  const handleShare = (platform) => {
    const shareText = `Check out this amazing GIF I made with ${hashtag}! ${websiteUrl}`
    const shareUrl = platform.shareUrl ? platform.shareUrl(shareText) : platform.url
    
    if (platform.name === "TikTok") {
      // TikTok doesn't have a direct share URL, so we'll copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert(`Share text copied! You can now paste it on ${platform.name}`)
      })
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const copyWebsiteLink = () => {
    navigator.clipboard.writeText(websiteUrl).then(() => {
      alert('Website link copied to clipboard!')
    })
  }

  return (
    <section className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
        <span className="text-2xl">🚀</span>
        {title}
      </h2>
      
      <p className="text-gray-700 mb-6 leading-relaxed">
        {description}
      </p>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {socialPlatforms.map((platform) => {
          const IconComponent = platform.icon
          return (
            <button
              key={platform.name}
              onClick={() => handleShare(platform)}
              className={`bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg group cursor-pointer border border-white/30 hover:border-white/50`}
            >
              <div className="text-2xl mb-2">{platform.emoji}</div>
              <div className="font-semibold text-gray-800 mb-1">{platform.name}</div>
              <div className="text-xs text-gray-600">{platform.description}</div>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <IconComponent className="h-4 w-4 mx-auto text-gray-500" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Additional sharing options */}
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          More Sharing Options
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={copyWebsiteLink}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Share2 className="h-4 w-4" />
            Copy Website Link
          </button>
          <button
            onClick={() => {
              const shareText = `Check out this amazing GIF I made with ${hashtag}! ${websiteUrl}`
              navigator.clipboard.writeText(shareText).then(() => {
                alert('Share text copied to clipboard!')
              })
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            Copy Share Text
          </button>
        </div>
      </div>

      {/* Embed instructions */}
      <div className="mt-6 bg-gradient-to-r from-purple-100/50 to-pink-100/50 backdrop-blur-sm rounded-2xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">💡 Embed in Your Website</h3>
        <p className="text-sm text-gray-700 mb-3">
          Want to embed your GIF in a blog or website? Simply download your GIF and use this HTML code:
        </p>
        <div className="bg-gray-800 text-green-400 p-3 rounded-lg text-sm font-mono overflow-x-auto">
          {`<img src="your-gif-file.gif" alt="My amazing GIF" style="max-width: 100%; height: auto;" />`}
        </div>
      </div>
    </section>
  )
} 