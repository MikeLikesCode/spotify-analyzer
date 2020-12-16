import { parseCookies } from "../api/parseCookies";
import Login from "../components/login";
import Link from 'next/link';
import Layout from "../components/layout";
import fetch from "isomorphic-unfetch";
import Image from "next/image";
import artistStyles from './artist.module.css'
import {formatWithCommas} from '../../utils'
import styled from "styled-components"
import { Component } from "react";
import { artistData, followedData, relatedData } from "../api/spotify";

const GreenButton = styled.a`
  color: #fff;
  cursor: pointer;
  font-size: 0.95rem;
  text-align: center !important;
  background-color: #1db954;
  border: 0;
  border-radius: 50px;
  text-transform: uppercase;
  text-decoration: none;
  padding: 0.5rem 2rem;
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

class artistPage extends Component{

  constructor(props){
    super(props);
    this.state = {
      isFollowing : this.props.data.following[0]
    }
    this.handleFollowed = this.handleFollowed.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.data.following[0] !== this.state.isFollowing) {
      this.setState({ isFollowing: nextProps.data.following[0] });
    }
  }
     handleFollowed(){
      if(!this.state.isFollowing){
        fetch(`https://spotify-analysis-next.herokuapp.com/api/followArtist?refresh_token=${this.props.refresh_token}&id=${this.props.data.artist.id}` , {
          method: 'PUT',
          headers:{
            'Accept' : 'application/json',
            'Content-Type':'application/json'
          }
        })

        this.setState({isFollowing: true})
      } else if (this.state.isFollowing){
        fetch(`https://spotify-analysis-next.herokuapp.com/api/unfollowArtist?refresh_token=${this.props.refresh_token}&id=${this.props.data.artist.id}` , {
          method: 'DELETE',
          headers:{
            'Accept' : 'application/json',
            'Content-Type':'application/json'
          }
        })
        this.setState({isFollowing: false})
      }
      
    }
  
  render(){
  return (
    <>
      {!this.props.refresh_token ? (
        <Login />
      ) : (
        <Layout>
        <div style={{display:'flex', justifyContent:'center', textAlign:'center', marginTop:'5vh'}}>
            <div>
            <div style={{marginBottom:'2vh'}}>
         <Image key={(this.props.data.artist.images ? this.props.data.artist.images[0].url : 'null')} className={artistStyles.Image} src={( this.props.data.artist.images ? this.props.data.artist.images[0].url : 'https://www.searchpng.com/wp-content/uploads/2019/02/Profile-PNG-Icon.png')} width={190} height={190}/>
         <h1 style={{marginTop:'1vh',fontSize:'3rem'}}>{this.props.data.artist.name}</h1>   
         <div style={{margin:'15px 0px'}}>
      <GreenButton onClick={this.handleFollowed}>{this.state.isFollowing ? "Following" : "Follow"}</GreenButton>
         </div> 
         </div>
         <div style={{display:'flex', justifyContent:'center'}}>
         <div style={{ padding:'0px 25px'}}>
             
             <span style={{fontWeight:'500',color:'#1DB954' , fontSize:'18px'}}>{formatWithCommas(this.props.data.artist.followers.total)}</span>
             <p>Followers</p>
              </div>
             <div style={{ padding:'0px 25px'}}>
                 
         {this.props.data.artist.genres.map((genre,i)=>{
             return(
               <p style={{textTransform:'capitalize', fontWeight:'500', color:'#1DB954', fontSize:'18px', margin:0}} key={i}>
                   {genre}
                   </p>  
             )
         })}
         <p>Genres</p>
         </div>
         <div style={{ padding:'0px 25px'}}>
             
             <span style={{fontWeight:'500',color:'#1DB954' , fontSize:'18px'}}>{this.props.data.artist.popularity}%</span>
             <p>Popularity</p>
              </div>
      
         </div>

         <div style={{marginTop:'5vh'}}>
         <p style={{fontWeight:'500', fontSize:'25px'}}>Related Artists:</p>
         <ul style={{display:'flex', flexWrap:'wrap', justifyContent:'center', padding:'0', listStyle:'none'}}>
         {this.props.data.related.artists.map((artist,i) => {
           return(
          
             <li key={i} className={artistStyles.relatedItem}>
                 <Link className="mainLink" href={`/artist/${artist.id}`} >
                <div>
             <Image key={(artist.images ? artist.images[0].url : null)} className={artistStyles.Image} src={(artist.images ? artist.images[0].url : null)} width={120} height={120}/>
             <p>{artist.name}</p>
             </div>
             </Link>
             </li>
           )
         })}
         </ul>
         </div>
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

    const trackJson = await artistData(refresh_token_v2,id);
    const relatedJson = await relatedData(refresh_token_v2,id);
    const followingJson = await followedData(refresh_token_v2,id);

    data = {
      artist : trackJson,
      related : relatedJson,
      following : followingJson
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
export default artistPage;
