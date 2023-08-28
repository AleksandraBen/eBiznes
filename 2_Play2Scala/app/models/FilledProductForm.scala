package models

import play.api.data.Form
import play.api.data.Forms._

case class FilledProductForm(id: Long, name: String, category: Long)

object FilledProductForm {
  val form: Form[FilledProductForm] = Form(
    mapping(
      "id" -> longNumber,
      "name" -> text,
      "category" -> longNumber
    )(FilledProductForm.apply)(FilledProductForm.unapply)
  )
}
