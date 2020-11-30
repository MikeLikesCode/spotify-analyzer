import { parseCookies } from "../api/parseCookies";
import Login from "../components/login";
import Layout from "../components/layout";
import fetch from "isomorphic-unfetch";
import Image from "next/image";
import Link from "next/link";
import { formatDuration, parsePitchClass } from "../../utils";
import Chart from "../components/featureData";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

const GreenButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 0.8rem;
  text-align: center !important;
  background-color: #1db954;
  border: 0;
  border-radius: 50px;
  text-transform: uppercase;
  text-decoration: none;
  padding: 5px 2px;
  width: 210px;
  margin-left: 0px;
  letter-spacing: 1.2px;
  margin-top: 15px;
  font-weight: 600;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #1db954;
  }
`;

const Page = ({ refresh_token, data }) => {
  console.log(data);
  return (
    <>
      {!refresh_token ? (
        <Login />
      ) : (
        <Layout>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop:'4vh',
              marginBottom: "6vh",
            }}
          >
            <div>
              <Image
                src={data.track.album.images[0].url}
                width="200"
                height="200"
              />
            </div>
            <div style={{ marginLeft: "25px" }}>
              <div style={{ marginBottom: "18px" }}>
                <h2>{data.track.name}</h2>
                <h4 style={{ fontWeight: "400" }}>
                  <span style={{ color: "#dbdbdb" }}>By</span>{" "}
                  {data.track.artists.map(({name,id},i) => {
                return(
                  <Link href={`/artist/${id}`}>
                    <span className="mainLink" key={i}>
                    {name}
                   {data.track.artists.length > 0 && i === data.track.artists.length - 1 ? '' : ', '}
                   </span>
                   </Link>
              )  
            })}
                </h4>
                <h5 style={{ fontWeight: "300", textTransform: "capitalize" }}>
                  {data.track.album.name}
                </h5>
              </div>
              <GreenButton
                target="_blank"
                href={data.track.external_urls.spotify}
              >
                {" "}
                <span style={{ fontSize: "1.5em", paddingRight: "6px" }}>
                  <FontAwesomeIcon icon={faSpotify} />
                </span>{" "}
                Listen on Spotify
              </GreenButton>
            </div>
            <div></div>
          </div>
        <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
        }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(100px, 1fr))",
              width: "100%",
              marginBottom: "50px",
              textAlign: "center",
              borderTop: "1px solid rgb(64, 64, 64)",
              borderLeft: "1px solid rgb(64, 64, 64)",
            }}
          >
            <div
              style={{
                padding: "15px 10px",
                borderBottom: "1px solid rgb(64, 64, 64)",
                borderRight: "1px solid rgb(64, 64, 64)",
              }}
            >
              <h4
                style={{
                  fontWeight: "600",
                  marginBottom: "1px",
                  fontSize: "30px",
                }}
              >
                {formatDuration(data.features.duration_ms)}
              </h4>
              <p style={{ fontWeight: "500", fontSize: "14px" }}>Duration</p>
            </div>

            <div
              style={{
                padding: "15px 10px",
                borderBottom: "1px solid rgb(64, 64, 64)",
                borderRight: "1px solid rgb(64, 64, 64)",
              }}
            >
              <h4
                style={{
                  fontWeight: "600",
                  marginBottom: "1px",
                  fontSize: "30px",
                }}
              >
                {parsePitchClass(data.features.key)}
              </h4>
              <p style={{ fontWeight: "500", fontSize: "14px" }}>Key</p>
            </div>

            <div
              style={{
                padding: "15px 10px",
                borderBottom: "1px solid rgb(64, 64, 64)",
                borderRight: "1px solid rgb(64, 64, 64)",
              }}
            >
              <h4
                style={{
                  fontWeight: "600",
                  marginBottom: "1px",
                  fontSize: "30px",
                }}
              >
                {data.features.mode === 1 ? "Major" : "Minor"}
              </h4>
              <p style={{ fontWeight: "500", fontSize: "14px" }}>Modality</p>
            </div>

            <div
              style={{
                padding: "15px 10px",
                borderBottom: "1px solid rgb(64, 64, 64)",
                borderRight: "1px solid rgb(64, 64, 64)",
              }}
            >
              <h4
                style={{
                  fontWeight: "600",
                  marginBottom: "1px",
                  fontSize: "30px",
                }}
              >
                {data.features.time_signature}
              </h4>
              <p style={{ fontWeight: "500", fontSize: "14px" }}>
                Time Signature
              </p>
            </div>

            <div
              style={{
                padding: "15px 10px",
                borderBottom: "1px solid rgb(64, 64, 64)",
                borderRight: "1px solid rgb(64, 64, 64)",
              }}
            >
              <h4
                style={{
                  fontWeight: "600",
                  marginBottom: "1px",
                  fontSize: "30px",
                }}
              >
                {Math.round(data.features.tempo)}
              </h4>
              <p style={{ fontWeight: "500", fontSize: "14px" }}>Tempo (BPM)</p>
            </div>

            <div
              style={{
                padding: "15px 10px",
                borderBottom: "1px solid rgb(64, 64, 64)",
                borderRight: "1px solid rgb(64, 64, 64)",
              }}
            >
              <h4
                style={{
                  fontWeight: "600",
                  marginBottom: "1px",
                  fontSize: "30px",
                }}
              >
                {data.track.popularity}%
              </h4>
              <p style={{ fontWeight: "500", fontSize: "14px" }}>Popularity</p>
            </div>

            <div
              style={{
                padding: "15px 10px",
                borderBottom: "1px solid rgb(64, 64, 64)",
                borderRight: "1px solid rgb(64, 64, 64)",
              }}
            >
              <h4
                style={{
                  fontWeight: "600",
                  marginBottom: "1px",
                  fontSize: "30px",
                }}
              >
                {data.analysis.bars.length}
              </h4>
              <p style={{ fontWeight: "500", fontSize: "14px" }}>Bars</p>
            </div>

            <div
              style={{
                padding: "15px 10px",
                borderBottom: "1px solid rgb(64, 64, 64)",
                borderRight: "1px solid rgb(64, 64, 64)",
              }}
            >
              <h4
                style={{
                  fontWeight: "600",
                  marginBottom: "1px",
                  fontSize: "30px",
                }}
              >
                {data.analysis.beats.length}
              </h4>
              <p style={{ fontWeight: "500", fontSize: "14px" }}>Beats</p>
            </div>

            <div
              style={{
                padding: "15px 10px",
                borderBottom: "1px solid rgb(64, 64, 64)",
                borderRight: "1px solid rgb(64, 64, 64)",
              }}
            >
              <h4
                style={{
                  fontWeight: "600",
                  marginBottom: "1px",
                  fontSize: "30px",
                }}
              >
                {data.analysis.sections.length}
              </h4>
              <p style={{ fontWeight: "500", fontSize: "14px" }}>Sections</p>
            </div>

            <div
              style={{
                padding: "15px 10px",
                borderBottom: "1px solid rgb(64, 64, 64)",
                borderRight: "1px solid rgb(64, 64, 64)",
              }}
            >
              <h4
                style={{
                  fontWeight: "600",
                  marginBottom: "1px",
                  fontSize: "30px",
                }}
              >
                {data.analysis.segments.length}
              </h4>
              <p style={{ fontWeight: "500", fontSize: "14px" }}>Segments</p>
            </div>
          </div>
          </div>
        
        <div style={{display:'flex',justifyContent:'center', }}>
        <div style={{position:'relative',width:'100%', maxWidth:'800px'}}>
          <Chart data={data.features} type="" />
          </div>
          </div>
        </Layout>
      )}
    </>
  );
};

export async function getServerSideProps({ req, params }) {
  const cookies = parseCookies(req);
  let { refresh_token_v2 } = cookies;
  let data = null;
  let id = null;
  if (refresh_token_v2) {
    id = params.id;
    const trackData = await fetch(
      `http://localhost:3001/api/track?refresh_token=${refresh_token_v2}&id=${id}`
    );
    const trackJson = await trackData.json();

    const featureData = await fetch(
      `http://localhost:3001/api/features?refresh_token=${refresh_token_v2}&id=${id}`
    );
    const featureJson = await featureData.json();

    const analysisData = await fetch(
      `http://localhost:3001/api/analysis?refresh_token=${refresh_token_v2}&id=${id}`
    );
    const analysisJson = await analysisData.json();
    data = {
      track: trackJson,
      features: featureJson,
      analysis: analysisJson,
    };
  } else {
    data = null;
    refresh_token_v2 = null;
    id = null;
  }
  return {
    props: {
      refresh_token: refresh_token_v2,
      data: data,
    },
  };
}
export default Page;
