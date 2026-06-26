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
        responses: {},
      },
      post: {
        summary: 'Create a pet',
        description: 'Creates a new pet record in the store.',
        tags: ['Pets'],
        responses: {},
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
        description:
          'Returns a single pet. Use the expand parameter to include related resources.',
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
            description: 'Session cookie for tracking',
          },
        ],
        responses: {},
      },
      put: {
        summary: 'Update pet',
        description: 'Updates an existing pet record.',
        tags: ['Pets'],
        responses: {},
      },
      delete: {
        summary: 'Delete pet',
        description: 'Permanently removes a pet from the store.',
        tags: ['Pets'],
        responses: {},
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
        description: 'Returns all photos associated with a pet.',
        tags: ['Photos'],
        responses: {},
      },
      post: {
        summary: 'Upload photo',
        description: 'Uploads a new photo for the specified pet.',
        tags: ['Photos'],
        responses: {},
      },
      delete: {
        summary: 'Delete photo',
        description: 'Removes a photo from the specified pet.',
        tags: ['Photos'],
        responses: {},
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
        description: 'Returns all tags assigned to a pet.',
        tags: ['Tags'],
        responses: {},
      },
      post: {
        summary: 'Add tag to pet',
        description: 'Assigns a new tag to the specified pet.',
        tags: ['Tags'],
        responses: {},
      },
    },
    '/pets/{id}/tags/{tagId}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Pet ID',
        },
        {
          name: 'tagId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Tag ID',
        },
      ],
      delete: {
        summary: 'Remove tag from pet',
        description: 'Removes a specific tag from the specified pet.',
        tags: ['Tags'],
        responses: {},
      },
    },
    '/categories': {
      get: {
        summary: 'List all categories',
        description: 'Returns all available pet categories.',
        tags: ['Categories'],
        parameters: [
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by name',
          },
        ],
        responses: {},
      },
      post: {
        summary: 'Create category',
        description: 'Creates a new pet category.',
        tags: ['Categories'],
        responses: {},
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
        description: 'Returns a single category by its ID.',
        tags: ['Categories'],
        responses: {},
      },
      put: {
        summary: 'Update category',
        description: 'Updates an existing category.',
        tags: ['Categories'],
        responses: {},
      },
      delete: {
        summary: 'Delete category',
        description: 'Permanently removes a category.',
        tags: ['Categories'],
        responses: {},
      },
    },
    '/users': {
      get: {
        summary: 'List all users',
        description: 'Returns all registered users. Requires admin role.',
        tags: ['Users'],
        parameters: [
          {
            name: 'role',
            in: 'query',
            schema: { type: 'string', enum: ['admin', 'user'] },
            description: 'Filter by role',
          },
          {
            name: 'Authorization',
            in: 'header',
            required: true,
            schema: { type: 'string' },
            description: 'Bearer token',
          },
          {
            name: 'locale',
            in: 'cookie',
            schema: { type: 'string' },
            description: 'User locale preference',
          },
        ],
        responses: {},
      },
      post: {
        summary: 'Create user',
        description: 'Registers a new user account.',
        tags: ['Users'],
        responses: {},
      },
    },
    '/users/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'User ID',
        },
      ],
      get: {
        summary: 'Get user by ID',
        description: 'Returns a single user profile.',
        tags: ['Users'],
        parameters: [
          {
            name: 'Authorization',
            in: 'header',
            required: true,
            schema: { type: 'string' },
            description: 'Bearer token',
          },
        ],
        responses: {},
      },
      put: {
        summary: 'Update user',
        description: 'Updates user profile information.',
        tags: ['Users'],
        responses: {},
      },
      delete: {
        summary: 'Delete user',
        description: 'Permanently removes a user account.',
        tags: ['Users'],
        responses: {},
      },
    },
    '/users/{id}/favorites': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'User ID',
        },
      ],
      get: {
        summary: 'List favorite pets',
        description: "Returns the user's saved favorite pets.",
        tags: ['Users'],
        responses: {},
      },
      post: {
        summary: 'Add to favorites',
        description: "Adds a pet to the user's favorites list.",
        tags: ['Users'],
        responses: {},
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
        responses: {},
      },
      post: {
        summary: 'Add a book',
        description: 'Adds a new book to the store catalog.',
        tags: ['Books'],
        responses: {},
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
        description: 'Returns a single book by its ID.',
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
        responses: {},
      },
      patch: {
        summary: 'Update book',
        description: 'Partially updates a book record.',
        tags: ['Books'],
        responses: {},
      },
      delete: {
        summary: 'Delete book',
        description: 'Permanently removes a book from the catalog.',
        tags: ['Books'],
        responses: {},
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
        description: 'Returns all reviews for the specified book.',
        tags: ['Reviews'],
        parameters: [
          {
            name: 'rating',
            in: 'query',
            type: 'integer',
            description: 'Filter by rating (1-5)',
          },
        ],
        responses: {},
      },
      post: {
        summary: 'Add review',
        description: 'Submits a new review for the specified book.',
        tags: ['Reviews'],
        responses: {},
      },
    },
    '/books/{id}/reviews/{reviewId}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          type: 'integer',
          required: true,
          description: 'Book ID',
        },
        {
          name: 'reviewId',
          in: 'path',
          type: 'integer',
          required: true,
          description: 'Review ID',
        },
      ],
      get: {
        summary: 'Get review',
        description: 'Returns a single review by its ID.',
        tags: ['Reviews'],
        responses: {},
      },
      put: {
        summary: 'Update review',
        description: 'Updates an existing review.',
        tags: ['Reviews'],
        responses: {},
      },
      delete: {
        summary: 'Delete review',
        description: 'Removes a review from the book.',
        tags: ['Reviews'],
        responses: {},
      },
    },
    '/authors': {
      get: {
        summary: 'List all authors',
        description: 'Returns all authors in the catalog.',
        tags: ['Authors'],
        parameters: [
          {
            name: 'search',
            in: 'query',
            type: 'string',
            description: 'Search by name',
          },
        ],
        responses: {},
      },
      post: {
        summary: 'Add author',
        description: 'Adds a new author to the catalog.',
        tags: ['Authors'],
        responses: {},
      },
    },
    '/authors/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          type: 'integer',
          required: true,
          description: 'Author ID',
        },
      ],
      get: {
        summary: 'Get author by ID',
        description: 'Returns a single author by their ID.',
        tags: ['Authors'],
        responses: {},
      },
      patch: {
        summary: 'Update author',
        description: 'Partially updates an author record.',
        tags: ['Authors'],
        responses: {},
      },
      delete: {
        summary: 'Delete author',
        description: 'Permanently removes an author from the catalog.',
        tags: ['Authors'],
        responses: {},
      },
    },
    '/authors/{id}/books': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          type: 'integer',
          required: true,
          description: 'Author ID',
        },
      ],
      get: {
        summary: "List author's books",
        description: 'Returns all books written by the specified author.',
        tags: ['Authors'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            type: 'integer',
            description: 'Max number of results',
          },
        ],
        responses: {},
      },
    },
    '/genres': {
      get: {
        summary: 'List all genres',
        description: 'Returns all available book genres.',
        tags: ['Genres'],
        responses: {},
      },
      post: {
        summary: 'Create genre',
        description: 'Creates a new book genre.',
        tags: ['Genres'],
        responses: {},
      },
    },
    '/genres/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          type: 'integer',
          required: true,
          description: 'Genre ID',
        },
      ],
      get: {
        summary: 'Get genre by ID',
        description: 'Returns a single genre by its ID.',
        tags: ['Genres'],
        responses: {},
      },
      delete: {
        summary: 'Delete genre',
        description: 'Permanently removes a genre.',
        tags: ['Genres'],
        responses: {},
      },
    },
    '/orders': {
      get: {
        summary: 'List all orders',
        description: 'Returns all orders. Requires authentication.',
        tags: ['Orders'],
        parameters: [
          {
            name: 'status',
            in: 'query',
            type: 'string',
            description: 'Filter by status',
          },
          {
            name: 'Authorization',
            in: 'header',
            type: 'string',
            required: true,
            description: 'Bearer token',
          },
        ],
        responses: {},
      },
      post: {
        summary: 'Create order',
        description: 'Places a new book order.',
        tags: ['Orders'],
        responses: {},
      },
    },
    '/orders/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          type: 'integer',
          required: true,
          description: 'Order ID',
        },
      ],
      get: {
        summary: 'Get order by ID',
        description: 'Returns a single order by its ID.',
        tags: ['Orders'],
        responses: {},
      },
      patch: {
        summary: 'Update order status',
        description: 'Updates the status of an existing order.',
        tags: ['Orders'],
        responses: {},
      },
      delete: {
        summary: 'Cancel order',
        description: 'Cancels and removes an order.',
        tags: ['Orders'],
        responses: {},
      },
    },
  },
};
