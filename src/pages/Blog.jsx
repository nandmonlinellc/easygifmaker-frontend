import React from 'react';
import { Helmet } from 'react-helmet-async';
import Meta from '@/components/Meta.jsx';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

// Example blog posts data with featured images
const blogPosts = [
	{
		id: 1,
		title: 'The Ultimate Guide to Creating Viral GIFs: Tips, Tricks, and Free Tools',
		description:
			'Learn how to create viral GIFs with EasyGIFMaker\'s free online tools. Tips, tricks, and step-by-step guidance for making GIFs that get noticed.',
		date: '2025-07-16',
		author: 'Muhammad Nazam AI',
		path: '/blog/ultimate-guide-to-viral-gifs',
		tags: ['Viral GIFs', 'Tips & Tricks', 'Free Tools'],
		image: '/blog/magical-gif.gif',
		image_mobile: '/blog/magical-gif-mobile.webp',
		featured: true,
	},
	{
		id: 2,
		title: 'The Complete Guide to GIF Making: From Beginner to Professional',
		description:
			'Master the art of GIF creation with our comprehensive guide covering professional techniques, tools, and optimization strategies for stunning animated content.',
		date: '2025-08-10',
		author: 'EasyGIFMaker Team',
		path: '/blog/comprehensive-gif-making-guide',
		tags: ['GIF Making', 'Tutorial', 'Professional Tips'],
		image: '/blog/comprehensive-gif-making-guide.webp',
		image_mobile: '/blog/comprehensive-gif-making-guide.webp',
		featured: true,
	},
	{
		id: 3,
		title: 'Advanced GIF Optimization Techniques for Web Performance',
		description:
			'Learn professional GIF optimization techniques to reduce file sizes, improve loading speeds, and enhance user experience without sacrificing visual quality.',
		date: '2025-08-10',
		author: 'EasyGIFMaker Team',
		path: '/blog/gif-optimization-techniques',
		tags: ['Optimization', 'Web Performance', 'Technical Guide'],
		image: '/blog/gif-optimization-techniques.svg',
		image_mobile: '/blog/gif-optimization-techniques.svg',
	},
	{
		id: 4,
		title: 'The Complete Social Media GIF Strategy Guide for 2025',
		description:
			'Master social media GIF marketing with platform-specific strategies, engagement techniques, and performance optimization for Instagram, Twitter, Facebook, and more.',
		date: '2025-08-10',
		author: 'EasyGIFMaker Team',
		path: '/blog/social-media-gif-strategy',
		tags: ['Social Media', 'Marketing Strategy', 'Content Creation'],
		image: '/blog/social-media-gif-strategy.svg',
		image_mobile: '/blog/social-media-gif-strategy.svg',
	},
	{
		id: 5,
		title: 'GIFs for Business: The Complete Marketing and Communication Guide',
		description:
			'Discover how businesses use GIFs for marketing, internal communication, and customer engagement. Learn strategies, best practices, and ROI optimization techniques.',
		date: '2025-08-10',
		author: 'EasyGIFMaker Team',
		path: '/blog/gif-for-business-marketing',
		tags: ['Business Marketing', 'Corporate Communication', 'ROI Strategy'],
		image: '/blog/gif-for-business-marketing.svg',
		image_mobile: '/blog/gif-for-business-marketing.svg',
	},
	{
		id: 6,
		title: 'Creative GIF Design Tutorial: Artistic Techniques and Visual Storytelling',
		description:
			'Learn advanced creative GIF design techniques including color theory, composition, storytelling, and artistic effects to create stunning animated visuals that captivate audiences.',
		date: '2025-08-10',
		author: 'EasyGIFMaker Team',
		path: '/blog/creative-gif-design-tutorial',
		tags: ['Creative Design', 'Visual Arts', 'Animation Tutorial'],
		image: '/blog/creative-gif-design-tutorial.svg',
		image_mobile: '/blog/creative-gif-design-tutorial.svg',
	},
	{
		id: 7,
		title: 'GIF Accessibility Guide: Creating Inclusive Animated Content for All Users',
		description:
			'Learn how to create accessible GIFs that work for users with disabilities. Comprehensive guide covering WCAG compliance, seizure safety, and inclusive design principles.',
		date: '2025-08-10',
		author: 'EasyGIFMaker Team',
		path: '/blog/gif-accessibility-guide',
		tags: ['Accessibility', 'Inclusive Design', 'WCAG Compliance'],
		image: '/blog/gif-accessibility-guide.svg',
		image_mobile: '/blog/gif-accessibility-guide.svg',
	},
	{
		id: 8,
		title: 'How to Make GIFs from Videos Instantly',
		description:
			'Learn how to convert your favorite video moments into GIFs using EasyGIFMaker. Step-by-step guide for beginners.',
		date: '2025-07-14',
		author: 'EasyGIFMaker Team',
		path: '/blog/how-to-make-gifs-from-videos',
		tags: ['GIF Maker', 'Video to GIF', 'Tutorial'],
		image: '/blog/how-to-make-gifs-from-videos.webp',
		image_mobile: '/blog/how-to-make-gifs-from-videos.webp',
	},
	{
		id: 9,
		title: 'Top 5 Tips for Optimizing GIFs for Social Media',
		description:
			'Discover the best practices for creating fast-loading, high-quality GIFs that stand out on every platform.',
		date: '2025-07-10',
		author: 'EasyGIFMaker Team',
		path: '/blog/top-5-gif-optimization-tips',
		tags: ['Optimize GIF', 'Social Media', 'Tips'],
		image: '/blog/top-5-gif-optimization-tips-2.webp',
		image_mobile: '/blog/top-5-gif-optimization-tips-2.webp',
	},
	{
		id: 10,
		title: 'Adding Text and Captions to GIFs: A Complete Guide',
		description:
			'Make your GIFs more engaging with custom text overlays, captions, and branding. See how EasyGIFMaker makes it easy.',
		date: '2025-07-05',
		author: 'EasyGIFMaker Team',
		path: '/blog/add-text-to-gifs-guide',
		tags: ['Add Text', 'GIF Editor', 'Branding'],
		image: '/blog/add-text-to-gifs-guide.webp',
		image_mobile: '/blog/add-text-to-gifs-guide_mobile.webp',
	},
	{
		id: 11,
		title: 'Master the Art of Adding Text to GIFs',
		description: 'Professional guide to creating engaging animated text overlays.',
		date: '2025-08-10',
		author: 'EasyGIFMaker Team',
		path: '/blog/master-the-art-of-adding-text-to-gifs',
		tags: ['Typography', 'Text Overlay', 'Animation'],
		image: '/blog/master-the-art-of-adding-text-to-gifs.svg',
		image_mobile: '/blog/master-the-art-of-adding-text-to-gifs.svg',
	},
	{
		id: 12,
		title: 'Professional GIF Cropping and Composition Guide',
		description: 'Master the art of framing and composition for animated content.',
		date: '2025-08-10',
		author: 'EasyGIFMaker Team',
		path: '/blog/professional-gif-cropping-and-composition-guide',
		tags: ['Cropping', 'Composition', 'Aspect Ratios'],
		image: '/blog/professional-gif-cropping-and-composition-guide.svg',
		image_mobile: '/blog/professional-gif-cropping-and-composition-guide.svg',
	},
	{
		id: 13,
		title: 'Complete Guide to GIF Resizing and Scaling',
		description: 'Master dimension optimization for every platform and use case.',
		date: '2025-08-10',
		author: 'EasyGIFMaker Team',
		path: '/blog/complete-guide-to-resize-gif',
		tags: ['Resize', 'Dimensions', 'Scaling'],
		image: '/blog/complete-guide-to-resize-gif.svg',
		image_mobile: '/blog/complete-guide-to-resize-gif.svg',
	},
];

