import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import type { OpenAPIDocument } from '@/types/openapi';

export const MOCK_SPEC_V3: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: { title: 'Pet Store (v3)', version: '1.0.0' },
  paths: {
    '/pets': {
      get: { summary: 'List all pets', tags: ['Pets'], responses: {} },
      post: { summary: 'Create a pet', tags: ['Pets'], responses: {} },
    },
    '/pets/{id}': {
      get: { summary: 'Get pet by ID', tags: ['Pets'], responses: {} },
      put: { summary: 'Update pet', tags: ['Pets'], responses: {} },
      delete: { summary: 'Delete pet', tags: ['Pets'], responses: {} },
    },
    '/pets/{id}/photos': {
      get: { summary: 'List pet photos', tags: ['Photos'], responses: {} },
      post: { summary: 'Upload photo', tags: ['Photos'], responses: {} },
      delete: { summary: 'Delete photo', tags: ['Photos'], responses: {} },
    },
    '/pets/{id}/tags': {
      get: { summary: 'List pet tags', tags: ['Tags'], responses: {} },
      post: { summary: 'Add tag to pet', tags: ['Tags'], responses: {} },
    },
    '/pets/{id}/tags/{tagId}': {
      delete: { summary: 'Remove tag from pet', tags: ['Tags'], responses: {} },
    },
    '/categories': {
      get: {
        summary: 'List all categories',
        tags: ['Categories'],
        responses: {},
      },
      post: { summary: 'Create category', tags: ['Categories'], responses: {} },
    },
    '/categories/{id}': {
      get: {
        summary: 'Get category by ID',
        tags: ['Categories'],
        responses: {},
      },
      put: { summary: 'Update category', tags: ['Categories'], responses: {} },
      delete: {
        summary: 'Delete category',
        tags: ['Categories'],
        responses: {},
      },
    },
    '/users': {
      get: { summary: 'List all users', tags: ['Users'], responses: {} },
      post: { summary: 'Create user', tags: ['Users'], responses: {} },
    },
    '/users/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: { summary: 'Get user by ID', tags: ['Users'], responses: {} },
      put: { summary: 'Update user', tags: ['Users'], responses: {} },
      delete: { summary: 'Delete user', tags: ['Users'], responses: {} },
    },
    '/users/{id}/favorites': {
      get: { summary: 'List favorite pets', tags: ['Users'], responses: {} },
      post: { summary: 'Add to favorites', tags: ['Users'], responses: {} },
    },
  },
};

export const MOCK_SPEC_V2: OpenAPIV2.Document = {
  swagger: '2.0',
  info: { title: 'Book Store (v2)', version: '1.0.0' },
  host: 'api.example.com',
  basePath: '/v1',
  paths: {
    '/books': {
      get: { summary: 'List all books', tags: ['Books'], responses: {} },
      post: { summary: 'Add a book', tags: ['Books'], responses: {} },
    },
    '/books/{id}': {
      get: { summary: 'Get book by ID', tags: ['Books'], responses: {} },
      patch: { summary: 'Update book', tags: ['Books'], responses: {} },
      delete: { summary: 'Delete book', tags: ['Books'], responses: {} },
    },
    '/books/{id}/reviews': {
      get: { summary: 'List book reviews', tags: ['Reviews'], responses: {} },
      post: { summary: 'Add review', tags: ['Reviews'], responses: {} },
    },
    '/books/{id}/reviews/{reviewId}': {
      get: { summary: 'Get review', tags: ['Reviews'], responses: {} },
      put: { summary: 'Update review', tags: ['Reviews'], responses: {} },
      delete: { summary: 'Delete review', tags: ['Reviews'], responses: {} },
    },
    '/authors': {
      get: { summary: 'List all authors', tags: ['Authors'], responses: {} },
      post: { summary: 'Add author', tags: ['Authors'], responses: {} },
    },
    '/authors/{id}': {
      get: { summary: 'Get author by ID', tags: ['Authors'], responses: {} },
      patch: { summary: 'Update author', tags: ['Authors'], responses: {} },
      delete: { summary: 'Delete author', tags: ['Authors'], responses: {} },
    },
    '/authors/{id}/books': {
      get: { summary: "List author's books", tags: ['Authors'], responses: {} },
    },
    '/genres': {
      get: { summary: 'List all genres', tags: ['Genres'], responses: {} },
      post: { summary: 'Create genre', tags: ['Genres'], responses: {} },
    },
    '/genres/{id}': {
      get: { summary: 'Get genre by ID', tags: ['Genres'], responses: {} },
      delete: { summary: 'Delete genre', tags: ['Genres'], responses: {} },
    },
    '/orders': {
      get: { summary: 'List all orders', tags: ['Orders'], responses: {} },
      post: { summary: 'Create order', tags: ['Orders'], responses: {} },
    },
    '/orders/{id}': {
      get: { summary: 'Get order by ID', tags: ['Orders'], responses: {} },
      patch: {
        summary: 'Update order status',
        tags: ['Orders'],
        responses: {},
      },
      delete: { summary: 'Cancel order', tags: ['Orders'], responses: {} },
    },
  },
};

// TODO: replace with Zustand store from Feature 3 when ready
// DEV: swap between MOCK_SPEC_V3, MOCK_SPEC_V2, or null to test different states
export function useSchema(): { spec: OpenAPIDocument | null } {
  return { spec: null };
}
