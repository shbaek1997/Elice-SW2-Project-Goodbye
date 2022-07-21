/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		domains: [
			'images.unsplash.com',
			'basicincomekorea.org',
			'media.istockphoto.com',
			'd3vx2tv8yhh0mv.cloudfront.net',
		],
	},
	async rewrites() {
		return [
			{
				destination: 'http://localhost:5000/api/:path*',
				source: '/api/:path*',
			},
		];
	},
};

module.exports = nextConfig;
