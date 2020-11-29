import {Component} from 'react'
import { parseCookies } from "./api/parseCookies";
import Login from "./components/login";
import Layout from "./components/layout";
import { Spinner } from "reactstrap";
import Image from "next/image";
import Link from 'next/link'
import fetch from "isomorphic-unfetch";
import styled from "styled-components";

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
  console.log(this.dataCall[range]);
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
      
      <div style={{display:'flex', justifyContent:'space-between'}}>
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
        <ul style={{marginTop:'5vh',display: 'flex', flexWrap: 'wrap',listStyle: 'none', padding:'0'}}>
        {artistsData ? (
         
          artistsData.items.map(({id,external_urls,images,name}, i) => (
            
            <li className="mainLink" key={i} style={{textAlign: 'center', padding:'10px 15px', width:'20%'}}> 
            <Link href={`/artist/${id}`} >
            <div>
            <Image className="tempImage" key={images[0].url} style={{borderRadius:'50%'}} src={images[0].url} width={150} height={150}/>
            <p style={{paddingTop:'8px', textTransform:'capitalize', fontSize:'20px', fontWeight:'500'}} key={i}>{name}</p>
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
  let ltRes = null;
  let stRes = null;
  let mdRes = null;

  if (refresh_token_v2) {
    const longTerm = await fetch(
      `http://localhost:3001/api/artists?refresh_token=${refresh_token_v2}&time_range=long_term&limit=50`
    );
    ltRes = await longTerm.json();

    const shortTerm = await fetch(
      `http://localhost:3001/api/artists?refresh_token=${refresh_token_v2}&time_range=short_term&limit=50`
    );
    stRes = await shortTerm.json();

    const medTerm = await fetch(
      `http://localhost:3001/api/artists?refresh_token=${refresh_token_v2}&time_range=medium_term&limit=50`
    );
    mdRes = await medTerm.json();
    
  } else {
    json = null;
    refresh_token_v2 = null;
  }
  return {
    props: {
      refresh_token: refresh_token_v2,
      long_term: ltRes,
      medium_term: mdRes,
      short_term: stRes,
    },
  };
}


export default topArtists;
