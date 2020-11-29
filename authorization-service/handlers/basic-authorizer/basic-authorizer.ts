import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerHandler,
} from 'aws-lambda';
import 'source-map-support/register';
import { UNAUTHORIZED } from '../../../shared/constants';
import { logLambdaArgs } from '../../../shared/utils';

const getPolicy = (
  principalId,
  resource,
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

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (
  event,
  _context,
  callback,
) => {
  logLambdaArgs(event, _context);
  if (!event.authorizationToken) {
    return callback(UNAUTHORIZED);
  }
  try {
    const { authorizationToken, methodArn } = event;
    const [authScheme, authJWT] = authorizationToken.split(' ');
    if (authScheme !== 'Basic' || !authJWT) {
      callback(UNAUTHORIZED);
      return;
    }
    const [userName, password] = Buffer.from(authJWT, 'base64')
      .toString('utf-8')
      .split(':');
    const validUserPassword = process.env[userName];
    const effect =
      validUserPassword && validUserPassword === password ? 'Allow' : 'Deny';
    const policy = getPolicy(authJWT, methodArn, effect);
    callback(null, policy);
  } catch (error) {
    console.log('Error:', error);
    callback(UNAUTHORIZED);
  }
};
