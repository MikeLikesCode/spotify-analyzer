import { parseCookies } from "./api/parseCookies";
import { history } from "./api/spotify";
import Login from "./components/login";
import Layout from "./components/layout";
import { Spinner } from "reactstrap";
import TrackItem from './components/trackItem'

const Recent = ({ refresh_token, data }) => {
  return (
    <>
      {!refresh_token ? (
        <Login />
      ) : (
        <Layout>
          {data ? (
            <>
              <h1 style={{ marginBottom: "2vh" }}>Recent Songs</h1>

              <ul
                style={{
                  overflow: "hidden",
                  listStyle: "none",
                  paddingLeft: "0px",
                }}
              >
                  {data.items.map((src,i) => {
                    return (
                      <div key={i}>
                      <TrackItem track={src.track}/>
                      </div>
                    );
                  })}
              </ul>
            </>
          ) : (
            <Spinner
              style={{ width: "3rem", height: "3rem" }}
              size="sm"
              color="light"
            />
          )}
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
    json = await history(refresh_token_v2);
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

export default Recent;
