import React from "react";
import Head from "next/head";
import Navbar from "./navbar";
import layoutStyles from "./layout.module.css";
const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <meta
          name="description"
          content="View your Spotify data in an easy way!"
        />
        <title>Spotify Analyzer</title>
      </Head>

      <div
        style={{
          color: "white",
          backgroundColor: "#171515",
          display: "flex",
          margin: "0",
        }}
      >
        <Navbar />
        <div className={layoutStyles.Container}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
