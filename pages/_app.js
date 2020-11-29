import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export function reportWebVitals(metric) {
  console.log(metric)
}

function SpotifyAnalyzer({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default SpotifyAnalyzer;
