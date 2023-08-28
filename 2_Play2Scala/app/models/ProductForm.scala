package models

import play.api.data.Form
import play.api.data.Forms._

case class ProductForm(id: Long, name: String, category: Long)

object ProductForm {
  val form: Form[ProductForm] = Form(
    mapping(
      "id" -> longNumber,
      "name" -> text,
      "category" -> longNumber
    )(ProductForm.apply)(ProductForm.unapply)
  )
}
