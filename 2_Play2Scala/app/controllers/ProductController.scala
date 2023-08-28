package controllers

import com.google.inject.Inject
import models._
import play.api.libs.json._
import play.api.mvc._

import javax.inject._

case class NewProduct(productId: Long, productName: String, category: Long)

@Singleton
class ProductController @Inject()(productsList: ProductsList, categoriesList: CategoriesList, template: views.html.menu.productsMenu, controllerComponents: ControllerComponents) extends AbstractController(controllerComponents) with play.api.i18n.I18nSupport {
  implicit val productJson = Json.format[Product]
  implicit val newProductJson = Json.format[NewProduct]

  //implicit val products = productsList.getAllProducts()
  //implicit val categories = categoriesList.getAllCategories()

  def index(): Action[AnyContent] = Action {
    Ok(views.html.menu.index())
  }

  def availableProducts(): Action[AnyContent] = Action { implicit request =>
    Ok(template(productsList.getAllProducts().toList))
    //Ok(categoriesList.getAllCategories().toString())
  }

  def showAll(): Action[AnyContent] = Action {
    if (productsList.getAllProducts().isEmpty) NoContent else Ok(Json.toJson(productsList.getAllProducts()))
  }

  def showById(id: Long): Action[AnyContent] = Action {
    val foundItem = productsList.getProduct(id)
    Ok(Json.toJson(foundItem))
  }

  def delete(id: Long): Action[AnyContent] = Action {
    productsList.deleteProduct(id)
    Redirect("/products")
  }

  def simpleForm(): Action[AnyContent] = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.menu.addProductForm(ProductForm.form, categoriesList.getAllCategories()))
  }

  def filledForm(id: Long): Action[AnyContent] = Action { implicit request =>
    val itemToModify = productsList.getProduct(id)
    Ok(views.html.menu.editProductForm(FilledProductForm.form.fill(FilledProductForm(itemToModify.productId, itemToModify.productName, itemToModify.category)), categoriesList.getAllCategories(), itemToModify))
  }

  def productFormPost(): Action[AnyContent] = Action { implicit request =>
    ProductForm.form.bindFromRequest.fold(
      formWithErrors => {
        BadRequest(views.html.menu.addProductForm(formWithErrors, categoriesList.getAllCategories()))
      },
      formData => {
        productsList.addProduct(formData.id, formData.name, formData.category)
        Redirect("/products")
      }
    )
  }

  def filledFormPut(): Action[AnyContent] = Action { implicit request =>
    FilledProductForm.form.bindFromRequest.fold(
      formWithErrors => {
        Redirect("/products")
      },
      formData => {
        productsList.deleteProduct(formData.id)
        productsList.addProduct(formData.id, formData.name, formData.category)
        Redirect("/products")
      }
    )
  }
}

//case class CreateProductForm(productName: String, category: Long)
//case class UpdateProductForm(productId: Long, productName: String, category: Long)