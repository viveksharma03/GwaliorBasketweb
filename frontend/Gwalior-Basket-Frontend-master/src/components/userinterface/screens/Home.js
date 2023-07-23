import Header from "../usercomponents/Header";
import MainSlider from "../usercomponents/MainSlider";
import DealsSlider from "../usercomponents/DealsSlider";
import Spacer from "../usercomponents/Spacer";
import Trending from "../usercomponents/Trending";
import Footer from "../usercomponents/Footer";
import ExploreCategory from "../usercomponents/ExplorCategory";
import BestDeals from "../usercomponents/BestDeals";
import TrendingProducts from "../usercomponents/TrendingProducts";

export default function Home(props) {
  return (
    <div>
      <div style={{ width: "100%" }}>
        <Header />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          margin: 10,
        }}
      >
        <div style={{ width: "90%" }}>
          <MainSlider />
        </div>
        <Spacer />
        <div style={{ width: "90%" }}>
          <DealsSlider />
        </div>
        <Spacer />
        <div style={{ width: "90%" }}>
          <Trending />
        </div>
        <Spacer />
        <div style={{ width: "90%" }}>
          <ExploreCategory />
        </div>
        <Spacer />
        <div style={{ width: "90%" }}>
          <BestDeals />
        </div>
        <Spacer />
        <div style={{ width: "90%" }}>
          <TrendingProducts />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
