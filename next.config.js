/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require('next-pwa')({
	dest: 'public',
	disable: !isProd,
});

const nextConfig = {
	experimental: {
		appDir: true,
	},
	images: {
		domains: [
			'localhost',
			'avatars.githubusercontent.com',
			'lh3.googleusercontent.com',
			'res.cloudinary.com',
		],
	},
};

module.exports = withPWA(nextConfig);
