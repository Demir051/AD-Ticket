const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

const fullFormatDateMiddleware = require("../middlewares/formatFullDate");

const authenticateAdmin = require('../middlewares/isAdmin');

const checkAuthCookie = require('../middlewares/checkAuthCookie');


router.get("/",checkAuthCookie,authenticateAdmin ,adminController.admin_get);

router.get("/tickets" ,checkAuthCookie, fullFormatDateMiddleware , authenticateAdmin,adminController.tickets_get);

router.get("/add-ticket",checkAuthCookie,authenticateAdmin, adminController.add_ticket_get);

router.post("/add-ticket",authenticateAdmin, adminController.add_ticket_post);

router.get("/delete-ticket/:id",checkAuthCookie,authenticateAdmin, adminController.delete_ticket_get);

router.get("/edit-ticket/:id",checkAuthCookie,fullFormatDateMiddleware,authenticateAdmin, adminController.edit_ticket_get);

router.post("/edit-ticket/:id", authenticateAdmin,adminController.edit_ticket_post);

router.get("/add-admin-account",checkAuthCookie, authenticateAdmin,adminController.add_admin_get);

router.post("/add-admin-account", authenticateAdmin,adminController.add_admin_post);

router.get("/admin-accounts", checkAuthCookie,authenticateAdmin,adminController.admin_accounts_get);

router.get("/delete-admin/:id",checkAuthCookie, authenticateAdmin,adminController.delete_admin_get);

router.get("/login",checkAuthCookie, adminController.admin_login_get);

router.post("/login", adminController.admin_login_post);

router.get("/logout", adminController.admin_logout_get);

module.exports = router;