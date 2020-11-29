import { useContext } from "react";
import { parseCookies } from "./api/parseCookies";
import Login from "./components/login";
import Layout from "./components/layout";
import { Spinner } from "reactstrap";
import Image from "next/image";
import fetch from "isomorphic-unfetch";

const Playlist = ({ refresh_token }) => {
  return (
    <>
      {!refresh_token ? (
        <Login />
      ) : (
        <Layout>
          <h1>Playlist</h1>
        </Layout>
      )}
    </>
  );
};

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  let { refresh_token_v2 } = cookies;

  if (refresh_token_v2 != null) {
  } else {
    json = null;
    refresh_token_v2 = null;
  }
  return {
    props: {
      refresh_token: refresh_token_v2,
    },
  };
}

export default Playlist;
