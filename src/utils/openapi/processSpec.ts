import type { OpenAPI } from 'openapi-types';
import type {
  OpenAPIOperation,
  OpenAPIPathItem,
  ProcessedEndpoint,
  ProcessedGroup,
  ProcessedSpec,
  SpecVersion,
} from '@/types/openapi';
import { HTTP_METHODS } from '@/constants/openapi';
import { isSwaggerV2 } from './guards';
import { mergeParameters } from './parameters';
import { getV2RequestBody, getV3RequestBody } from './requestBody';

function getSpecVersion(doc: OpenAPI.Document): SpecVersion {
  if (isSwaggerV2(doc)) return 'v2';
  return 'v3';
}

/**
 * Transforms a raw OpenAPI document into a normalized `ProcessedSpec` ready for rendering.
 * Groups endpoints by path, merges parameters, and normalizes request bodies.
 */
export function processSpec(doc: OpenAPI.Document): ProcessedSpec {
  const version = getSpecVersion(doc);
  const getRequestBody = version === 'v2' ? getV2RequestBody : getV3RequestBody;

  const groups: ProcessedGroup[] = Object.entries(doc.paths ?? {})
    .filter(([, pathItem]) => pathItem != null)
    .map(([path, pathItem]) => {
      const pi = pathItem as OpenAPIPathItem;
      const endpoints: ProcessedEndpoint[] = Object.entries(pi)
        .filter(([method]) => HTTP_METHODS.has(method))
        .map(([method, operation]) => {
          const op = operation as OpenAPIOperation;
          return {
            method,
            path,
            summary: op.summary,
            description: op.description,
            parameters: mergeParameters(
              pi.parameters ?? [],
              op.parameters ?? [],
            ),
            requestBody: getRequestBody(op),
          };
        });
      return { path, endpoints };
    });

  return { version, groups };
}
