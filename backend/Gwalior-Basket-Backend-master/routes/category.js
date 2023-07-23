var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");

router.post(
  "/add_company_category",
  upload.single("icon"),
  function (req, res) {
    pool.query(
      "insert into categories(companyid, categoryname, description, icon, createdat, updatedat, createdby) values(?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.companyid,
        req.body.categoryname,
        req.body.description,
        req.file.originalname,
        req.body.createdat,
        req.body.updatedat,
        req.body.createdby,
      ],
      function (error, result) {
        if (error) {
          res.status(200).json({ status: false, message: "Server Error" });
        } else {
          res
            .status(200)
            .json({ status: true, message: "Category Added Successfully" });
        }
      }
    );
  }
);

router.get("/fetch_all_category", function (req, res) {
  pool.query("select * from categories ", function (error, result) {
    if (error) {
      res.status(500).json({ status: false, message: "Server Error" });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

router.post("/edit_company_category", function (req, res) {
  pool.query(
    "update categories set companyid = ?, categoryname = ?, description = ?, updatedat = ?, createdby = ? where categoryid = ?",
    [
      req.body.companyid,
      req.body.categoryname,
      req.body.description,
      req.body.updatedat,
      req.body.createdby,
      req.body.categoryid,
    ],
    function (error, result) {
      if (error) {
        res.status(200).json({ status: false, message: "Server Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Category Updated Successfully" });
      }
    }
  );
});

router.post("/edit_category_icon", upload.single("icon"), function (req, res) {
  pool.query(
    "update categories set icon = ? where categoryid = ?",
    [req.file.originalname, req.body.categoryid],
    function (error, result) {
      if (error) {
        res.status(200).json({ status: false, message: "Server Error" });
      } else {
        res.status(200).json({ status: true, message: "Icon Updated" });
      }
    }
  );
});

router.post("/delete_category", function (req, res) {
  pool.query(
    "delete from categories where categoryid = ?",
    [req.body.categoryid],
    function (error, result) {
      if (error) {
        res.status(200).json({ status: false, message: "Server Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Category Deleted Successfully" });
      }
    }
  );
});

module.exports = router;
