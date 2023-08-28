package models

import play.api.data.Form
import play.api.data.Forms._

case class FilledBasketForm(id: Long, name: String)

object FilledBasketForm {
  val form: Form[FilledBasketForm] = Form(
    mapping(
      "id" -> longNumber,
      "name" -> text
    )(FilledBasketForm.apply)(FilledBasketForm.unapply)
  )
}
