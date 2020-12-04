import { parseCookies } from "../api/parseCookies";
import Login from "../components/login";
import Layout from "../components/layout";
import Image from "next/image"
import fetch from "isomorphic-unfetch";
import TrackItem from '../components/trackItem'
import { Component } from "react";

class PlaylistPage extends Component{
  render(){
    console.log(this.props.data)
  return (
    <>
      {!this.props.refresh_token ? (
        <Login />
      ) : (
        <Layout>
            <div style={{display:'flex'}}>
            <div style={{width:'35%', minWidth:'250px',textAlign:'center'}}>
            <Image src={this.props.data.playlist.images[0].url} width={300} height={300}/>
            <h2 style={{marginTop:'2vh'}}>{this.props.data.playlist.name}</h2>
            <p style={{marginBottom:'8px'}}>By {this.props.data.playlist.owner.display_name}</p>
            <p>{this.props.data.playlist.description}</p>
            </div>
            <div style={{flexGrow:'1',paddingLeft:'5vw'}}>
            <ul style={{padding:'0',listStyle:'none'}}>
            {this.props.data.playlist.tracks.items.map((track,i) => (
                <TrackItem track={track.track}/>
            ))}   
            </ul>                                                     
            </div>
            </div>
            
        </Layout>
      )}
    </>
  );
        }
};

export async function getServerSideProps({ req, params }) {
  const cookies = parseCookies(req);
  let { refresh_token_v2 } = cookies;
  let data = null;
  let id = null;
  if (refresh_token_v2) {
    id = params.id;
    const playlistData = await fetch(
      `http://localhost:3001/api/getPlaylist?refresh_token=${refresh_token_v2}&id=${id}`
    );
    const  playlistJson = await  playlistData.json();

    data = {
      playlist :  playlistJson,
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
export default PlaylistPage;
