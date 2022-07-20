const { nanoid } = require('nanoid');

class ProductsHandler {
  #productsService;
  #storageService;
  #validator;

  constructor(productsService, storageService, validator) {
    this.#productsService = productsService;
    this.#storageService = storageService;
    this.#validator = validator;

    this.postProduct = this.postProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.putProductById = this.putProductById.bind(this);
    this.deleteProductById = this.deleteProductById.bind(this);
    this.putProductImageById = this.putProductImageById.bind(this);
  }

  async postProduct(request, h) {}

  async getProducts(request, h) {}

  async getProductById(request, h) {}

  async putProductById(request, h) {}

  async deleteProductById(request, h) {}

  async postProduct(request, h) {
    this.#validator.validateProductsPayload(request.payload);
    const { title, price, description } = request.payload;

    const productId = await this.#productsService.addProduct(title, price, description);

    const response = h.response({
      status: 'success',
      message: 'Produk berhasil ditambahkan',
      data: {
        productId,
      },
    });
    response.code(201);
    return response;
  }

  async getProducts(request, h) {
    const products = await this.#productsService.getAllProducts();

    return {
      status: 'success',
      message: 'Data produk berhasil diambil',
      data: {
        products,
      }
    };
  }

  async getProductById(request, h) {
    const { id } = request.params;

    const product = await this.#productsService.getProductById(id);

    return {
      status: 'success',
      message: 'Data produk berhasil diambil',
      data: {
        product,
      },
    };
  }

  async putProductById(request, h) {
    this.#validator.validateProductsPayload(request.payload);
    const { id } = request.params;
    const { title, price, description } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this.#productsService.updateProductById(id, userId, { title, price, description });

    return {
      status: 'success',
      message: 'Produk berhasil diperbarui',
    };
  }

  async deleteProductById(request, h) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;
    await this.#productsService.deleteProductById(id, userId);

    return {
      status: 'success',
      message: 'Produk berhasil dihapus',
    };
  }
  async putProductImageById(request, h) {
    const { image } = request.payload;
    const { id } = request.params;
    await this.#validator.validateProductImageHeader(image.hapi.headers);

    const nameId = `productImage-${nanoid(16)}`;
    const filename = await this.#storageService.writeFile(image, image.hapi, nameId);
    const oldFileName = await this.#productsService.updateProductImageById(id, filename);
    console.log(oldFileName);
    if (oldFileName != null) {
      await this.#storageService.deleteFile(oldFileName);
    }

    return {
      status: 'success',
      message: 'Gambar produk berhasil diperbarui',
    };
  }

}

module.exports = ProductsHandler;const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/products',
    handler: handler.postProduct,
    options: {
      auth: 'eshop_jwt',
    },
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
    options: {
      auth: 'eshop_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    handler: handler.deleteProductById,
    options: {
      auth: 'eshop_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/products/{id}/image',
    handler: handler.putProductImageById,
    options: {
      auth: 'eshop_jwt',
      payload :{
      allow: 'multipart/form-data',
      multipart: true,
      output: 'stream',
      maxBytes: 512000,
      }
    },
  },
  {
    method: 'GET',
    path: '/products/image/{param*}',
    handler:{
      directory: {
        path: path.resolve(__dirname, '/images')
      },
    },
  },
];

module.exports = routes;