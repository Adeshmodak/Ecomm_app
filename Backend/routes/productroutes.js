const express=require("express");
const { route } = require("../app");
const { getallproducts,createproduct, updateproduct, deleteproduct, getproductdetails } = require("../controllers/productcontrollers");
const { isAuthenticatedUser,authorizeRole} = require("../middleware/auth");

const Router=express.Router();

Router.route("/products").get(isAuthenticatedUser,getallproducts);
Router.route("/products/new").post(isAuthenticatedUser,authorizeRole("admin"),createproduct);

Router.route("/products/:id").put(isAuthenticatedUser,authorizeRole("admin"),updateproduct)
.delete(isAuthenticatedUser,authorizeRole("admin"),deleteproduct)
.get(getproductdetails);

module.exports=Router