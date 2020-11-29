import { APIGatewayAuthorizerResult } from 'aws-lambda';

export const createAuthorizerResult = (
  principalId: string,
  resource: string,
  effect = 'Deny',
): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});
