import type {Serverless} from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
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
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::bucket-for-task-5/*'
      }
    ]
  },
  functions: {
    importProductsFile: {
      handler: 'handlers/import-products-file.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import/',
            cors: true,
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
