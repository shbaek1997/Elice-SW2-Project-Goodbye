/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			'images.unsplash.com',
			'basicincomekorea.org',
			'media.istockphoto.com',
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
