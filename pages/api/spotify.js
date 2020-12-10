import fetch from 'isomorphic-unfetch'

export const getProfile = async (refresh_token) => {
    
    const profileData = await fetch(
        `http://localhost:3001/api/profile?refresh_token=${refresh_token}`
      );
      const profileJson = await profileData.json();
    
      return profileJson
};

export const getTracks = async (refresh_token) => {
    
    const tracksData = await fetch(
        `http://localhost:3001/api/tracks?refresh_token=${refresh_token}&time_range=long_term&limit=10`
      );
    const trackJson = await tracksData.json();

    return trackJson
};

export const getArtist = async (refresh_token) => {
    
    const artistData = await fetch(
        `http://localhost:3001/api/artists?refresh_token=${refresh_token}&time_range=long_term&limit=10`
      );
    const artistJson = await artistData.json();

    return artistJson
};

export const getFollowed = async (refresh_token) => {
    
    const followedData = await fetch(
        `http://localhost:3001/api/followed?refresh_token=${refresh_token}`
      );
    
      const followedJson = await followedData.json();

    return followedJson
};

export const getPlaylist = async (refresh_token) => {
    
    const playlistData = await fetch(
        `http://localhost:3001/api/list?refresh_token=${refresh_token}`
      );
    
      const playlistJson = await playlistData.json();

    return playlistJson
};

export const longTermArtist = async (refresh_token) => {
    const longTerm = await fetch(
        `http://localhost:3001/api/artists?refresh_token=${refresh_token}&time_range=long_term&limit=50`
      );

     const ltRes = await longTerm.json();

      return ltRes
}

export const shortTermArtist = async (refresh_token) => {
    const shortTerm = await fetch(
        `http://localhost:3001/api/artists?refresh_token=${refresh_token}&time_range=short_term&limit=50`
      );
      const stRes = await shortTerm.json();

      return stRes
}

export const mediumTermArtist = async (refresh_token) => {
    const medTerm = await fetch(
        `http://localhost:3001/api/artists?refresh_token=${refresh_token}&time_range=medium_term&limit=50`
      );
     const mdRes = await medTerm.json();

      return mdRes
}

export const longTermTrack = async (refresh_token) => {
    const longTerm = await fetch(
        `http://localhost:3001/api/tracks?refresh_token=${refresh_token}&time_range=long_term&limit=50`
      );
      const ltRes = await longTerm.json();

      return ltRes
}

export const shortTermTrack = async (refresh_token) => {
    const shortTerm = await fetch(
        `http://localhost:3001/api/tracks?refresh_token=${refresh_token}&time_range=short_term&limit=50`
      );
      const stRes = await shortTerm.json();

      return stRes
}

export const mediumTermTrack = async (refresh_token) => {
    const medTerm = await fetch(
        `http://localhost:3001/api/tracks?refresh_token=${refresh_token}&time_range=medium_term&limit=50`
      );
     const mdRes = await medTerm.json();

      return mdRes
}


export const history = async (refresh_token) => {
    const res = await fetch(
        `http://localhost:3001/api/history?refresh_token=${refresh_token}&limit=50`
      );
    
      const history = await res.json();

    return history
}

export const userPlaylist = async (refresh_token) => {
    
    const res = await fetch(
        `http://localhost:3001/api/list?refresh_token=${refresh_token}`
      );
    const playlistData = await res.json();

    return playlistData
}

export const playlistData = async (refresh_token,id) => {
    const playlistData = await fetch(
        `http://localhost:3001/api/getPlaylist?refresh_token=${refresh_token}&id=${id}`
      );
      const  playlistJson = await playlistData.json();
    return playlistJson
}

export const playlistFeatures = async (refresh_token,songs) =>{
    const featureData = await fetch(
        `http://localhost:3001/api/features?refresh_token=${refresh_token}&id=${songs}`
      );
      const featureJson = await featureData.json();
    return featureJson
}

 export const trackData = async (refresh_token, id) => {

    const trackData = await fetch(
        `http://localhost:3001/api/track?refresh_token=${refresh_token}&id=${id}`
      );
      const trackJson = await trackData.json();
      return trackJson
 }

 export const trackFeature = async (refresh_token, id) => {
    const featureData = await fetch(
        `http://localhost:3001/api/feature?refresh_token=${refresh_token}&id=${id}`
      );
     const featureJson = await featureData.json();
     return featureJson
 }

 export const trackAnalysis = async (refresh_token, id) => {
    const analysisData = await fetch(
        `http://localhost:3001/api/analysis?refresh_token=${refresh_token}&id=${id}`
      );
      const analysisJson = await analysisData.json();
     return analysisJson
 }

 export const artistData = async (refresh_token, id) => {
    const trackData = await fetch(
        `http://localhost:3001/api/artist?refresh_token=${refresh_token}&id=${id}`
      );
    const trackJson = await trackData.json();

    return trackJson
 }

 export const relatedData = async (refresh_token, id) => {
    const relatedData = await fetch(
        `http://localhost:3001/api/relatedArtist?refresh_token=${refresh_token}&id=${id}`
      );
      const relatedJson = await relatedData.json();
      return relatedJson
 }

 export const followedData = async (refresh_token,id) => {
    const followingData = await fetch(
        `http://localhost:3001/api/followingArtist?refresh_token=${refresh_token}&id=${id}`
      );
      const followingJson = await followingData.json();
      return followingJson
 }

 













