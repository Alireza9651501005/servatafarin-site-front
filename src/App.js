import React from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

/* main components */
import PaymentPage from "./components/paymentPage/paymentPage";
import PublicProfile from "./components/publicProfile/publicProfile";
import DownloadApp from "./components/downloadApp/downloadApp";
import FinalPaymentPage from "./components/finalPaymentPage/finalPaymentPage";

function App() {
	return (
		<>
			<ToastContainer
				rtl={false}
				position="bottom-right"
				hideProgressBar={true}
				closeOnClick={true}
				autoClose={4000}
			/>
			<Switch>
				<Route exact path="/payment/course/:mode/:orderKey">
					<FinalPaymentPage />
				</Route>
				<Route exact path="/payment/course/:courseId">
					<PaymentPage />
				</Route>
				<Route exact path="/profiles/:username">
					<PublicProfile />
				</Route>
				<Route exact path="/download-app">
					<DownloadApp />
				</Route>
			</Switch>
		</>
	);
}

export default App;
