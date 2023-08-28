package controllers

import com.google.inject.Inject
import models._
import play.api.libs.json._
import play.api.mvc._

import javax.inject._

case class NewBasket(categoryId: Long, categoryName: String)

@Singleton
class BasketController @Inject()(productsList: ProductsList, categoriesList: CategoriesList, basketsList: BasketsList, template: views.html.menu.basketsMenu, controllerComponents: ControllerComponents) extends AbstractController(controllerComponents) with play.api.i18n.I18nSupport {
  implicit val productJson = Json.format[Product]
  implicit val basketJson = Json.format[Basket]
  implicit val newBasketJson = Json.format[NewBasket]

  def index(): Action[AnyContent] = Action {
    Ok(views.html.menu.index())
  }

  def availableBaskets(): Action[AnyContent] = Action { implicit request =>
    Ok(template(basketsList.getAllBaskets().toList))
  }

  def showAll(): Action[AnyContent] = Action {
    if (basketsList.getAllBaskets().isEmpty) NoContent else Ok(Json.toJson(basketsList.getAllBaskets()))
  }

  def showById(id: Long): Action[AnyContent] = Action {
    val foundItem = basketsList.getBasket(id)
    Ok(Json.toJson(foundItem))
  }

  def delete(id: Long): Action[AnyContent] = Action {
    basketsList.deleteBasket(id)
    Redirect("/baskets")
  }

  def deleteProduct(id: Long, basket: Long): Action[AnyContent] = Action {
    basketsList.editBasket(basket, basketsList.getBasketProducts(basket).filter(_.productId != id))
    Redirect("/editBasketForm/" + basket)
  }

  def simpleForm(): Action[AnyContent] = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.menu.addBasketForm(BasketForm.form))
  }

  def filledForm(id: Long): Action[AnyContent] = Action { implicit request =>
    val itemToModify = basketsList.getBasket(id)
    Ok(views.html.menu.editBasketForm(FilledBasketForm.form.fill(FilledBasketForm(itemToModify.basketId, itemToModify.basketName)), itemToModify, itemToModify.productsList.toList))
  }

  def basketFormPost(): Action[AnyContent] = Action { implicit request =>
    BasketForm.form.bindFromRequest.fold(
      formWithErrors => {
        BadRequest(views.html.menu.addBasketForm(formWithErrors))
      },
      formData => {
        basketsList.addBasket(formData.id, formData.name)
        Redirect("/baskets")
      }
    )
  }

  def filledFormPut(): Action[AnyContent] = Action { implicit request =>
    FilledBasketForm.form.bindFromRequest.fold(
      formWithErrors => {
        Redirect("/baskets")
      },
      formData => {
        basketsList.deleteBasket(formData.id)
        basketsList.addBasket(formData.id, formData.name)
        Redirect("/baskets")
      }
    )
  }
}