import { parseCookies } from "./api/parseCookies";
import cookies from 'next-cookies'
import { getProfile, getTracks, getArtist, getFollowed, getPlaylist} from "./api/spotify"
import Login from "./components/login";
import Layout from "./components/layout";
import User from "./components/user";

const Index = ({refresh_token,data}) => {
  console.log(refresh_token)
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

export async function getServerSideProps (ctx) {
 
  const cookie = cookies(ctx).refresh_token_v2;
  console.log(JSON.stringify(cookie))
  let refresh_token_v2  = cookie;
  let data = null;

  if(refresh_token_v2){
    data = {
      profile: await getProfile(refresh_token_v2),
      tracks:  await getTracks(refresh_token_v2),
      artists: {
        long_term: await getArtist(refresh_token_v2),
        following: await getFollowed(refresh_token_v2),
      },
      playlist: await getPlaylist(refresh_token_v2),
    };
  }else{
    refresh_token_v2 = null;
    data = null;
  }
  
  return {
    props:{
      refresh_token: refresh_token_v2,
      data: await data,
    }
  };
}
export default Index;
