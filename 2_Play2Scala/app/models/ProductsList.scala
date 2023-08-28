package models

import scala.collection.mutable
import scala.collection.mutable.ListBuffer

class ProductsList {
  implicit var products = new mutable.ListBuffer[Product]()
  products += Product(1, "name1", 1)
  products += Product(2, "name2", 2)

  def getAllProducts(): ListBuffer[Product] = products

  def getProduct(id: Long): Product = products.filter(_.productId == id).last

  def deleteProduct(id: Long): ListBuffer[Product] = {
    products -= products.filter(_.productId == id).last
  }

  def addProduct(id:Long, name: String, category: Long) = {
    products += Product(id, name, category)
  }
}
