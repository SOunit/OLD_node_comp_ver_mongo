const Product = require('../models/product');
const Cart = require('../models/cart');

const TIME_TO_WAIT = 3000;

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.getAdminProducts = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  Product.fetchAll((products) => {
    res.render('admin/products', {
      pageTitle: 'Products',
      prods: products,
      path: '/admin/products',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      prod: product,
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice
  ).save();

  setTimeout(() => {
    return res.redirect('/admin/products');
  }, TIME_TO_WAIT);
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = +req.body.price;
  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);

  setTimeout(() => {
    res.redirect('/admin/products');
  }, TIME_TO_WAIT);
};
