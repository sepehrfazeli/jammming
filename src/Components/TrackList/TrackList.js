import React from "react";
import "./TrackList.css";
import { Track } from "../Track/Track";

export class TrackList extends React.Component {
  render() {
    const tracks = this.props.tracks;
    // this.props.tracks === undefined
    //   ? console.log("Loading...")
    //   : console.log(this.props.tracks);

    return (
      <div className="TrackList">
        {tracks &&
          tracks.map((track) => {
            return (
              <Track
                isRemoval={this.props.isRemoval}
                onRemove={this.props.onRemove}
                onAdd={this.props.onAdd}
                track={track}
                key={track.id}
              />
            );
          })}
      </div>
    );
  }
}
