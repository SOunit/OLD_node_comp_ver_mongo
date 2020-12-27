const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectID(product._id),
        quantity: 1,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    db.collection('users').updateOne(
      { _id: new mongodb.ObjectID(this._id) },
      { $set: { cart: updatedCart } }
    );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => {
      return new mongodb.ObjectID(item.productId);
    });
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        console.log('productIds', productIds);
        console.log('getCart', products);
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      });

    return this.cart;
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectID(userId) });
  }
}

module.exports = User;
