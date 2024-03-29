import React from "react";
import { Spinner } from "reactstrap";
import userStyles from "../../styles/User.module.css";
import Image from "next/image";
import Link from 'next/link';
import TrackItem from '../components/trackItem'
import {logout} from '../api/spotify'
const User = (props) => {

  return (
    <>
      {props.data ? (
        <>
          <div className={userStyles.container}>
            <div>
              <div className={userStyles.profileImage}>
                <Image
                  className={userStyles.image}
                  src={props.data.profile.images[0] ? props.data.profile.images[0].url : "https://www.searchpng.com/wp-content/uploads/2019/02/Profile-PNG-Icon.png"}
                  alt="Album Cover"
                  width={130}
                  height={130}
                />
              </div>
              <div style={{display:'flex',justifyContent:'center'}}>
                <div>
                <h1 className={userStyles.displayName}>
                  {props.data.profile.display_name}
                </h1>
                <p className={userStyles.displayMember}>
                  Spotify {props.data.profile.product !== "open" ? props.data.profile.product : "Free"} Member
                </p>
                <div className={userStyles.userStats}>
                  <div>
                    <span className={userStyles.userNumbers}>
                      {props.data.profile.followers.total}{" "}
                    </span>
                    <p className={userStyles.underText}>Followers</p>
                  </div>
                  <div>
                    <span className={userStyles.userNumbers}>
                      {props.data.artists.following.artists.total}{" "}
                    </span>
                    <p className={userStyles.underText}>Following</p>
                  </div>
                  <div>
                    <span className={userStyles.userNumbers}>
                      {props.data.playlist.total}{" "}
                    </span>
                    <p className={userStyles.underText}>Playlist</p>
                  </div>
                </div>
                <a onClick={logout}className={userStyles.buttonLogout}>Logout</a>
              </div>
            </div>
          </div>
          </div>
          <div className={userStyles.topContainer}>
            <div className={userStyles.topCol}>
              <div className={userStyles.topHeadline}>
                <h3>Top Songs of All Time</h3>{" "}
                <Link href="/topTracks">
                <a className={userStyles.buttonMain}>See more</a>
                </Link>
              </div>
              <ul
                style={{
                  overflow: "hidden",
                  listStyle: "none",
                  paddingLeft: "0px",
                  padding:'5px',
                  paddingTop:'0px'
                }}
              >
                {props.data.tracks.items
                  .slice(0, 10)
                  .map((src,i) => {
                    return (
                      <div key={i}>
                  <TrackItem track={src}/>
                    </div>
                    );
                  })}
              </ul>
            </div>
            <div className={userStyles.topCol}>
              <div className={userStyles.topHeadline}>
                <h3>Top Artists of All Time</h3>{" "}
                <Link href="/topArtists">
                <a className={userStyles.buttonMain}>See more</a>
                </Link>
              </div>
              <ul
                style={{
                  overflow: "hidden",
                  listStyle: "none",
                  paddingLeft: "0px",
                  padding:'25px',
                  paddingTop:'0px'
                }}
              >
                {props.data.artists.long_term.items
                  .slice(0, 10)
                  .map((src, index) => {
                    return (
                   
                      <li className="mainLink" key={index} style={{ padding: "0rem 1rem" }}>
                           <Link href={`/artist/${src.id}`} >
                        <div
                          style={{
                            marginTop: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                            <Image
                              src={src.images[0].url}
                              alt="Album Cover"
                              width={80}
                              height={80}
                            />
                        
                            <div style={{ paddingLeft: "1rem" }}>
                              <h4
                                style={{
                                  fontSize: "1.1rem",
                                  marginBottom: "2px",
                                }}
                              >
                                {src.name}
                              </h4>
                              <p
                                style={{
                                  fontSize: "0.9rem",
                                  color: "rgb(155, 155, 155)",
                                  textTransform: "capitalize",
                                }}
                              >
                                {src.genres[0]}
                              </p>
                            </div>
                        </div>
                        </Link>
                      </li>
                     
                    );
                  })}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <Spinner
          style={{ width: "3rem", height: "3rem" }}
          size="sm"
          color="light"
        />
      )}
    </>
  );
};

export default User;
