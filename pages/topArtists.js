import {Component} from 'react'
import { parseCookies } from "./api/parseCookies";
import { longTermArtist, mediumTermArtist, shortTermArtist } from "./api/spotify"
import Login from "./components/login";
import Layout from "./components/layout";
import { Spinner } from "reactstrap";
import Image from "next/image";
import Link from 'next/link'
import styled from "styled-components";
import ArtistStyles from './topArtist.module.css'
const RangeButton = styled.button`
  background-color: transparent;
  border:0;
  color: ${props => (props.isActive ? 'white' : 'gray')};
  font-weight: 500;
  padding: 10px;
  span {
    padding-bottom: 2px;
    border-bottom: 1px solid ${props => (props.isActive ? 'white' : `transparent`)};
    line-height: 1.5;
    white-space: nowrap;
  }
  &:nth-child(1){
    padding-left:0px;
  }
`;

class topArtists extends Component {
  state = {
    artistsData : this.props.long_term,
    activeRange : 'long_term'
  }

dataCall = {
  long_term: this.props.long_term,
  medium_term: this.props.medium_term,
  short_term: this.props.short_term
}

changeRange(range){
  const data = this.dataCall[range];
  this.setState({artistsData : data, activeRange: range})
}

setActiveRange = range => this.changeRange(range);

  render(){
    const {artistsData,activeRange} = this.state
  return (
    <>
      {!this.props.refresh_token ? (
        <Login />
      ) : (
        <Layout>
      
      <div className={ArtistStyles.container}>
          <h2>Your Top Artists</h2>

        <div style={{display:'flex'}}>
          <RangeButton isActive={activeRange === 'long_term'} onClick={() => this.setActiveRange('long_term')}>
            <span> All Time </span>
          </RangeButton>
           <RangeButton isActive={activeRange === 'medium_term'} onClick={() => this.setActiveRange('medium_term')}>
            <span> Last 6 Months </span>
          </RangeButton>
          <RangeButton isActive={activeRange === 'short_term'} onClick={() => this.setActiveRange('short_term')}>
            <span> Last 4 Weeks </span>
          </RangeButton>
        </div>
        </div>
        <ul className={ArtistStyles.artistList} style={{marginTop:'5vh',display: 'flex', flexWrap: 'wrap',listStyle: 'none', padding:'0'}}>
        {artistsData ? (
         
          artistsData.items.map(({id,images,name}, i) => (
            
            <li className={ArtistStyles.artistItem} key={i} > 
            <Link href={`/artist/${id}`} >
            <div>
            <Image className={ArtistStyles.coverImage} className="tempImage" key={images[0].url} src={images[0].url} width={150} height={150}/>
            <p className={ArtistStyles.artistName} key={i}>{name}</p>
            </div>
            </Link>
            </li>
            
          ))
        ) : (<Spinner
          style={{ width: "3rem", height: "3rem" }}
          size="sm"
          color="light"
        />)}
          </ul>
        </Layout>
      )}
      
    </>
  );
  
  }
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req);
  let { refresh_token_v2 } = cookies;

  return {
    props: {
      refresh_token: refresh_token_v2,
      long_term: await longTermArtist(refresh_token_v2),
      medium_term: await shortTermArtist(refresh_token_v2),
      short_term: await mediumTermArtist(refresh_token_v2),
    },
  };
}


export default topArtists;
