var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
var jwt = require("jsonwebtoken");

router.post("/add_new_company", upload.single("logo"), function (req, res) {
  pool.query(
    "insert into company(companyname, ownername, emailaddress, mobilenumber, address, state, city, logo, password, status, createdat, updateat, createdby) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      req.body.companyname,
      req.body.ownername,
      req.body.emailaddress,
      req.body.mobilenumber,
      req.body.address,
      req.body.state,
      req.body.city,
      req.file.originalname,
      req.body.password,
      req.body.status,
      req.body.createdat,
      req.body.updateat,
      req.body.createdby,
    ],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: "Server Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Company Registerd Successfully" });
      }
    }
  );
});

router.get("/fetch_all_company", function (req, res) {
  pool.query(
    "select C.*,(select S.statename from states S where S.stateid = C.state) as statename,(select CC.cityname from Cities CC where CC.cityid = C.city) as cityname from company C",
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(200).json({ status: false, message: "Server Error" });
      } else {
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});

router.post("/edit_company_data", function (req, res) {
  pool.query(
    "update company set companyname = ?, ownername = ?, emailaddress = ?, mobilenumber = ?, address = ?, state = ?, city = ?, status = ?,  updateat = ?, createdby = ? where companyid = ?",
    [
      req.body.companyname,
      req.body.ownername,
      req.body.emailaddress,
      req.body.mobilenumber,
      req.body.address,
      req.body.state,
      req.body.city,
      req.body.status,
      req.body.updateat,
      req.body.createdby,
      req.body.companyid,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(200).json({ status: false, message: "Server Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Company Updated Successfully" });
      }
    }
  );
});

router.post("/edit_company_logo", upload.single("logo"), function (req, res) {
  pool.query(
    "update company set logo = ? where companyid = ?",
    [req.file.originalname, req.body.companyid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(200).json({ status: false, message: "Server Error" });
      } else {
        res.status(200).json({ status: true, message: "Logo Updated" });
      }
    }
  );
});

router.post("/delete_company_data", function (req, res) {
  pool.query(
    "delete from company where companyid = ?",
    [req.body.companyid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(200).json({ status: false, message: "Server Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Company Deleted Successfully" });
      }
    }
  );
});

const verifyJWT = (req, res, next) => {
  console.log(req.headers);

  const token = req.headers.authorization;

  console.log("Token:", token);

  if (!token) {
    res.json({
      auth: false,
      message: "We need a token, please give it to us next time",
    });
  } else {
    jwt.verify(
      token,
      "thisissecretkeyforcompanylogininGwaliorBasket",
      (err, decoded) => {
        console.log(decoded);
        if (err) {
          console.log(err);
          res.json({ auth: false, message: "you are failed to authenticate" });
        } else {
          req.emailaddress = decoded.emailaddress;
          next();
        }
      }
    );
  }
};

router.post("/chk_company_login", function (req, res) {
  pool.query(
    "select * from company where (emailaddress = ? or mobilenumber = ?) and password = ? and status = 'Verified'",
    [req.body.emailaddress, req.body.emailaddress, req.body.password],
    function (error, result) {
      if (error) {
        return res.status(200).json({ status: false, message: "Server Error" });
      } else {
        if (result.length == 0)
          return res.status(200).json({
            status: false,
            message: "Invalid Email Address/Mobile Number/Password",
          });
        else {
          var token = jwt.sign(
            { emailaddress: req.body.emailaddress },
            "thisissecretkeyforcompanylogininGwaliorBasket",
            { expiresIn: "1h" }
          );

          return res.status(200).json({
            data: result[0],
            status: true,
            message: "Valid Login",
            token: token,
          });
        }
      }
    }
  );
});

module.exports = router;
