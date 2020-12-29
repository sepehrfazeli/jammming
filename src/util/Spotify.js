const clientID = "5bfce306e8fc47618c4f0f95eb16c8be";
const redirectURI = "http://sepehr.surge.sh/";
let accessToken;

export const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");

      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessUrl;
    }
  },
  search(term) {
    const accessToken = Spotify.getAccessToken();
    const endpoint = `https://api.spotify.com/v1/search?q=${term}&type=track`;

    return fetch(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => {
        if (response.ok) {
          const jsonResponse = response.json();
          // console.log(jsonResponse);
          return jsonResponse;
        } /*
          throw new Error("Request failed!");
        },
        (networkError) => {
          console.log(networkError.message);*/
      })
      .then((jsonResponse) => {
        // console.log(jsonResponse);
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },
  savePlaylist(playlistName, URIs) {
    if (!playlistName || !URIs.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const url = "https://api.spotify.com";
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userID;
    return fetch(`${url}/v1/me`, { headers: headers })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((jsonResponse) => {
        userID = jsonResponse.id;

        return fetch(`${url}/v1/users/${userID}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name : playlistName})
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((jsonResponse) => {
            const playlistID = jsonResponse.id;
            return fetch(`${url}/v1/users/${userID}/playlists/${playlistID}/tracks`,{
              headers: headers,
              method: 'POST',
              body: JSON.stringify({ uris: URIs })
            })
          });
      });

    /*
    const urlToShorten = inputField.value;
  const data = JSON.stringify({destination: urlToShorten});
  fetch(url,{
    method: 'POST',
    headers: 
    {
      'Content-type': 'application/json',
      'apikey': apiKey
    },
    body: data,
  }).then(response =>{
    if(response.ok){
      return response.json();
    } throw new Error('Request failed!');
  }, networkError => console.log(networkError.message)
  ).then(jsonResponse =>{
    renderResponse(jsonResponse)
  })*/
  },
};
