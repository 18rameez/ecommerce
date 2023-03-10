const { getDB } = require("../util/database");
const { ObjectId } = require("mongodb");

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.cart = [];
    this.orders = [];
  }

  save() {
    const db = getDB();
    return db.collection("users").insertOne(this);
  }

  static purchase(orderDetails, userId) {
    const { cart_id, productId, quantity, size } = orderDetails;
    const db = getDB();

    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { cart: { cart_id: new ObjectId(cart_id) } } }
      )
      .then((result) => {
        if (result.modifiedCount > 0) {
          return db
            .collection("users")
            .updateOne(
              { _id: new ObjectId(userId) },
              {
                $push: {
                  orders: {
                    order_id: new ObjectId(),
                    productId: new ObjectId(productId),
                    quantity: quantity,
                    size: size,
                  },
                },
              }
            );
        } else {
          return Promise.reject("given item not found");
        }
      });
  }

  static getCart(id) {

    const db = getDB();
   

    return db.collection("users").aggregate([{ $match: { _id: new ObjectId(id) } },{ $lookup: {
            from: "products",
            localField: "orders.productId",
            foreignField: "_id",
            as: "order_details",
          },
        },

        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            cart: 1,
            order_details: {
              $map: {
                input: "$orders",
                as: "order",
                in: {
                  order_id: "$$order.order_id",
                  quantity: "$$order.quantity",
                  size: "$$order.size",
                  product_details: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$order_details",
                          cond: { $eq: ["$$this._id", "$$order.productId"] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
      ],
     ).toArray()
     
  }

  static addToCart(userId, productId, quantity, size) {
    const db = getDB();
    return db
      .collection("users")
      .findOne({
        _id: new ObjectId(userId),
        "cart.productId": new ObjectId(productId),
      })
      .then((result) => {
        if (result) {
          return db
            .collection("users")
            .updateOne(
              {
                _id: new ObjectId(userId),
                "cart.productId": new ObjectId(productId),
              },
              { $inc: { "cart.$.quantity": 1 } }
            );
        } else {
          return db
            .collection("users")
            .updateOne(
              { _id: new ObjectId(userId) },
              {
                $push: {
                  cart: {
                    cart_id: new ObjectId(),
                    productId: new ObjectId(productId),
                    quantity: quantity,
                    size: size,
                  },
                },
              }
            );
        }
      });
  }
}

module.exports = User;
