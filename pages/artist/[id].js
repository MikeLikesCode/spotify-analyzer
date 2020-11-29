import { parseCookies } from "../api/parseCookies";
import Login from "../components/login";
import Link from 'next/link';
import Layout from "../components/layout";
import fetch from "isomorphic-unfetch";
import Image from "next/image";
import artistStyles from './artist.module.css'
import {formatWithCommas} from '../../utils'

const Page = ({ refresh_token, data }) => {
    console.log(data)
  return (
    <>
      {!refresh_token ? (
        <Login />
      ) : (
        <Layout>
        <div style={{display:'flex', justifyContent:'center', textAlign:'center', marginTop:'5vh'}}>
            <div>
            <div style={{marginBottom:'2vh'}}>
         <Image key={data.artist.images[0].url} className={artistStyles.Image} src={data.artist.images[0].url} width={190} height={190}/>
         <h1 style={{marginTop:'1vh',fontSize:'3rem'}}>{data.artist.name}</h1>    
         </div>
         <div style={{display:'flex', justifyContent:'center'}}>
         <div style={{ padding:'0px 25px'}}>
             
             <span style={{fontWeight:'500',color:'#1DB954' , fontSize:'18px'}}>{formatWithCommas(data.artist.followers.total)}</span>
             <p>Followers</p>
              </div>
             <div style={{ padding:'0px 25px'}}>
                 
         {data.artist.genres.map((genre,i)=>{
             return(
               <p style={{textTransform:'capitalize', fontWeight:'500', color:'#1DB954', fontSize:'18px', margin:0}} key={i}>
                   {genre}
                   </p>  
             )
         })}
         <p>Genres</p>
         </div>
         <div style={{ padding:'0px 25px'}}>
             
             <span style={{fontWeight:'500',color:'#1DB954' , fontSize:'18px'}}>{data.artist.popularity}%</span>
             <p>Popularity</p>
              </div>
      
         </div>

         <div style={{marginTop:'5vh'}}>
         <p style={{fontWeight:'500', fontSize:'25px'}}>Related Artists:</p>
         <ul style={{display:'flex', flexWrap:'wrap', justifyContent:'center', padding:'0', listStyle:'none'}}>
         {data.related.artists.map((artist,i) => {
           return(
          
             <li className="mainLink" style={{padding:'5px 15px', width:'20%'}}>
                 <Link className="mainLink" href={`/artist/${artist.id}`} >
                <div>
             <Image key={artist.images[0].url} className={artistStyles.Image} src={artist.images[0].url} width={120} height={120}/>
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
};

export async function getServerSideProps({ req, params }) {
  const cookies = parseCookies(req);
  let { refresh_token_v2 } = cookies;
  let data = null;
  let id = null;
  if (refresh_token_v2) {
    id = params.id;
    const trackData = await fetch(
      `http://localhost:3001/api/artist?refresh_token=${refresh_token_v2}&id=${id}`
    );
    const trackJson = await trackData.json();

    const relatedData = await fetch(
      `http://localhost:3001/api/relatedArtist?refresh_token=${refresh_token_v2}&id=${id}`
    );
    const relatedJson = await relatedData.json();

    data = {
      artist : trackJson,
      related : relatedJson
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
