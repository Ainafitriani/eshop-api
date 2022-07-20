const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/products',
    handler: handler.postProduct,
  },
  {
    method: 'GET',
    path: '/products',
    handler: handler.getProducts,
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: handler.getProductById,
  },
  {
    method: 'PUT',
    path: '/products/{id}',
    handler: handler.putProductById,
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    handler: handler.deleteProductById,
  },

  {
    method: 'PUT',
    path: '/products/{id}/image',
    handler: handler.putProductImageById,
    options: {
      auth: 'eshop_jwt',
      payload: {
        allow: 'multipart/form-data',
        multipart:true,
        output: 'stream',
        maxBytes: 512000,
      }

    }
  },


];

module.exports = routes;