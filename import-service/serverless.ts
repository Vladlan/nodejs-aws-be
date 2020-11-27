import type {Serverless} from 'serverless/aws';
import {S3_BUCKET_NAME, SNS_TOPIC_NAME, SQS_NAME} from "./utils";

const dotenv = require('dotenv').config({
  path: './../.env'
});
const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  CREATE_PRODUCT_SUB_EMAIL,
  CREATE_PRODUCT_SUB_ERRORS_EMAIL
} = dotenv.parsed;
const CATALOG_ITEMS_QUEUE = 'catalogItemsQueue';
const CREATE_PRODUCT_TOPIC = 'createProductTopic';
const CREATE_PRODUCT_SUBSCRIPTION = 'createProductSubscription';
const CREATE_PRODUCT_SUBSCRIPTION_ERRORS = 'createProductSubscriptionErrors';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
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
      DB_HOST,
      DB_PORT,
      DB_DATABASE,
      DB_USERNAME,
      DB_PASSWORD,
      SQS_URL: {
        Ref: CATALOG_ITEMS_QUEUE
      },
      SNS_ARN: {
        Ref: CREATE_PRODUCT_TOPIC
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: `arn:aws:s3:::${S3_BUCKET_NAME}/*`
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::GetAtt': [CATALOG_ITEMS_QUEUE, 'Arn']
        }
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: CREATE_PRODUCT_TOPIC
        }
      }
    ]
  },
  resources: {
    Resources: {
      [CATALOG_ITEMS_QUEUE]: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: SQS_NAME
        }
      },
      [CREATE_PRODUCT_TOPIC]: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: SNS_TOPIC_NAME
        }
      },
      [CREATE_PRODUCT_SUBSCRIPTION]: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: CREATE_PRODUCT_SUB_EMAIL,
          Protocol: 'email',
          TopicArn: {
            Ref: CREATE_PRODUCT_TOPIC
          },
          FilterPolicy: {
            status: ["OK"],
          },
        }
      },
      [CREATE_PRODUCT_SUBSCRIPTION_ERRORS]: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: CREATE_PRODUCT_SUB_ERRORS_EMAIL,
          Protocol: 'email',
          TopicArn: {
            Ref: CREATE_PRODUCT_TOPIC
          },
          FilterPolicy: {
            status: ["ERROR"],
          },
        }
      }
    }
  },
  functions: {
    importProductsFile: {
      handler: 'handlers/index.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import/',
            cors: true,
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handlers/index.importFileParser',
      events: [
        {
          s3: {
            bucket: S3_BUCKET_NAME,
            event: 's3:ObjectCreated:*',
            rules: [
              {prefix: 'uploaded', suffix: '.csv',},
            ],
            existing: true
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handlers/index.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              'Fn::GetAtt': [CATALOG_ITEMS_QUEUE, 'Arn']
            }
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
