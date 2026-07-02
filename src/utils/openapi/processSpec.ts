import type { OpenAPI } from 'openapi-types';
import type {
  OpenAPIPathItem,
  ProcessedEndpoint,
  ProcessedGroup,
  ProcessedSpec,
  ResolvedParameter,
  SpecVersion,
} from '@/types/openapi';
import { HTTP_METHODS } from '@/constants/openapi';
import { isSwaggerV2 } from './guards';
import { mergeParameters } from './parameters';
import { getV2RequestBody, getV3RequestBody } from './requestBody';
import { getV2Responses, getV3Responses } from './responses';

/**
 * Transforms a raw OpenAPI document into a normalized `ProcessedSpec` ready for rendering.
 * Groups endpoints by path, merges parameters, and normalizes request bodies.
 */
export function processSpec(doc: OpenAPI.Document): ProcessedSpec {
  const version: SpecVersion = isSwaggerV2(doc) ? 'v2' : 'v3';
  const getRequestBody = isSwaggerV2(doc) ? getV2RequestBody : getV3RequestBody;
  const getResponses = isSwaggerV2(doc) ? getV2Responses : getV3Responses;

  const groups: ProcessedGroup[] = Object.entries(doc.paths ?? {})
    .filter(([, pathItem]) => pathItem != null)
    .map(([path, pathItem]) => {
      const pi = pathItem as OpenAPIPathItem;
      const endpoints: ProcessedEndpoint[] = Object.entries(pi)
        .filter(([method]) => HTTP_METHODS.has(method))
        .map(([method, operation]) => {
          const op = operation;
          return {
            method,
            path,
            summary: op.summary,
            description: op.description,
            parameters: mergeParameters(
              (pi.parameters ?? []) as ResolvedParameter[],
              (op.parameters ?? []) as ResolvedParameter[],
            ),
            requestBody: getRequestBody(op),
            responses: getResponses(op),
          };
        });
      return { path, endpoints };
    });

  return { version, groups };
}
