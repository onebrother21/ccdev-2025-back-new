import { body, param, query } from "express-validator";
import { CheckValidation } from "../../middlewares";

export class CustomerOpsValidators {
  // 1️⃣ Account & Profile Management
  static registerCustomer = [[
    body("name").isString().trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().normalizeEmail().withMessage("Invalid email format."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  ],CheckValidation] as IHandler[];

  static updateCustomerProfile = [[
    body("name").optional().isString().trim().withMessage("Invalid name."),
    body("email").optional().isEmail().normalizeEmail().withMessage("Invalid email format."),
    body("phone").optional().isString().trim().withMessage("Invalid phone number."),
  ],CheckValidation] as IHandler[];

  static getProductDetails = [[
    param("productId").isMongoId().withMessage("Invalid product ID."),
  ],CheckValidation] as IHandler[];

  static searchProducts = [[
    query("q").isString().trim().notEmpty().withMessage("Search query is required."),
  ],CheckValidation] as IHandler[];

  static addToCart = [[
    body("productId").isMongoId().withMessage("Invalid product ID."),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),
  ],CheckValidation] as IHandler[];

  static updateCart = [[
    body("cartItems").isArray({ min: 1 }).withMessage("Cart items must be an array."),
    body("cartItems.*.productId").isMongoId().withMessage("Invalid product ID."),
    body("cartItems.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),
  ],CheckValidation] as IHandler[];

  static placeOrder = [[
    body("cartId").isMongoId().withMessage("Invalid cart ID."),
    body("paymentMethod").isString().notEmpty().withMessage("Payment method is required."),
    body("deliveryAddress").isString().notEmpty().withMessage("Delivery address is required."),
  ],CheckValidation] as IHandler[];

  static getOrderDetails = [[
    param("orderId").isMongoId().withMessage("Invalid order ID."),
  ],CheckValidation] as IHandler[];

  static cancelOrder = [[
    param("orderId").isMongoId().withMessage("Invalid order ID."),
    body("reason").isString().notEmpty().withMessage("Cancellation reason is required."),
  ],CheckValidation] as IHandler[];

  static trackOrder = [[
    param("orderId").isMongoId().withMessage("Invalid order ID."),
  ],CheckValidation] as IHandler[];

  static rateOrder = [[
    body("orderId").isMongoId().withMessage("Invalid order ID."),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5."),
    body("review").optional().isString().trim().withMessage("Invalid review text."),
  ],CheckValidation] as IHandler[];

  static addPaymentMethod = [[
    body("cardNumber").isCreditCard().withMessage("Invalid card number."),
    body("expiryDate").isString().notEmpty().withMessage("Expiry date is required."),
    body("cvv").isString().isLength({ min: 3, max: 4 }).withMessage("Invalid CVV."),
  ],CheckValidation] as IHandler[];

  static trackCourierLocation = [[
    param("courierId").isMongoId().withMessage("Invalid courier ID."),
  ],CheckValidation] as IHandler[];

  static contactCourier = [[
    body("courierId").isMongoId().withMessage("Invalid courier ID."),
    body("message").isString().notEmpty().withMessage("Message is required."),
  ],CheckValidation] as IHandler[];

  static markNotificationAsRead = [[
    param("notificationId").isMongoId().withMessage("Invalid notification ID."),
  ],CheckValidation] as IHandler[];

  static submitFeedback = [[
    body("subject").isString().notEmpty().withMessage("Feedback subject is required."),
    body("message").isString().notEmpty().withMessage("Feedback message is required."),
  ],CheckValidation] as IHandler[];
}