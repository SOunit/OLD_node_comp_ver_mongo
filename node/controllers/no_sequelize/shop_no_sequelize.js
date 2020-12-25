const Product = require('../models/product');
const Cart = require('../models/cart');

const TIME_TO_WAIT = 3000;

exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('./shop/product-list', {
        pageTitle: 'test',
        prods: rows,
        pageTitle: 'Shop',
        path: '/products',
        hasProducts: rows.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getProducts((cart) => {
    const cartProducts = [];
    Product.fetchAll((products) => {
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('./shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  setTimeout(() => {
    res.redirect('/cart');
  }, TIME_TO_WAIT);
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    setTimeout(() => {
      res.redirect('/cart');
    }, TIME_TO_WAIT);
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) => {
      res.render('shop/product-detail', {
        pageTitle: product[0].title,
        path: '/products',
        product: product[0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    // [rows, fieldData] is new syntax
    // which allocate 1st item to rows,
    // 2nd item to fieldData
    .then(([rows, fieldData]) => {
      res.render('./shop/index', {
        pageTitle: 'Index',
        prods: rows,
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('./shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
