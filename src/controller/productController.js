const Product = require("../model/Product")
const User = require("../model/User")
const productSchema = require("../schema/product")


exports.getProduct = (req,res,next) => {
    
    const productId = req.params.id;

    Product.getDetails(productId)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        res.status(500).send({error: "Internal  Error"})
    })
}

exports.createProduct = (req, res, next) => {
     
  const { error, value } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const product = new Product(value)
  product.save()
  .then(result => {
    res.status(201).send({msg : "product added"});
  })
  .catch(err => {
    console.error(err);
    res.status(500).send({error :'Failed to add the product to database.'});
  })

}

exports.addToCart = (req, res, next) => {
    const {userId} = req.user;
    const {productId, quantity, size} = req.body;
    console.log(userId);
    User.addToCart(userId, productId, quantity, size)
    .then(result => {
        res.status(201).send({msg: "product added to cart"})
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({error: "Internal  Error"})
    })
}


exports.getAllProducts = (req, res, next) => {
    
    Product.getAll()
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        res.status(500).send({error: "Internal  Error"})
    })
}

exports.activateProduct = (req, res, next) => {
    
    const productId = req.body.productId;
    if(!productId){
        return res.status(400).send({error: "Invalid Parameter"})
    }

    Product.activate(productId)
    .then(result => {
        res.status(200).send({msg: "product status is updated to active"})
    })
    .catch(err => {
        res.status(500).send({error: "Internal  Error"})
    })
}

exports.updateProduct = (req, res, next) => {

    const updateDetails = req.body;
    const productId = req.params.id;

    Product.update(productId, updateDetails)
    .then(result => {
        if(result.modifiedCount > 0){
            res.status(200).send({msg: "product updated"})
        }else {
            res.status(404).send({error: "given product id is not found"})
        }
       
    })
    .catch(err => {
        res.status(500).send({error: "Internal  Error"})
    })
    
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.id;
    Product.delete(productId)
    .then(result => {
        
        if(result.deletedCount > 0){
            res.status(200).send({msg: "product deleted"})
        }else {
            res.status(404).send({error: "given product id is not found"})
        }
       
    })
    .catch(err => {
        res.status(500).send({error: "Internal  Error"})
    })
}

exports.purchaseProduct = (req, res, next) => {
    
    const {userId} = req.user;
    const orderDetails = req.body

    User.purchase(orderDetails, userId)
    .then(result => {
        
        if(result.modifiedCount > 0){
            res.status(200).send({msg: "product successfully purchased"})
        }else{
            res.status(404).send({error : "not found"})
        }
       
    })
    .catch(err => {
        res.status(500).send({error: err})
    })
}

exports.searchProduct = async (req, res, next) => {
    
    try {
      
        const { name, brand, location } = req.query;
      
        const query = {};
        if (name) {
          query.$or = [
            { name: { $regex: name, $options: 'i' } },
            { description: { $regex: name, $options: 'i' } }
          ];
        }
        if (brand) {
          query.brand = { $regex: brand, $options: 'i' };
        }
        if (location) {
          query.available_area = Number(location);
        }
    
        const results = await Product.search(query);
        res.json(results);

      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } 
}