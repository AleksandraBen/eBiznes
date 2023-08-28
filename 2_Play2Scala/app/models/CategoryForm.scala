package models

import play.api.data.Form
import play.api.data.Forms._

case class CategoryForm(id: Long, name: String)

object CategoryForm {
  val form: Form[CategoryForm] = Form(
    mapping(
      "id" -> longNumber,
      "name" -> text
    )(CategoryForm.apply)(CategoryForm.unapply)
  )
}
