var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");

router.post("/add_banner_images", upload.any(), function (req, res) {
  console.log(req.body);
  console.log(req.files);

  var file_str = "";

  req.files.map((item) => {
    file_str += item.originalname + ",";
  });

  pool.query(
    "insert into banner(bannerpicture, status) values(?, ?)",
    [file_str, req.body.status],
    function (error, result) {
      if (error) {
        console.log(error);

        res.status(500).json({ status: false, message: "Server Error" });
      } else {
        console.log(result);

        res.status(200).json({
          status: true,
          message: "Banner-Image Added Successfully!!!",
        });
      }
    }
  );
});

router.get("/fetch_banner_images", function (req, res) {
  pool.query("select * from banner", function (error, result) {
    if (error) {
      console.log(error);

      res.status(500).json({ status: false, data: [] });
    } else {
      console.log(result);

      res.status(200).json({ status: true, data: result });
    }
  });
});

module.exports = router;
