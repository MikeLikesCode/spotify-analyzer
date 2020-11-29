import { parseCookies } from "./api/parseCookies";
import Login from "./components/login";
import Layout from "./components/layout";
import User from "./components/user";

import fetch from "isomorphic-unfetch";

const Index = ({ refresh_token, data }) => {
  return (
    <>
      {!refresh_token ? (
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
    const profileData = await fetch(
      `http://localhost:3001/api/profile?refresh_token=${refresh_token_v2}`
    );
    const profileJson = await profileData.json();

    const tracksData = await fetch(
      `http://localhost:3001/api/tracks?refresh_token=${refresh_token_v2}&time_range=long_term&limit=10`
    );
    const trackJson = await tracksData.json();
    const artistData = await fetch(
      `http://localhost:3001/api/artists?refresh_token=${refresh_token_v2}&time_range=long_term&limit=10`
    );
    const artistJson = await artistData.json();

    const followedData = await fetch(
      `http://localhost:3001/api/followed?refresh_token=${refresh_token_v2}`
    );

    const followedJson = await followedData.json();

    const playlistData = await fetch(
      `http://localhost:3001/api/list?refresh_token=${refresh_token_v2}`
    );

    const playlistJson = await playlistData.json();

    data = {
      profile: profileJson,
      tracks: {
        long_term: trackJson,
      },
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
