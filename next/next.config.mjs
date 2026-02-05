/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'preprod-api.webtinix.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      { hostname: process.env.IMAGE_HOSTNAME || 'localhost' }
    ],
  },
  pageExtensions: ['ts', 'tsx'],
  async redirects() {
    let redirections = [];
    try {
      const res = await fetch(
        `${process.env.IMAGE_HOSTNAME}/api/redirections`
      );
      const result = await res.json();
      const redirectItems = result.data.map(({ source, destination }) => {
        return {
          source: `/:locale${source}`,
          destination: `/:locale${destination}`,
          permanent: false,
        };
      });

      redirections = redirections.concat(redirectItems);

      return redirections;
    } catch (error) {
      return [];
    }
  },
};

export default nextConfig;