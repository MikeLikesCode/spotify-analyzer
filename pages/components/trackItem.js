import React from 'react'
import Link from 'next/link';
import PropTypes from 'prop-types'
import Image from 'next/image'
import trackStyles from './track.module.css'
import {getYear, formatDuration} from '../../utils'


const TrackItem = ({ track }) => {
    return(
    <>
    {track ? (
    <li className="mainLink" style={{marginTop: "1.5rem"}}>
    <Link href={`/track/${track.id}`} >
     <div className={trackStyles.Container}>
        <div style={{display:'flex', alignItems:'center'}}>
         <div className={trackStyles.Artwork}>
            <Image key={track.album.images[0].url} src={track.album.images[0].url} alt="Album Cover" width={80} height={80} />
         </div>
         <div style={{ paddingLeft: "1rem" }}>
         <h4 style={{ width:'25vw', fontSize: "1.3rem", marginBottom: "2px", color: "white", overflow:"hidden", whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{track.name}</h4>
     
        <p style={{  fontSize: "0.9rem", padding: "0rem 0rem", margin:0 }}>
            
            {track.artists.map(({name},i) => {
                return(
                    <span key={i}>
                    {name}
                   {track.artists.length > 0 && i === track.artists.length - 1 ? '' : ', '}
                   </span>
              )  
            })}
            </p>
            <p style={{ fontSize: "0.9rem", color: "rgb(155, 155, 155)", marginBottom: "0px", padding: ".025rem 0rem", width:'100%'}}>
        {track.album.name} · {getYear(track.album.release_date)}
            </p>
         </div>
         </div>
         
         <div style={{margin:'0px 2vw'}}>
        <p>{formatDuration(track.duration_ms)}</p>
         </div>
         </div>
         </Link>
    </li>
    ) : (<> No Data</>)}
  </>
    )
};

TrackItem.propTypes = {
    track: PropTypes.object.isRequired,
  };

export default TrackItem