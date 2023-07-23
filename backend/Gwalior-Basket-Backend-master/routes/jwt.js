var { expressjwt: jwt } = require("express-jwt");

// Jwt Function
function jwts() {
  return jwt({
    secret: "thisissecretkeyforcompanylogininGwaliorBasket",
    algorithms: ["RS256", "HS256"],
  }).unless({
    path: [
      // Public Routes that doesn't require Authentication
      "/",
      "/company/chk_company_login",
      "/userinterface/fetch_banner_images",
      "/userinterface/fetch_all_productstrending",
      "/userinterface/fetch_all_category",
      "/userinterface/fetch_all_productsdeals",
      "/userinterface/fetch_all_productlist_by_product",
      "/userinterface/fetch_products",
    ],
  });
}

module.exports = jwts;
