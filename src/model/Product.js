const {getDB} = require("../util/database")
const { ObjectId } = require("mongodb");


class Product {

    constructor({ name, description, stock, category, brand, price, color, available_area }) {
        this.name = name;
        this.description = description;
        this.stock = stock;
        this.category = category;
        this.brand = brand;
        this.price = price;
        this.color = color;
        this.available_area = available_area;
        this.status = "active"
    }

    save(){
        const db = getDB();
        return db.collection("products").insertOne(this)
    }

    static getDetails (productId){
        const db = getDB();
        return db.collection("products").findOne({_id : new ObjectId(productId)})
    }

    static getAll (){
        const db = getDB();
        return db.collection("products").find({}).toArray()
    }

    static activate (productId){
        const db = getDB();
        return db.collection("products").updateOne({_id : new ObjectId(productId)}, {$set : {"status": "active"}})
    }

    static update (productId, updateDetails){
        updateDetails.status = "inactive"
        const db = getDB();
        return db.collection("products").updateOne({_id : new ObjectId(productId)}, {$set : updateDetails})
    }

    static delete(productId){
       
        const db = getDB();
        return db.collection("products").deleteOne({_id : new ObjectId(productId)})
    }

    static search(query){

        const db = getDB();
        return db.collection("products").find(query).toArray()
    }
}

  module.exports = Product;