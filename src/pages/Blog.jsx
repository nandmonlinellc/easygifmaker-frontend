import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Link } from 'react-router-dom';

// Example blog posts data
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
	},
	{
		id: 2,
		title: 'How to Make GIFs from Videos Instantly',
		description:
			'Learn how to convert your favorite video moments into GIFs using EasyGIFMaker. Step-by-step guide for beginners.',
		date: '2025-07-14',
		author: 'EasyGIFMaker Team',
		path: '/blog/how-to-make-gifs-from-videos',
		tags: ['GIF Maker', 'Video to GIF', 'Tutorial'],
	},
	{
		id: 3,
		title: 'Top 5 Tips for Optimizing GIFs for Social Media',
		description:
			'Discover the best practices for creating fast-loading, high-quality GIFs that stand out on every platform.',
		date: '2025-07-10',
		author: 'EasyGIFMaker Team',
		path: '/blog/top-5-gif-optimization-tips',
		tags: ['Optimize GIF', 'Social Media', 'Tips'],
	},
	{
		id: 4,
		title: 'Adding Text and Captions to GIFs: A Complete Guide',
		description:
			'Make your GIFs more engaging with custom text overlays, captions, and branding. See how EasyGIFMaker makes it easy.',
		date: '2025-07-05',
		author: 'EasyGIFMaker Team',
		path: '/blog/add-text-to-gifs-guide',
		tags: ['Add Text', 'GIF Editor', 'Branding'],
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

export default function Blog() {
	return (
		<>
			<Helmet>
				<title>
					EasyGIFMaker Blog - GIF Creation Tips, Tutorials & Updates
				</title>
				<meta
					name="description"
					content="Read the latest articles, tips, and tutorials about GIF creation, video conversion, optimization, and more from EasyGIFMaker."
				/>
				<meta
					name="keywords"
					content="gif blog, gif tutorials, gif tips, video to gif, optimize gif, add text to gif, easygifmaker blog"
				/>
				<link rel="canonical" href="https://easygifmaker.com/blog" />
				<meta
					property="og:title"
					content="EasyGIFMaker Blog - GIF Creation Tips, Tutorials & Updates"
				/>
				<meta
					property="og:description"
					content="Read the latest articles, tips, and tutorials about GIF creation, video conversion, optimization, and more from EasyGIFMaker."
				/>
				<meta property="og:url" content="https://easygifmaker.com/blog" />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<script
					type="application/ld+json"
				>{JSON.stringify(blogStructuredData)}</script>
			</Helmet>
			<main className="container mx-auto px-4 py-12" aria-label="Blog Main Content">
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-700 text-white px-4 py-2 rounded z-50"
				>
					Skip to main content
				</a>
				<header className="relative text-center mb-16" aria-label="Blog Header">
					<div className="absolute inset-0 pointer-events-none select-none">
						<div className="w-full h-48 bg-gradient-to-b from-blue-100/60 via-white/0 to-white/0 blur-2xl rounded-b-3xl"></div>
					</div>
					<h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-4 drop-shadow-sm tracking-tight">
						EasyGIFMaker Blog
					</h1>
					<p className="text-2xl text-gray-700 mb-8 max-w-2xl mx-auto font-medium">
						Discover expert tips, tutorials, and updates on GIF creation,
						video conversion, optimization, and more. Stay inspired and make
						the most of EasyGIFMaker!
					</p>
				</header>
				<main id="main-content">
					<section aria-label="Blog Posts">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
							{blogPosts.map(post => (
								<article
									key={post.id}
									className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-blue-200 flex flex-col justify-between"
									aria-labelledby={`blog-title-${post.id}`}
								>
									<CardHeader>
										<CardTitle
											id={`blog-title-${post.id}`}
											className="text-xl group-hover:text-blue-600 transition-colors"
										>
											{post.title}
										</CardTitle>
										<CardDescription className="text-gray-500 text-sm mb-2">
											<time dateTime={post.date}>{post.date}</time> &middot;{' '}
											{post.author}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-gray-700 mb-4">
											{post.description}
										</p>
										<div
											className="flex flex-wrap gap-2"
											aria-label="Tags"
										>
											{post.tags.map(tag => (
												<span
													key={tag}
													className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold"
												>
													{tag}
												</span>
											))}
										</div>
										<div className="mt-4">
											<Link
												to={post.path}
												className="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors text-sm"
												aria-label={`Read more about ${post.title}`}
											>
												Read More
											</Link>
										</div>
									</CardContent>
								</article>
							))}
						</div>
					</section>
					<section
						className="bg-blue-50 border border-blue-200 rounded-xl p-8 shadow mb-12 text-left"
						aria-labelledby="why-blog-title"
					>
						<h2
							id="why-blog-title"
							className="text-2xl font-bold text-blue-700 mb-3"
						>
							Why Start a Blog on EasyGIFMaker?
						</h2>
						<ul className="list-disc pl-6 text-blue-900 space-y-2 mb-4">
							<li>
								Share expert tips and tutorials to help users get the most out
								of your tools
							</li>
							<li>
								Boost your SEO and attract new visitors searching for GIF
								solutions
							</li>
							<li>Announce new features, updates, and improvements</li>
							<li>Build a community around GIF creation and editing</li>
							<li>
								Answer common questions and showcase creative use cases
							</li>
						</ul>
						<div className="mt-6 text-blue-800 text-base">
							<b>Popular Blog Topics:</b> <br />
							<span className="block mt-1">
								• How to convert videos to GIFs
							</span>
							<span className="block">
								• Best practices for optimizing GIFs
							</span>
							<span className="block">
								• Adding text and branding to GIFs
							</span>
							<span className="block">
								• Social media GIF strategies
							</span>
							<span className="block">
								• User stories and creative projects
							</span>
						</div>
					</section>
				</main>
			</main>
		</>
	);
}
