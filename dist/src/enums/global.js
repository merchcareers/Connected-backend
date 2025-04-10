"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStatus = exports.AdvertDisplayArea = exports.AdvertStatus = exports.AdvertType = exports.WithdrawalStatus = exports.EscrowStatus = exports.PaymentMethod = exports.TransactionTitle = exports.TransactionStatus = exports.TransactionType = exports.FlagStatus = exports.DeliveryType = exports.AdminOrderStatus = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["FAILED"] = "failed";
    OrderStatus["ASSIGNED"] = "assigned";
    OrderStatus["AWAITING_SHIPMENT"] = "awaiting_shipment";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["REFUNDED"] = "refunded";
    OrderStatus["RETURNED"] = "returned";
    OrderStatus["DISPUTED"] = "disputed";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var AdminOrderStatus;
(function (AdminOrderStatus) {
    AdminOrderStatus["CREATED"] = "created";
    AdminOrderStatus["DISPUTED"] = "disputed";
    AdminOrderStatus["DELIVERED"] = "delivered";
    AdminOrderStatus["CANCELLED"] = "cancelled";
})(AdminOrderStatus || (exports.AdminOrderStatus = AdminOrderStatus = {}));
var DeliveryType;
(function (DeliveryType) {
    DeliveryType["EXPRESS"] = "express";
    DeliveryType["STANDARD"] = "standard";
})(DeliveryType || (exports.DeliveryType = DeliveryType = {}));
var FlagStatus;
(function (FlagStatus) {
    FlagStatus["DISPUTE"] = "DISPUTE";
    FlagStatus["FRAUD_SUSPECTED"] = "FRAUD_SUSPECTED";
    FlagStatus["PAYMENT_ISSUE"] = "PAYMENT_ISSUE";
    FlagStatus["DELIVERY_PROBLEM"] = "DELIVERY_PROBLEM";
    FlagStatus["CUSTOMER_COMPLAINT"] = "CUSTOMER_COMPLAINT";
    FlagStatus["INVENTORY_MISMATCH"] = "INVENTORY_MISMATCH";
    FlagStatus["REFUND_REQUESTED"] = "REFUND_REQUESTED";
    FlagStatus["PENDING_INVESTIGATION"] = "PENDING_INVESTIGATION";
    FlagStatus["UNFLAGGED"] = "";
})(FlagStatus || (exports.FlagStatus = FlagStatus = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["CART"] = "cart";
    TransactionType["ESCROW"] = "escrow";
    TransactionType["TRANSFER"] = "transfer";
    TransactionType["PAYMENT"] = "payment";
    TransactionType["WITHDRAWAL"] = "withdrawal";
    TransactionType["REFUND"] = "refund";
    TransactionType["SALE"] = "sale";
    TransactionType["DEPOSIT"] = "deposit";
    TransactionType["NULL"] = "null";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["SUCCESSFUL"] = "successful";
    TransactionStatus["SUCCESS"] = "success";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["DISPUTED"] = "disputed";
    TransactionStatus["SETTLED"] = "settled";
    TransactionStatus["UNSETTLED"] = "unsettled";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var TransactionTitle;
(function (TransactionTitle) {
    TransactionTitle["CHECK_OUT"] = "Check Out";
    TransactionTitle["ESCROW"] = "Escrow";
    TransactionTitle["DEPOSIT"] = "Deposit";
    TransactionTitle["TRANSFER"] = "Transfer";
})(TransactionTitle || (exports.TransactionTitle = TransactionTitle = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "card";
    PaymentMethod["BANK"] = "bank";
    PaymentMethod["USSD"] = "ussd";
    PaymentMethod["QR"] = "qr";
    PaymentMethod["MOBILE_MONEY"] = "mobile_money";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["NULL"] = "null";
    PaymentMethod["ESCROW"] = "escrow";
    PaymentMethod["WALLET"] = "wallet";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var EscrowStatus;
(function (EscrowStatus) {
    EscrowStatus["PENDING"] = "pending";
    EscrowStatus["AWAITING_ACCEPTANCE"] = "awaiting_acceptance";
    EscrowStatus["ACCEPTED"] = "accepted";
    EscrowStatus["REJECTED"] = "rejected";
    EscrowStatus["CANCELLED"] = "cancelled";
    EscrowStatus["PROCESSING"] = "processing";
    EscrowStatus["IN_TRANSIT"] = "in_transit";
    EscrowStatus["DELIVERED"] = "delivered";
    EscrowStatus["FAILED"] = "failed";
})(EscrowStatus || (exports.EscrowStatus = EscrowStatus = {}));
var WithdrawalStatus;
(function (WithdrawalStatus) {
    WithdrawalStatus["PENDING"] = "pending";
    WithdrawalStatus["PROCESSING"] = "processing";
    WithdrawalStatus["COMPLETED"] = "completed";
    WithdrawalStatus["CANCELLED"] = "cancelled";
    WithdrawalStatus["FAILED"] = "failed";
})(WithdrawalStatus || (exports.WithdrawalStatus = WithdrawalStatus = {}));
var AdvertType;
(function (AdvertType) {
    AdvertType["PRODUCT"] = "product";
    AdvertType["STORE"] = "store";
    AdvertType["BANNER"] = "banner";
})(AdvertType || (exports.AdvertType = AdvertType = {}));
var AdvertStatus;
(function (AdvertStatus) {
    AdvertStatus["PENDING"] = "pending";
    AdvertStatus["PROCESSING"] = "processing";
    AdvertStatus["APPROVED"] = "approved";
    AdvertStatus["REJECTED"] = "rejected";
    AdvertStatus["CANCELLED"] = "cancelled";
    AdvertStatus["COMPLETED"] = "completed";
})(AdvertStatus || (exports.AdvertStatus = AdvertStatus = {}));
var AdvertDisplayArea;
(function (AdvertDisplayArea) {
    AdvertDisplayArea["HOME"] = "home";
    AdvertDisplayArea["SEARCH"] = "search";
    AdvertDisplayArea["CATEGORY"] = "category";
    AdvertDisplayArea["PRODUCT"] = "product";
    AdvertDisplayArea["STORE"] = "store";
    AdvertDisplayArea["CART"] = "cart";
})(AdvertDisplayArea || (exports.AdvertDisplayArea = AdvertDisplayArea = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "draft";
    ProductStatus["PUBLISHED"] = "published";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
