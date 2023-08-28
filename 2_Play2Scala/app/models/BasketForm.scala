package models

import play.api.data.Form
import play.api.data.Forms._

case class BasketForm(id: Long, name: String)

object BasketForm {
  val form: Form[BasketForm] = Form(
    mapping(
      "id" -> longNumber,
      "name" -> text
    )(BasketForm.apply)(BasketForm.unapply)
  )
}
