import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';
import 'source-map-support/register';
import { UNAUTHORIZED } from '../../../shared/constants';
import { logLambdaArgs } from '../../../shared/utils';
import { createAuthorizerResult } from '../../utils/create-authorizer-result';

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
    const result = createAuthorizerResult(authJWT, methodArn, effect);
    callback(null, result);
  } catch (error) {
    console.log('Error:', error);
    callback(UNAUTHORIZED);
  }
};
