import React, { useState, useEffect } from "react";
import {
  Avatar,
  TextField,
  Button,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useStyles } from "./ProductCss";
import { getData, postData } from "../services/ServerServices";
import Swal from "sweetalert2";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export default function Product() {
  var navigate = useNavigate();
  var classes = useStyles();

  var ADMIN = JSON.parse(localStorage.getItem("ADMIN"));

  const [companyId, setCompanyId] = useState(ADMIN.companyid);
  const [categoryId, setCategoryId] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [trending, setTrending] = useState("");
  const [deals, setDeals] = useState("");
  const [priceType, setPriceType] = useState("");
  const [priceTypes, setPriceTypes] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [image, setImage] = useState({
    fileName: "/assets/watermark.png",
    bytes: "",
  });

  const [error, setError] = useState({});

  const fetchAllCategory = async () => {
    var result = await getData("product/fetch_all_category");
    setCategoryIds(result.data);
  };
  useEffect(function () {
    fetchAllCategory();
  }, []);

  const handleError = (inputs, value) => {
    setError((prev) => ({ ...prev, [inputs]: value }));
  };
  const validation = () => {
    var isValid = true;

    if (!companyId) {
      handleError("companyId", "Invalid Company Id");
      isValid = false;
    }
    if (!categoryId || categoryId === "Choose Category...") {
      handleError("categoryId", "Pls Select Category");
      isValid = false;
    }
    if (!productName) {
      handleError("productName", "Pls Input Product Name");
      isValid = false;
    }
    if (!priceType || priceType === "Choose PriceType...") {
      handleError("priceType", "Pls Select PriceType");
      isValid = false;
    }
    if (!description) {
      handleError("description", "Pls Input Description");
      isValid = false;
    }
    if (!status) {
      handleError("status", "Pls Select Status");
      isValid = false;
    }
    if (!deals) {
      handleError("deals", "Pls Select Deals");
      isValid = false;
    }
    if (!trending) {
      handleError("trending", "Pls Select Trending");
      isValid = false;
    }

    return isValid;
  };

  const fillCategory = () => {
    return categoryIds.map((item) => {
      return <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>;
    });
  };

  const fetchAllPriceTypes = async () => {
    var result = await getData("product/fetch_all_pricetype");
    setPriceTypes(result.data);
  };
  useEffect(function () {
    fetchAllPriceTypes();
  }, []);

  const fillPrTypes = () => {
    return priceTypes.map((item) => {
      return <MenuItem value={item.prtype}>{item.prtype}</MenuItem>;
    });
  };

  const handleImage = (event) => {
    setImage({
      fileName: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };

  const clearValue = () => {
    setCategoryId("Choose Category");
    setProductName("");
    setDescription("");
    setStatus("");
    setTrending("");
    setDeals("");
    setPriceType("Choose PriceType");
    setImage({
      fileName: "/assets/watermark.png",
      bytes: "",
    });
  };

  const handleClick = async () => {
    if (validation()) {
      var cd = new Date();

      var dd =
        cd.getFullYear() +
        "/" +
        (cd.getMonth() + 1) +
        "/" +
        cd.getDate() +
        " " +
        cd.getHours() +
        ":" +
        cd.getMinutes() +
        ":" +
        cd.getSeconds();

      var formData = new FormData();

      formData.append("companyid", companyId);
      formData.append("categoryid", categoryId);
      formData.append("productname", productName);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("trending", trending);
      formData.append("deals", deals);
      formData.append("pricetype", priceType);
      formData.append("image", image.bytes);
      formData.append("createdat", dd);
      formData.append("updateat", dd);
      formData.append("createdby", "ADMIN");

      var result = await postData("product/add_new_product", formData);

      if (result.status) {
        Swal.fire({
          icon: "success",
          title: result.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: result.message,
        });
      }

      clearValue();
    }
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.box}>
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.rowStyle}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div>
                <img src="/assets/logo.png" alt="/assets/logo.png" width="40" />
              </div>
              <div className={classes.headingStyle}>Product Entry</div>
            </div>
            <div style={{ cursor: "pointer" }}>
              <FormatListBulletedIcon
                onClick={() => navigate("/dashboard/displayallproducts")}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={!error.companyId ? false : true}
              helperText={error.companyId}
              onFocus={() => handleError("companyId", null)}
              value={companyId}
              onChange={(event) => setCompanyId(event.target.value)}
              fullWidth
              label="Company Id"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category Id</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoryId}
                error={!error.categoryId ? false : true}
                helperText={error.categoryId}
                onFocus={() => handleError("categoryId", null)}
                label="CategoryId"
                onChange={(event) => setCategoryId(event.target.value)}
                // onChange={handleCategoryChange}
              >
                <MenuItem value={"Choose Category..."}>
                  Choose Category...
                </MenuItem>
                {fillCategory()}
              </Select>
              <div style={{ padding: 5, fontSize: 14, color: "red" }}>
                {error.categoryId}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={!error.productName ? false : true}
              helperText={error.productName}
              onFocus={() => handleError("productName", null)}
              value={productName}
              fullWidth
              onChange={(event) => setProductName(event.target.value)}
              label="Product Name"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={!error.description ? false : true}
              helperText={error.description}
              onFocus={() => handleError("description", null)}
              value={description}
              fullWidth
              onChange={(event) => setDescription(event.target.value)}
              label="Description"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="pType">Price Type</InputLabel>
              <Select
                labelId="pType"
                id="select_ptype"
                value={priceType}
                error={!error.priceType ? false : true}
                helperText={error.priceType}
                onFocus={() => handleError("priceType", null)}
                label="PriceType"
                onChange={(event) => setPriceType(event.target.value)}
                // onChange={handlePriceTypeChange}
              >
                <MenuItem value={"Choose PriceType..."}>
                  Choose PriceType...
                </MenuItem>
                {fillPrTypes()}
              </Select>
              <div style={{ padding: 5, fontSize: 14, color: "red" }}>
                {error.priceType}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl>
              <FormLabel id="trending">Trending:</FormLabel>
              <RadioGroup
                row
                aria-labelledby="trending"
                name="trending"
                value={trending}
                error={!error.trending ? false : true}
                helperText={error.trending}
                onFocus={() => handleError("trending", null)}
                onChange={(event) => setTrending(event.target.value)}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Yes"
                  checked={trending === "yes"}
                />
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label="No"
                  checked={trending === "no"}
                />
              </RadioGroup>
              <div style={{ padding: 5, fontSize: 14, color: "red" }}>
                {error.trending}
              </div>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl>
              <FormLabel id="deals">Deals:</FormLabel>
              <RadioGroup
                row
                aria-labelledby="deals"
                name="deals"
                value={deals}
                error={!error.deals ? false : true}
                helperText={error.deals}
                onFocus={() => handleError("deals", null)}
                onChange={(event) => setDeals(event.target.value)}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Yes"
                  checked={deals === "yes"}
                />
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label="No"
                  checked={deals === "no"}
                />
              </RadioGroup>
              <div style={{ padding: 5, fontSize: 14, color: "red" }}>
                {error.deals}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={6} className={classes.rowStyle}>
            <IconButton
              fullWidth
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImage}
              />
              <PhotoCamera />
            </IconButton>
            <Avatar
              alt="Img"
              variant="rounded"
              src={image.fileName}
              sx={{ width: 56, height: 56 }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl>
              <FormLabel id="status">Status:</FormLabel>
              <RadioGroup
                row
                aria-labelledby="status"
                name="status"
                value={status}
                error={!error.status ? false : true}
                onFocus={() => handleError("status", null)}
                onChange={(event) => setStatus(event.target.value)}
              >
                <FormControlLabel
                  value="Available"
                  control={<Radio />}
                  label="Available"
                />
                <FormControlLabel
                  value="Not Available"
                  control={<Radio />}
                  label="Not Available"
                />
              </RadioGroup>
              <div style={{ padding: 5, fontSize: 14, color: "red" }}>
                {error.status}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Button onClick={handleClick} fullWidth variant="contained">
              Submit
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button onClick={clearValue} fullWidth variant="contained">
              Reset
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
