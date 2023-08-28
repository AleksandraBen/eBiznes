package models

class CategoryFormatter {
  def apply(category: Double): String = {
    val locale = new java.util.Locale("pl", "PL")
    val formatter = java.text.NumberFormat.getInstance(locale)

    s"Category: $category"
  }
}