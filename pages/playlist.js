import { parseCookies } from "./api/parseCookies";
import { getPlaylist, userPlaylist } from "./api/spotify"
import Login from "./components/login";
import Layout from "./components/layout";
import Image from "next/image";
import Link from "next/link"
import fetch from "isomorphic-unfetch";

const Playlist = ({ refresh_token, data }) => {
  return (
    <>
      {!refresh_token ? (
        <Login />
      ) : (
        <Layout>
          <h1> Your Playlist</h1>
          <div style={{display:'flex', flexWrap:'wrap', marginTop:'5vh'}}>
          {data.items.map((playlist,i) => (
            <div className="mainLink" style={{textAlign:'center',width:'20%', marginBottom:'10px'}}>
               <Link href={`/playlist/${playlist.id}`} >
              <div>
            <Image className="tempImage" src={playlist.images[0].url} width={150} height={150}/>
            <h6 style={{margin:'10px 0px'}}>{playlist.name}</h6>
            </div>
            </Link>
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
    json = await getPlaylist(refresh_token_v2)
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