// Structured data for SEO
const blogStructuredData = {
	'@context': 'https://schema.org',
	'@type': 'Blog',
	name: 'EasyGIFMaker Blog',
	url: 'https://easygifmaker.com/blog',
	description:
		'Read the latest articles, tips, and tutorials about GIF creation, video conversion, optimization, and more from EasyGIFMaker.',
	blogPost: blogPosts.map(post => ({
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.description,
		author: {
			'@type': 'Organization',
			name: post.author,
		},
		datePublished: post.date,
		url: `https://easygifmaker.com${post.path}`,
		keywords: post.tags.join(', '),
	})),
};

// Additional Article schema for the blog page itself
const articleStructuredData = {
	'@context': 'https://schema.org',
	'@type': 'Article',
	headline: 'EasyGIFMaker Blog - GIF Creation Tips, Tutorials & Updates',
	description: 'Read the latest articles, tips, and tutorials about GIF creation, video conversion, optimization, and more from EasyGIFMaker.',
	author: {
		'@type': 'Organization',
		name: 'EasyGIFMaker'
	},
	publisher: {
		'@type': 'Organization',
		name: 'EasyGIFMaker',
		url: 'https://easygifmaker.com'
	},
	datePublished: '2025-01-01',
	dateModified: '2025-01-01',
	url: 'https://easygifmaker.com/blog'
};

