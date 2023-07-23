import React, { useEffect, useState } from "react";
import { ServerURL, getData } from "../../services/ServerServices";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function BestDeals() {
  const theme = useTheme();

  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const lg = useMediaQuery(theme.breakpoints.down("lg"));
  // eslint-disable-next-line
  const xl = useMediaQuery(theme.breakpoints.down("xl"));

  const [dealsProduct, setDealsProduct] = useState([]);

  const fetchProducts = async () => {
    var result = await getData("userinterface/fetch_all_productsdeals");
    setDealsProduct(result.data);
  };
  useEffect(function () {
    fetchProducts();
  }, []);

  function ExplorImage() {
    return dealsProduct.map((item) => {
      return (
        <div
          style={{
            width: "10%",
            padding: "10px 10px 0px 10px",
            background:
              "linear-gradient(180deg, rgba(93,9,121,1) 3%, rgba(122,49,185,1) 92%)",
            borderRadius: "10%",
            margin: 3,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              color: "rgba(93,9,121,1)",
              background: "#fff",
              fontFamily: "Poppins",
              fontSize: xs ? 4 : sm ? 6 : md ? 8 : lg ? 14 : 14,
              fontWeight: "bolder",
              textAlign: "center",
              padding: 3,
              borderRadius: "0.3rem",
              width: "60%",
              marginBottom: "15%",
            }}
          >
            Best Deals
          </div>
          <div
            style={{
              color: "#fff",
              fontFamily: "Poppins",
              fontSize: xs ? 4 : sm ? 6 : md ? 8 : lg ? 16 : 16,
              fontWeight: "bolder",
              textAlign: "center",
              marginBottom: "15%",
            }}
          >
            {item.productname}
          </div>
          <img
            src={`${ServerURL}/images/${item.image}`}
            alt={`${ServerURL}/images/${item.image}`}
            style={{ width: "60%" }}
          />
        </div>
      );
    });
  }

  return (
    <div>
      <h3>Best Deals</h3>
      <div
        style={{
          padding: 5,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {ExplorImage()}
      </div>
    </div>
  );
}
