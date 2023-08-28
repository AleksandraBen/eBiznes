package models

import scala.collection.mutable
import scala.collection.mutable.ListBuffer

class BasketsList {
  implicit var baskets = new mutable.ListBuffer[Basket]()
  val exampleList = new mutable.ListBuffer[Product]()
  exampleList += new Product(1, "name1", 1)
  exampleList += new Product(2, "name2", 2)
  exampleList += new Product(3, "name3", 3)
  baskets += Basket(1, "basketname1", exampleList)
  baskets += Basket(2, "basketname2", exampleList)
  baskets += Basket(3, "basketname3", exampleList)

  def getAllBaskets(): ListBuffer[Basket] = baskets

  def getBasket(id: Long): Basket = baskets.filter(_.basketId == id).last

  def getBasketProducts(id: Long): ListBuffer[Product] = baskets.filter(_.basketId == id).last.productsList

  def deleteBasket(id: Long): ListBuffer[Basket] = {
    baskets -= baskets.filter(_.basketId == id).last
  }

  def addBasket(id: Long, name: String): ListBuffer[Basket] = {
    val emptyList = new mutable.ListBuffer[Product]()
    baskets += Basket(id, name, emptyList)
  }

  def editBasket(id: Long, products: ListBuffer[Product]) : ListBuffer[Basket] = {
    var name = baskets.filter(_.basketId == id).last.basketName
    baskets -= baskets.filter(_.basketId == id).last
    baskets += Basket(id, name, products)
  }
}