export default function Blog() {
	const featuredPost = blogPosts.find(post => post.featured);
	const regularPosts = blogPosts.filter(post => !post.featured);
	const collectionStructuredData = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'EasyGIFMaker Blog',
		url: 'https://easygifmaker.com/blog',
		about: 'A collection of articles about GIF creation, optimization, and strategy.',
		hasPart: blogPosts.map(post => ({
			'@type': 'BlogPosting',
			headline: post.title,
			url: `https://easygifmaker.com${post.path}`,
			datePublished: post.date
		}))
	};

	return (
		<>
					<Meta
						title="EasyGIFMaker Blog - GIF Creation Tips, Tutorials & Updates"
						description="Read the latest articles, tips, and tutorials about GIF creation, video conversion, optimization, and more from EasyGIFMaker."
						keywords="gif blog, gif tutorials, gif tips, video to gif, optimize gif, add text to gif, easygifmaker blog"
						url="/blog"
						image="https://easygifmaker.com/og-image.png"
						imageAlt="EasyGIFMaker Blog"
					/>
					<Helmet>
						<meta property="og:type" content="website" />
						<script type="application/ld+json">{JSON.stringify(blogStructuredData)}</script>
						<script type="application/ld+json">{JSON.stringify(articleStructuredData)}</script>
						<script type="application/ld+json">{JSON.stringify(collectionStructuredData)}</script>
					</Helmet>
			<main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" aria-label="Blog Main Content">
				<div className="container mx-auto px-4 py-12">
					<a
						href="#main-content"
						className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-700 text-white px-4 py-2 rounded z-50"
					>
						Skip to main content
					</a>
					
					{/* Hero Section */}
					<header className="relative text-center mb-16" aria-label="Blog Header">
						<div className="absolute inset-0 pointer-events-none select-none">
							<div className="w-full h-64 bg-gradient-to-b from-blue-100/40 via-purple-100/20 to-white/0 blur-3xl rounded-b-3xl"></div>
						</div>
						<div className="relative z-10">
							<div className="flex items-center justify-center gap-3 mb-6">
								<BookOpen className="w-12 h-12 text-blue-600" />
								<Sparkles className="w-8 h-8 text-purple-500" />
							</div>
							<h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 drop-shadow-sm tracking-tight">
								EasyGIFMaker Blog
							</h1>
							<p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
								Discover expert tips, tutorials, and updates on GIF creation,
								video conversion, optimization, and more. Stay inspired and make
								the most of EasyGIFMaker!
							</p>
							<div className="flex items-center justify-center gap-6 text-sm text-gray-600">
								<span className="flex items-center gap-2">
									<Calendar className="w-4 h-4" />
									Latest: {featuredPost?.date}
								</span>
								<span className="flex items-center gap-2">
									<User className="w-4 h-4" />
									{blogPosts.length} Articles
								</span>
							</div>
						</div>
					</header>

					<main id="main-content">
						{/* Featured Post */}
						{featuredPost && (
							<section className="mb-16" aria-label="Featured Post">
								<div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
									<div className="md:flex">
										<div className="md:w-1/2">
											<div className="relative h-64 md:h-full overflow-hidden">
												<picture>
													<source media="(max-width: 640px)" srcSet={featuredPost.image_mobile} />
													<img 
														src={featuredPost.image} 
														alt={featuredPost.title}
														className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
														loading="lazy"
													/>
												</picture>
												<div className="absolute top-4 left-4">
													<span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full">
														FEATURED
													</span>
												</div>
											</div>
										</div>
										<div className="md:w-1/2 p-8 flex flex-col justify-center">
											<div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
												<Calendar className="w-4 h-4" />
												<time dateTime={featuredPost.date}>{featuredPost.date}</time>
												<span>•</span>
												<User className="w-4 h-4" />
												{featuredPost.author}
											</div>
											<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
												{featuredPost.title}
											</h2>
											<p className="text-gray-600 mb-6 leading-relaxed">
												{featuredPost.description}
											</p>
											<div className="flex flex-wrap gap-2 mb-6">
												{featuredPost.tags.map(tag => (
													<span
														key={tag}
														className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs font-semibold"
													>
														{tag}
													</span>
												))}
											</div>
											<Link
												to={featuredPost.path}
												className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
												aria-label={`Read more about ${featuredPost.title}`}
											>
												Read Full Article
												<ArrowRight className="w-4 h-4" />
											</Link>
										</div>
									</div>
								</div>
							</section>
						)}

						{/* Regular Posts Grid */}
						<section aria-label="Blog Posts">
							<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Articles</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
								{regularPosts.map(post => (
									<article
										key={post.id}
										className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
										aria-labelledby={`blog-title-${post.id}`}
									>
										<div className="relative h-48 overflow-hidden">
											<picture>
												<source media="(max-width: 640px)" srcSet={post.image_mobile} />
												<img 
													src={post.image} 
													alt={post.title}
													className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
													loading="lazy"
												/>
											</picture>
											<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										</div>
										<div className="p-6">
											<div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
												<Calendar className="w-4 h-4" />
												<time dateTime={post.date}>{post.date}</time>
												<span>•</span>
												<User className="w-4 h-4" />
												{post.author}
											</div>
											<h3
												id={`blog-title-${post.id}`}
												className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight"
											>
												{post.title}
											</h3>
											<p className="text-gray-600 mb-4 leading-relaxed">
												{post.description}
											</p>
											<div className="flex flex-wrap gap-2 mb-4">
												{post.tags.map(tag => (
													<span
														key={tag}
														className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
													>
														{tag}
													</span>
												))}
											</div>
											<Link
												to={post.path}
												className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
												aria-label={`Read more about ${post.title}`}
											>
												Read More
												<ArrowRight className="w-4 h-4" />
											</Link>
										</div>
									</article>
								))}
							</div>
						</section>

						{/* Call to Action Section */}
						<section
							className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl"
							aria-labelledby="cta-title"
						>
							<h2
								id="cta-title"
								className="text-3xl md:text-4xl font-bold mb-4"
							>
								Ready to Create Amazing GIFs?
							</h2>
							<p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
								Start using EasyGIFMaker's powerful tools to create, edit, and optimize your GIFs today!
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link
									to="/gif-maker"
									className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
								>
									Try GIF Maker
									<ArrowRight className="w-4 h-4" />
								</Link>
								<Link
									to="/video-to-gif"
									className="inline-flex items-center gap-2 px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300"
								>
									Video to GIF
									<ArrowRight className="w-4 h-4" />
								</Link>
							</div>
						</section>
					</main>
				</div>
			</main>
		</>
	);
}