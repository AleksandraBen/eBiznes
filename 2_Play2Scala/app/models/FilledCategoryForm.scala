package models

import play.api.data.Form
import play.api.data.Forms._

case class FilledCategoryForm(id: Long, name: String)

object FilledCategoryForm {
  val form: Form[FilledCategoryForm] = Form(
    mapping(
      "id" -> longNumber,
      "name" -> text
    )(FilledCategoryForm.apply)(FilledCategoryForm.unapply)
  )
}
