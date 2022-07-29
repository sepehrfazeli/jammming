import "./App.css";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResults } from "../SearchResults/SearchResults.js";
import { Playlist } from "../Playlist/Playlist.js";
import React from "react";
import { Spotify } from "../../util/Spotify";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
    };
  }

  addTrack(track) {
    if (
      !this.state.playlistTracks.find(
        (savedTrack) => savedTrack.id === track.id
      )
    ) {
      // this.state.playlistTracks.push(track);
      // this.setState({ playlistTracks: this.state.playlistTracks })
      this.setState({ playlistTracks: [...this.state.playlistTracks, track] });
      // console.log(this.state.playlistTracks);
    }
  }

  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(
        (removedTrack) => removedTrack.id !== track.id
      ),
    });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackURI = this.state.playlistTracks.map( track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURI).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(term) {
    Spotify.search(term).then((searchResults) => {
      this.setState({ searchResults: searchResults });
    });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div id="hint">
          <button id="closePoint" onClick={x => {console.log('sss');document.getElementById('hint').style.display = "none";}}>x</button>
          <h6>Account Credentials:<br></br><span>(For Full Funtionality)</span></h6>
          <h6>user:sepehr01@hi2.in</h6>
          <h6>pass:bahman1374</h6>
        </div>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              onAdd={this.addTrack}
              searchResults={this.state.searchResults}
            />
            <Playlist
              onSave={this.savePlaylist}
              onNameChange={this.updatePlaylistName}
              onRemove={this.removeTrack}
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
            />
          </div>
        </div>
      </div>
    );
  }
}
