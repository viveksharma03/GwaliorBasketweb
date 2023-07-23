var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");

router.post("/fetch_all_products", function (req, res) {
  pool.query(
    "select * from products where categoryid = ?",
    [req.body.categoryid],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: "Server Error" });
      } else {
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});

router.post("/add_productlist", upload.any(), function (req, res) {
  console.log(req.body);
  console.log(req.files);

  var file_str = "";

  req.files.map((item) => {
    file_str += item.filename + ",";
  });

  pool.query(
    "insert into listproduct (companyid, categoryid, productid, weight, price, offerprice, description, images, createdat, updatedat, createdby) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      req.body.companyid,
      req.body.categoryid,
      req.body.productid,
      req.body.weight,
      req.body.price,
      req.body.offerprice,
      req.body.description,
      file_str,
      req.body.createdat,
      req.body.updatedat,
      req.body.createdby,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(200).json({ status: false, message: "Server Error" });
      } else {
        res.status(200).json({ status: true, message: "Added Successfully" });
      }
    }
  );
});

module.exports = router;
