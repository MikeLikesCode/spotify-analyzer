import {Component} from 'react'
import { parseCookies } from "./api/parseCookies";
import { longTermTrack, shortTermTrack, mediumTermTrack } from './api/spotify'
import Login from "./components/login";
import Layout from "./components/layout";
import { Spinner } from "reactstrap";
import TrackItem from './components/trackItem'
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

class topTracks extends Component {
  state = {
    tracksData : this.props.long_term,
    activeRange : 'long_term'
  }

dataCall = {
  long_term: this.props.long_term,
  medium_term: this.props.medium_term,
  short_term: this.props.short_term
}

changeRange(range){
  const data = this.dataCall[range];
  this.setState({tracksData : data, activeRange: range})
}

setActiveRange = range => this.changeRange(range);

  render(){
    const {tracksData,activeRange} = this.state
  return (
    <>
      {!this.props.refresh_token ? (
        <Login />
      ) : (
        <Layout>
      
      <div style={{display:'flex', justifyContent:'space-between'}}>
          <h2>Your Top tracks</h2>

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

        <ul style={{listStyle:'none', padding:0}}>
        {tracksData ? (
          tracksData.items.map((track,i) => (
            <div key={i}>
            <TrackItem track={track}/>
            </div>
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
  
    ltRes = await longTermTrack(refresh_token_v2);
    stRes = await shortTermTrack(refresh_token_v2);
    mdRes = await mediumTermTrack(refresh_token_v2);
    
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


export default topTracks;
