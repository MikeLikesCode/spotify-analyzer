import { parseCookies } from "./api/parseCookies";
import { getPlaylist } from "./api/spotify"
import Login from "./components/login";
import Layout from "./components/layout";
import Image from "next/image";
import Link from "next/link"
import playlistStyles from './playlistStyles.module.css'

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
            <div className={playlistStyles.playlistItem}>
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

  return {
    props: {
      refresh_token: refresh_token_v2,
      data: await getPlaylist(refresh_token_v2),
    },
  };
}

export default Playlist;
