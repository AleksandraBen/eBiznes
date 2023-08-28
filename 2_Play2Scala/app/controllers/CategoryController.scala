package controllers

import com.google.inject.Inject
import models._
import play.api.libs.json._
import play.api.mvc._

import javax.inject._

case class NewCategory(categoryId: Long, categoryName: String)

@Singleton
class CategoryController @Inject()(productsList: ProductsList, categoriesList: CategoriesList, template: views.html.menu.categoriesMenu, controllerComponents: ControllerComponents) extends AbstractController(controllerComponents) with play.api.i18n.I18nSupport {
  implicit val categoryJson = Json.format[Category]
  implicit val newCategoryJson = Json.format[NewCategory]

  //implicit val products = productsList.getAllProducts()
  //implicit val categories = categoriesList.getAllCategories()

  def index(): Action[AnyContent] = Action {
    Ok(views.html.menu.index())
  }

  def availableCategories(): Action[AnyContent] = Action { implicit request =>
    Ok(template(categoriesList.getAllCategories().toList))
  }

  def showAll(): Action[AnyContent] = Action {
    if (categoriesList.getAllCategories().isEmpty) NoContent else Ok(Json.toJson(categoriesList.getAllCategories()))
  }

  def showById(id: Long): Action[AnyContent] = Action {
    val foundItem = categoriesList.getCategory(id)
    Ok(Json.toJson(foundItem))
  }

  def delete(id: Long): Action[AnyContent] = Action {
    categoriesList.deleteCategory(id)
    Redirect("/categories")
  }

  def simpleForm(): Action[AnyContent] = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.menu.addCategoryForm(CategoryForm.form))
  }

  def filledForm(id: Long): Action[AnyContent] = Action { implicit request =>
    val itemToModify = categoriesList.getCategory(id)
    Ok(views.html.menu.editCategoryForm(FilledCategoryForm.form.fill(FilledCategoryForm(itemToModify.categoryId, itemToModify.categoryName)), itemToModify))
  }

  def categoryFormPost(): Action[AnyContent] = Action { implicit request =>
    CategoryForm.form.bindFromRequest.fold(
      formWithErrors => {
        BadRequest(views.html.menu.addCategoryForm(formWithErrors))
      },
      formData => {
        categoriesList.addCategory(formData.id, formData.name)
        Redirect("/categories")
      }
    )
  }

  def filledFormPut(): Action[AnyContent] = Action { implicit request =>
    FilledCategoryForm.form.bindFromRequest.fold(
      formWithErrors => {
        Redirect("/categories")
      },
      formData => {
        categoriesList.deleteCategory(formData.id)
        categoriesList.addCategory(formData.id, formData.name)
        Redirect("/categories")
      }
    )
  }
}