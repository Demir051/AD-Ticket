const express = require("express");

const router = express.Router();

const indexController = require("../controllers/index");

const formatDateMiddleware = require("../middlewares/formatDate");

const fullFormatDateMiddleware = require("../middlewares/formatFullDate");

const checkAuthCookie = require('../middlewares/checkAuthCookie');


router.get("/", checkAuthCookie,indexController.index_get)

router.post("/",formatDateMiddleware ,indexController.index_post)

router.get("/tickets", checkAuthCookie,fullFormatDateMiddleware, indexController.tickets_get)

router.post("/tickets", indexController.tickets_post)

router.get("/ticket-buy",checkAuthCookie, fullFormatDateMiddleware,indexController.ticket_buy_get)

router.post("/ticket-buy", fullFormatDateMiddleware ,indexController.ticket_buy_post)

router.get("/payment",checkAuthCookie, fullFormatDateMiddleware,indexController.payment_get)

router.post("/payment",indexController.payment_post)

router.get("/contact", checkAuthCookie,indexController.contact_get)

router.get("/error", checkAuthCookie,indexController.error_get)

module.exports = router;