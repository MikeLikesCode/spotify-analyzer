import { parseCookies } from "../api/parseCookies";
import { trackData, trackAnalysis, trackFeature } from "../api/spotify";
import Login from "../components/login";
import Layout from "../components/layout";
import Image from "next/image";
import Link from "next/link";
import { formatDuration, parsePitchClass } from "../../utils";
import Chart from "../components/featureData";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import trackStyles from './trackStyles.module.css'


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

  @media only screen and (max-width:600px){
    width:100%;
    margin-bottom:5vh;
  }
`;

const Page = ({ refresh_token, data }) => {
  return (
    <>
      {!refresh_token ? (
        <Login />
      ) : (
        <Layout>
          <div className={trackStyles.container} >
            <div style={{marginRight:'2vw'}}>
              <Image
                src={data.track.album.images[0].url}
                width="200"
                height="200"
              />
            </div>
            <div >
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
        <div className={trackStyles.track} >
          <div className={trackStyles.dataChart}>
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
        
        <div style={{display:'flex',justifyContent:'center', paddingBottom:'15vh' }}>
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

    const trackJson = await trackData(refresh_token_v2,id);
    const featureJson = await trackFeature(refresh_token_v2,id);
    const analysisJson = await trackAnalysis(refresh_token_v2,id);
    
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
