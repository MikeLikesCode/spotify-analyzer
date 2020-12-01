import { useContext } from "react";
import { parseCookies } from "./api/parseCookies";
import Login from "./components/login";
import Layout from "./components/layout";
import { Spinner } from "reactstrap";
import Image from "next/image";
import fetch from "isomorphic-unfetch";

const Playlist = ({ refresh_token, data }) => {
  console.log(data.items)
  return (
    <>
      {!refresh_token ? (
        <Login />
      ) : (
        <Layout>
          <h1> Your Playlist</h1>
          <div style={{display:'flex', flexWrap:'wrap', marginTop:'5vh'}}>
          {data.items.map((playlist,i) => (
            <div style={{textAlign:'center',width:'20%'}}>
            <Image className="tempImage" src={playlist.images[0].url} width={120} height={120}/>
            <p>{playlist.name}</p>
            </div>
          ))}
          </div>
        </Layout>
      )}
    </>
  );
};

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  let { refresh_token_v2 } = cookies;
  let json = null;

  if (refresh_token_v2) {
    const res = await fetch(
      `http://localhost:3001/api/list?refresh_token=${refresh_token_v2}`
    );
    json = await res.json();
  } else {
    json = null;
    refresh_token_v2 = null;
  }
  return {
    props: {
      refresh_token: refresh_token_v2,
      data: json,
    },
  };
}

export default Playlist;
