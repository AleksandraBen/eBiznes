package models

import scala.collection.mutable
import scala.collection.mutable.ListBuffer

class CategoriesList {
  implicit var categories = new mutable.ListBuffer[Category]()
  categories += Category(1, "categoryname1")
  categories += Category(2, "categoryname2")
  categories += Category(3, "categoryname3")

  def getAllCategories(): ListBuffer[Category] = categories

  def getCategory(id: Long): Category = categories.filter(_.categoryId == id).last

  def deleteCategory(id: Long): ListBuffer[Category] = {
    categories -= categories.filter(_.categoryId == id).last
  }

  def addCategory(id: Long, name: String): ListBuffer[Category] = {
    categories += Category(id, name)
  }
}

