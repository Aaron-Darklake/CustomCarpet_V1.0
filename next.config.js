/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          { protocol: 'https', hostname: 'amplify-ecommercev01-aaro-amplifystorageamplifysto-xgc8aa4oz5ma.s3.eu-central-1.amazonaws.com' },
          { protocol: 'https', hostname: 'amplify-d3ojg15ybkzea4-ma-amplifystorageamplifysto-htnnfhiveugy.s3.eu-central-1.amazonaws.com' },
        ],
      },
}

module.exports = nextConfig
