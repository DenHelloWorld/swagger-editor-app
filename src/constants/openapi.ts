import { OpenAPIV3 } from 'openapi-types';

export const HTTP_METHODS = new Set<string>(
  Object.values(OpenAPIV3.HttpMethods),
);
