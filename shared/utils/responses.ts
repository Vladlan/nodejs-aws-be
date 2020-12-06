import { corsHeaders } from './cors-headers';
import { messages } from './messages';

export const getRes500 = (
  body = messages.internalServerError,
  headers = corsHeaders,
) => ({
  statusCode: 500,
  headers,
  body,
});

export const getRes = (statusCode: number, body, headers = corsHeaders) => ({
  statusCode,
  headers,
  body,
});

export const getRes400 = (body, headers = corsHeaders) => ({
  statusCode: 400,
  headers,
  body,
});

export const getRes200 = (body, headers = corsHeaders) => ({
  statusCode: 200,
  headers,
  body,
});
