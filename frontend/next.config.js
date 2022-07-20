/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
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
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"]
		});
		return config
	},
};

module.exports = nextConfig;
