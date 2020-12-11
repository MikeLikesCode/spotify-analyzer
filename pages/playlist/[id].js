import { parseCookies } from "../api/parseCookies";
import { playlistData , playlistFeatures } from "../api/spotify"
import Login from "../components/login";
import Layout from "../components/layout";
import Image from "next/image"
import TrackItem from '../components/trackItem'
import { Component } from "react";
import styled from 'styled-components'
import {formatWithCommas} from '../../utils'
import Chart from "../components/featureData";
import playlistStyles from './playlist.module.css'

const GreenButton = styled.a`
  display: inline-block;
  margin: 1vh 0px;
  color: #fff;
  font-size: 0.9rem;
  text-align: center !important;
  background-color: #1db954;
  border: 0;
  border-radius: 50px;
  text-decoration: none;
  padding: 8px 22px;
  width:250px;
  margin-left: 0px;
  letter-spacing: 1.2px;
  font-weight: 500;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #1db954;
  }
`;

class PlaylistPage extends Component{
  render(){
  return (
    <>
      {!this.props.refresh_token ? (
        <Login />
      ) : (
        <Layout>
            <div className={playlistStyles.container}>
            <div className={playlistStyles.details} >
            <Image src={this.props.data.playlist.images[0].url} width={300} height={300}/>
            <h2 style={{marginTop:'2vh'}}>{this.props.data.playlist.name}</h2>
            <p style={{marginBottom:'8px'}}>By {this.props.data.playlist.owner.display_name} · <span style={{color: "rgb(182, 182, 182)"}}>{formatWithCommas(this.props.data.playlist.tracks.total)} songs</span></p>
            <p style={{marginBottom:'5px'}}>{this.props.data.playlist.description}</p>
            
            <GreenButton>Get Recommendations</GreenButton>
            
            <div style={{maxWidth:'380px'}}>
            <Chart data={this.props.data.feature.audio_features} />
            </div>
            </div>
            <div className={playlistStyles.trackItem}>
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
  let songs = [];
  if (refresh_token_v2) {
    id = params.id;
    const playlistJson = await playlistData(refresh_token_v2,id);
    
    if(playlistJson !== null){
      for(var i = 0; i < playlistJson.tracks.items.length; i++ ){
       songs.push(playlistJson.tracks.items[i].track.id);
      }
    }

    const featureJson = await playlistFeatures(refresh_token_v2,songs);
    data = {
      playlist : playlistJson,
      feature: featureJson
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
