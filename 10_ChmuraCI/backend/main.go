package main

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name        string
	Description string
	Price       float32
}

type CartItem struct {
	gorm.Model
	CartID    uint
	ProductID uint
}

type Payment struct {
	gorm.Model
	Name        string
	Surname     string
	AccountNumber string
	PhoneNumber string
	Email       string
	Description string
	Price       float32
	Currency	string
}

type ProductController struct {
	db *gorm.DB
}

type CartController struct {
	db *gorm.DB
}

type PaymentController struct {
	db *gorm.DB
}

func setCORSHeader(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		c.Response().Header().Set("Access-Control-Allow-Origin", "*")
		c.Response().Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Response().Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if c.Request().Method == "OPTIONS" {
			return c.NoContent(http.StatusOK)
		}

		return next(c)
	}
}

func migrate(db *gorm.DB) {
	db.AutoMigrate(&Product{}, &CartItem{}, &Payment{})
}

func (pc *ProductController) GetAllProducts(c echo.Context) error {
	var products []Product
	pc.db.Find(&products)

	return c.JSON(http.StatusOK, products)
}

func (pc *ProductController) GetProduct(c echo.Context) error {
	id := c.Param("id")

	var product Product
	pc.db.First(&product, id)

	return c.JSON(http.StatusOK, product)
}

func (pc *ProductController) CreateProduct(c echo.Context) error {
	var product Product
	c.Bind(&product)
	pc.db.Create(&product)

	return c.JSON(http.StatusCreated, product)
}

func (pc *ProductController) UpdateProduct(c echo.Context) error {
	id := c.Param("id")

	var product Product
	pc.db.First(&product, id)
	c.Bind(&product)
	pc.db.Save(&product)

	return c.JSON(http.StatusOK, product)
}

func (pc *ProductController) DeleteProduct(c echo.Context) error {
	id := c.Param("id")

	var product Product
	pc.db.Delete(&product, id)

	// Get the cart items associated with the deleted product's ID
	var cartItems []CartItem
	pc.db.Where("product_id = ?", id).Find(&cartItems)

	// Delete each cart item found for the deleted product
	cc := &CartController{db: pc.db} // Create a CartController instance to access DeleteFromCart function
	for _, cartItem := range cartItems {
		if err := cc.db.Delete(&cartItem).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete cart item"})
		}
	}

	return c.NoContent(http.StatusNoContent)
}

func (cc *CartController) AddToCart(c echo.Context) error {
	cartID := c.Param("id")

	// Parse cart ID
	cartID_, err := strconv.ParseUint(cartID, 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid cart ID"})
	}

	// Parse product ID from request body
	var requestData struct {
		ProductID uint `json:"product_id"`
	}
	if err := c.Bind(&requestData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	// Retrieve the product
	var product Product
	if result := cc.db.First(&product, requestData.ProductID); result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
	}

	// Add the product to the cart
	cartItem := CartItem{
		CartID:    uint(cartID_),
		ProductID: requestData.ProductID,
	}
	cc.db.Create(&cartItem)

	return c.JSON(http.StatusCreated, cartItem)
}

func (cc *CartController) GetCart(c echo.Context) error {
	cartID := c.Param("id")

	// Parse cart ID
	cartID_, err := strconv.ParseUint(cartID, 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid cart ID"})
	}

	// Retrieve the cart items with associated products
	var cartItems []CartItem
	cc.db.Where("cart_id = ?", cartID_).Find(&cartItems)

	return c.JSON(http.StatusOK, cartItems)
}

func (cc *CartController) DeleteFromCart(c echo.Context) error {
	cartID := c.Param("id")
	productID := c.Param("itemID")

	// Parse cart ID
	cartID_, err := strconv.ParseUint(cartID, 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid cart ID"})
	}

	// Parse product ID
	productID_, err := strconv.ParseUint(productID, 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid product ID"})
	}

	// Retrieve the cart item
	var cartItem CartItem
	if result := cc.db.Where("cart_id = ? AND product_id = ?", cartID_, productID_).First(&cartItem); result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Cart item not found"})
	}

	// Delete the cart item
	if err := cc.db.Delete(&cartItem).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete cart item"})
	}

	return c.NoContent(http.StatusNoContent)
}

func (cc *CartController) GetAllCart(c echo.Context) error {
	cartID := c.Param("id")

	// Parse cart ID
	cartID_, err := strconv.ParseUint(cartID, 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid cart ID"})
	}

	// Retrieve the cart items with associated products
	var cartItems []CartItem
	cc.db.Where("cart_id = ?", cartID_).Find(&cartItems)

	items := make([]Product, len(cartItems))
	for i, item := range cartItems {
		var product Product
		if result := cc.db.First(&product, item.ProductID); result.Error != nil {
			return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
		}
		items[i] = product
	}

	return c.JSON(http.StatusOK, items)
}

func (pyc *PaymentController) AddPayment(c echo.Context) error {
	var payment Payment
	c.Bind(&payment)
	pyc.db.Create(&payment)

	return c.JSON(http.StatusCreated, payment)
}

func (pyc *PaymentController) GetAllPayments(c echo.Context) error {
	var payments []Payment
	pyc.db.Find(&payments)

	return c.JSON(http.StatusOK, payments)
}

func (pyc *PaymentController) GetPayment(c echo.Context) error {
	id := c.Param("id")

	var payment Payment
	pyc.db.First(&payment, id)

	return c.JSON(http.StatusOK, payment)
}

func main() {
	db, err := gorm.Open(sqlite.Open("database.db"), &gorm.Config{})
	if err != nil {
		panic("Database connection failed.")
	}

	migrate(db)

	pc := &ProductController{db: db}
	cc := &CartController{db: db}
    pyc := &PaymentController{db: db}

	e := echo.New()
	e.Use(setCORSHeader)

	// Product Routes
	e.POST("/products", pc.CreateProduct)
	e.GET("/products", pc.GetAllProducts)
	e.GET("/products/:id", pc.GetProduct)
	e.PUT("/products/:id", pc.UpdateProduct)
	e.DELETE("/products/:id", pc.DeleteProduct)

	// Cart Routes
	e.GET("/cart/:id", cc.GetCart)
    e.GET("/cart/:id/items", cc.GetAllCart)
	e.POST("/cart/:id/items", cc.AddToCart)
	e.DELETE("/cart/:id/items/:itemID", cc.DeleteFromCart)

    // Payment Routes
	e.POST("/payments", pyc.AddPayment)
	e.GET("/payments", pyc.GetAllPayments)
	e.GET("/payments/:id", pyc.GetPayment)

	e.Logger.Fatal(e.Start(":8888"))


}
