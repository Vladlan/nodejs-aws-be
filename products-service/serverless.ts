import type { Serverless } from 'serverless/aws';
const dotenv = require('dotenv').config( {
  path: '.env'
} );
const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = dotenv.parsed;

const serverlessConfiguration: Serverless = {
  service: {
    name: 'products-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      excludeFiles: 'src/**/*.spec.[t|j]s'
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DB_HOST, 
      DB_PORT, 
      DB_DATABASE,
      DB_USERNAME,
      DB_PASSWORD
    },
  },
  functions: {
    getAllProducts: {
      handler: 'handlers/get-all-products.getAllProducts',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
          }
        }
      ]
    },
    getProductById: {
      handler: 'handlers/get-product-by-id.getProductById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
            cors: true,
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
