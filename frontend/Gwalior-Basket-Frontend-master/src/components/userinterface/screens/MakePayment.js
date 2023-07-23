import { useEffect } from "react";
import useRazorpay from "react-razorpay";
import { ServerURL } from "../../services/ServerServices";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MakePayment() {
  const Razorpay = useRazorpay();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  var user = useSelector((state) => state.user);
  var userdata = Object.values(user)[0];

  const products = useSelector((state) => state.cart);
  const productList = Object.values(products);

  let total = productList.reduce((a, b) => {
    return a + b.offerprice * b.qty;
  }, 0);

  const handlePayment = () => {
    const options = {
      key: "rzp_test_GQ6XaPC6gMPNwH",
      amount: total * 100,
      currency: "INR",
      name: "Gwalior Basket",
      description: "Test Transaction",
      image: `http://${ServerURL}/images/1.jpg`,

      handler: (res) => {
        dispatch({ type: "CLEAR_CART", payload: [] });
        navigate("/home");
      },
      prefill: {
        name: userdata[0].fullname,
        email: "youremail@example.com",
        contact: userdata[0].mobileno,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.open();
  };
  useEffect(function () {
    // eslint-disable-next-line
    var timeout = setTimeout(handlePayment, 1000);
    // eslint-disable-next-line
  }, []);

  return <div className="App"></div>;
}
