package models

import scala.collection.mutable.ListBuffer

case class Basket(basketId: Long, basketName: String, productsList: ListBuffer[Product])
