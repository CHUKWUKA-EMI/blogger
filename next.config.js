module.exports = {
	env: {
		API_URL: "http://localhost:5000/api/v1",
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/posts",
				permanent: true,
			},
		];
	},
};
