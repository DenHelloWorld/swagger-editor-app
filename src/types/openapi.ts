import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

export type OpenAPIDocument = OpenAPIV2.Document | OpenAPIV3.Document;

export type OpenAPIOperation =
  | OpenAPIV2.OperationObject
  | OpenAPIV3.OperationObject;

export type OpenAPIPathItem =
  | OpenAPIV2.PathItemObject
  | OpenAPIV3.PathItemObject;
