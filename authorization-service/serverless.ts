import type { Serverless } from 'serverless/aws';
import { EU_WEST_1 } from '../shared/constants';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'authorization-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: EU_WEST_1,
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    basicAuthorizer: {
      handler: 'handlers/index.basicAuthorizer',
    },
  },
  resources: {
    Resources: {},
    Outputs: {
      basicAuthorizerLambdaArn: {
        Value: {
          'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn'],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
