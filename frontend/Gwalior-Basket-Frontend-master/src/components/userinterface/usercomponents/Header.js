import { useState } from "react";
import { AppBar, Paper, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import HomePageDrawer from "./HomePageDrawer";
import Badge from "@mui/material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const theme = useTheme();
  const navigate = useNavigate();

  var products = useSelector((state) => state.cart);
  var totalproducts = Object.keys(products);

  console.log("Total Product:", totalproducts);

  var location = useLocation();
  console.log("HOME:", location);

  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);

  const handleOpenDrawer = () => {
    setOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <AppBar
        position="static"
        style={{
          display: "flex",
          alignItems: "left",
          justifyContent: "center",
          background: "rgba(93,9,121,1)",
          height: 50,
        }}
      >
        <div style={{ marginLeft: 10, display: "flex", alignItems: "center" }}>
          {matches ? <MenuIcon onClick={handleOpenDrawer} /> : <></>}
          <div
            style={{ marginLeft: 30, display: "flex", alignItems: "center" }}
          >
            <LocationOnIcon />
            <span
              style={{
                fontFamily: "Poppins",
                fontWeight: "bold",
                marginLeft: 5,
              }}
            >
              Gwalior
            </span>
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontFamily: "Poppins",
              fontWeight: 500,
              width: !matches ? 250 : 50,
              display: "flex",
              justifyContent: "space-between",
              paddingRight: 20,
            }}
          >
            {!matches ? (
              <>
                <span>Offers</span>
                <span>Deals</span>
                <span>Coupons</span>

                <span onClick={() => navigate("/cart")}>
                  <Badge badgeContent={totalproducts.length} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </span>
                <span>
                  <PersonIcon />
                </span>
              </>
            ) : (
              <>
                <span>
                  <ShoppingCartIcon />
                </span>
                <span>
                  <PersonIcon />
                </span>
              </>
            )}
          </div>
        </div>
      </AppBar>

      {location.pathname === "/home" ? (
        <Paper
          style={{
            width: "100%",
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
          }}
          elevation={1}
        >
          <img
            src="/assets/targetlogo.webp"
            style={{ marginLeft: 50, width: 45, height: 45 }}
            alt="/assets/targetlogo.webp"
          />
          <div
            style={{
              marginLeft: 30,
              width: 500,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button style={{ color: "rgba(93,9,121,1)", fontWeight: 600 }}>
              Category
            </Button>
            <Button style={{ color: "rgba(93,9,121,1)", fontWeight: 600 }}>
              Deals
            </Button>
            <Button style={{ color: "rgba(93,9,121,1)", fontWeight: 600 }}>
              What's New
            </Button>
            <Button style={{ color: "rgba(93,9,121,1)", fontWeight: 600 }}>
              Trending
            </Button>
          </div>
        </Paper>
      ) : (
        <></>
      )}
      <HomePageDrawer open={open} setOpen={setOpen} />
    </div>
  );
}
