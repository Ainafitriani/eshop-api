const ProductsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'products',
  version: '1.0.0',
  register: async (server, { ProductService,storageService, validator }) => {
    const handler = new ProductsHandler(ProductService,storageService, validator);
    server.route(routes(handler));
  },
};