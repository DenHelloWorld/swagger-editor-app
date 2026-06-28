import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

export const MOCK_SPEC_V3: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: { title: 'Pet Store (v3)', version: '1.0.0' },
  paths: {
    '/pets': {
      get: {
        summary: 'List all pets',
        description: 'Returns a paginated list of all pets in the store.',
        tags: ['Pets'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Max number of results',
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Number of results to skip',
          },
          {
            name: 'X-Request-ID',
            in: 'header',
            schema: { type: 'string' },
            description: 'Optional request trace ID',
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        summary: 'Create a pet',
        description: 'Creates a new pet record in the store.',
        tags: ['Pets'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'species'],
                properties: {
                  name: { type: 'string', description: 'Pet name' },
                  species: { type: 'string', enum: ['dog', 'cat', 'bird'] },
                  age: { type: 'integer', description: 'Age in years' },
                },
              },
              example: { name: 'Buddy', species: 'dog', age: 3 },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/pets/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Pet ID',
        },
      ],
      get: {
        summary: 'Get pet by ID',
        description: 'Returns a single pet.',
        tags: ['Pets'],
        parameters: [
          {
            name: 'expand',
            in: 'query',
            schema: { type: 'string', enum: ['photos', 'tags', 'all'] },
          },
          {
            name: 'session_id',
            in: 'cookie',
            schema: { type: 'string' },
            description: 'Session cookie',
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      put: {
        summary: 'Update pet',
        description: 'Updates an existing pet record.',
        tags: ['Pets'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  species: { type: 'string', enum: ['dog', 'cat', 'bird'] },
                  age: { type: 'integer' },
                },
              },
              example: { name: 'Buddy', species: 'cat', age: 4 },
            },
          },
        },
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        summary: 'Delete pet',
        description: 'Permanently removes a pet from the store.',
        tags: ['Pets'],
        responses: { 204: { description: 'No Content' } },
      },
    },
    '/pets/{id}/photos': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Pet ID',
        },
      ],
      get: {
        summary: 'List pet photos',
        tags: ['Photos'],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        summary: 'Upload photo',
        tags: ['Photos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url'],
                properties: {
                  url: { type: 'string', description: 'Photo URL' },
                  caption: { type: 'string' },
                },
              },
              example: {
                url: 'https://example.com/photo.jpg',
                caption: 'Playing fetch',
              },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
      delete: {
        summary: 'Delete photo',
        tags: ['Photos'],
        responses: { 204: { description: 'No Content' } },
      },
    },
    '/pets/{id}/tags': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Pet ID',
        },
      ],
      get: {
        summary: 'List pet tags',
        tags: ['Tags'],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        summary: 'Add tag to pet',
        tags: ['Tags'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', description: 'Tag name' },
                },
              },
              example: { name: 'vaccinated' },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/pets/{id}/tags/{tagId}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        {
          name: 'tagId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      delete: {
        summary: 'Remove tag from pet',
        tags: ['Tags'],
        responses: { 204: { description: 'No Content' } },
      },
    },
    '/categories': {
      get: {
        summary: 'List all categories',
        tags: ['Categories'],
        parameters: [
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by name',
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        summary: 'Create category',
        tags: ['Categories'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                },
              },
              example: { name: 'Exotic', description: 'Exotic pets' },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/categories/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'Category ID',
        },
      ],
      get: {
        summary: 'Get category by ID',
        tags: ['Categories'],
        responses: { 200: { description: 'OK' } },
      },
      put: {
        summary: 'Update category',
        tags: ['Categories'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                },
              },
              example: { name: 'Exotic', description: 'Updated description' },
            },
          },
        },
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        summary: 'Delete category',
        tags: ['Categories'],
        responses: { 204: { description: 'No Content' } },
      },
    },
    '/users': {
      get: {
        summary: 'List all users',
        tags: ['Users'],
        parameters: [
          {
            name: 'role',
            in: 'query',
            schema: { type: 'string', enum: ['admin', 'user'] },
          },
          {
            name: 'Authorization',
            in: 'header',
            required: true,
            schema: { type: 'string' },
          },
          { name: 'locale', in: 'cookie', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        summary: 'Create user',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' },
                  role: { type: 'string', enum: ['admin', 'user'] },
                },
              },
              example: {
                email: 'user@example.com',
                password: 'secret',
                role: 'user',
              },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/users/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: {
        summary: 'Get user by ID',
        tags: ['Users'],
        parameters: [
          {
            name: 'Authorization',
            in: 'header',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      put: {
        summary: 'Update user',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  role: { type: 'string', enum: ['admin', 'user'] },
                },
              },
              example: { email: 'updated@example.com', role: 'admin' },
            },
          },
        },
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        summary: 'Delete user',
        tags: ['Users'],
        responses: { 204: { description: 'No Content' } },
      },
    },
    '/users/{id}/favorites': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: {
        summary: 'List favorite pets',
        tags: ['Users'],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        summary: 'Add to favorites',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['petId'],
                properties: {
                  petId: { type: 'string', description: 'Pet ID to add' },
                },
              },
              example: { petId: 'abc123' },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
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
      get: {
        summary: 'List all books',
        description: 'Returns a paginated list of all books in the store.',
        tags: ['Books'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            type: 'integer',
            description: 'Max number of results',
          },
          {
            name: 'offset',
            in: 'query',
            type: 'integer',
            description: 'Number of results to skip',
          },
          {
            name: 'genre',
            in: 'query',
            type: 'string',
            description: 'Filter by genre',
          },
          {
            name: 'X-Api-Key',
            in: 'header',
            type: 'string',
            required: true,
            description: 'API key',
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        summary: 'Add a book',
        description: 'Adds a new book to the store catalog.',
        tags: ['Books'],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['title', 'author'],
              properties: {
                title: { type: 'string', description: 'Book title' },
                author: { type: 'string', description: 'Author name' },
                genre: { type: 'string' },
                year: { type: 'integer' },
              },
              example: {
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                genre: 'fiction',
                year: 1925,
              },
            },
          },
        ],
        responses: { 201: { description: 'Created' } },
      },
    },
    '/books/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          type: 'integer',
          required: true,
          description: 'Book ID',
        },
      ],
      get: {
        summary: 'Get book by ID',
        tags: ['Books'],
        parameters: [
          {
            name: 'X-Api-Key',
            in: 'header',
            type: 'string',
            required: true,
            description: 'API key',
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      patch: {
        summary: 'Update book',
        tags: ['Books'],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                genre: { type: 'string' },
                year: { type: 'integer' },
              },
              example: { title: 'Dune', genre: 'Science Fiction', year: 1965 },
            },
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        summary: 'Delete book',
        tags: ['Books'],
        responses: { 204: { description: 'No Content' } },
      },
    },
    '/books/{id}/reviews': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          type: 'integer',
          required: true,
          description: 'Book ID',
        },
      ],
      get: {
        summary: 'List book reviews',
        tags: ['Reviews'],
        parameters: [
          {
            name: 'rating',
            in: 'query',
            type: 'integer',
            description: 'Filter by rating (1-5)',
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        summary: 'Add review',
        tags: ['Reviews'],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['rating', 'text'],
              properties: {
                rating: { type: 'integer', description: 'Rating from 1 to 5' },
                text: { type: 'string', description: 'Review text' },
              },
            },
          },
        ],
        responses: { 201: { description: 'Created' } },
      },
    },
    '/books/{id}/reviews/{reviewId}': {
      parameters: [
        { name: 'id', in: 'path', type: 'integer', required: true },
        { name: 'reviewId', in: 'path', type: 'integer', required: true },
      ],
      get: {
        summary: 'Get review',
        tags: ['Reviews'],
        responses: { 200: { description: 'OK' } },
      },
      put: {
        summary: 'Update review',
        tags: ['Reviews'],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              properties: {
                rating: { type: 'integer' },
                text: { type: 'string' },
              },
            },
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        summary: 'Delete review',
        tags: ['Reviews'],
        responses: { 204: { description: 'No Content' } },
      },
    },
    '/authors': {
      get: {
        summary: 'List all authors',
        tags: ['Authors'],
        parameters: [
          {
            name: 'search',
            in: 'query',
            type: 'string',
            description: 'Search by name',
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        summary: 'Add author',
        tags: ['Authors'],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string' },
                bio: { type: 'string' },
              },
            },
          },
        ],
        responses: { 201: { description: 'Created' } },
      },
    },
    '/authors/{id}': {
      parameters: [{ name: 'id', in: 'path', type: 'integer', required: true }],
      get: {
        summary: 'Get author by ID',
        tags: ['Authors'],
        responses: { 200: { description: 'OK' } },
      },
      patch: {
        summary: 'Update author',
        tags: ['Authors'],
        parameters: [
          {
            name: 'body',
            in: 'body',
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                bio: { type: 'string' },
              },
            },
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        summary: 'Delete author',
        tags: ['Authors'],
        responses: { 204: { description: 'No Content' } },
      },
    },
    '/authors/{id}/books': {
      parameters: [{ name: 'id', in: 'path', type: 'integer', required: true }],
      get: {
        summary: "List author's books",
        tags: ['Authors'],
        parameters: [{ name: 'limit', in: 'query', type: 'integer' }],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/orders': {
      get: {
        summary: 'List all orders',
        tags: ['Orders'],
        parameters: [
          { name: 'status', in: 'query', type: 'string' },
          {
            name: 'Authorization',
            in: 'header',
            type: 'string',
            required: true,
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        summary: 'Create order',
        tags: ['Orders'],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['bookId', 'quantity'],
              properties: {
                bookId: { type: 'integer' },
                quantity: { type: 'integer' },
              },
            },
          },
        ],
        responses: { 201: { description: 'Created' } },
      },
    },
    '/orders/{id}': {
      parameters: [{ name: 'id', in: 'path', type: 'integer', required: true }],
      get: {
        summary: 'Get order by ID',
        tags: ['Orders'],
        responses: { 200: { description: 'OK' } },
      },
      patch: {
        summary: 'Update order status',
        tags: ['Orders'],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['status'],
              properties: {
                status: {
                  type: 'string',
                  enum: ['pending', 'shipped', 'delivered', 'cancelled'],
                },
              },
            },
          },
        ],
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        summary: 'Cancel order',
        tags: ['Orders'],
        responses: { 204: { description: 'No Content' } },
      },
    },
  },
};
