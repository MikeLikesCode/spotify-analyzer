import { parseCookies } from "./api/parseCookies";
import { getProfile, getTracks, getArtist, getFollowed, getPlaylist} from "./api/spotify"
import Login from "./components/login";
import Layout from "./components/layout";
import User from "./components/user";

const Index = ({ refresh_token, data }) => {
  return (
    <>
      {refresh_token == null ? (
        <Login />
      ) : (
        <Layout>
          <User data={data} />
        </Layout>
      )}
    </>
  );
};

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  let { refresh_token_v2 } = cookies;
  let data = null;

  if (refresh_token_v2) {

    const profileJson = await getProfile(refresh_token_v2);
    const tracksJson = await getTracks(refresh_token_v2);
    const artistJson = await getArtist(refresh_token_v2);
    const followedJson = await getFollowed(refresh_token_v2);
    const playlistJson = await getPlaylist(refresh_token_v2);


    data = {
      profile: profileJson,
      tracks:  tracksJson,
      artists: {
        long_term: artistJson,
        following: followedJson,
      },
      playlist: playlistJson,
    };
  } else {
    data = null;
    refresh_token_v2 = null;
  }
  return {
    props: {
      refresh_token: refresh_token_v2,
      data: data,
    },
  };
}
export default Index;
