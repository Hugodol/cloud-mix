import React, { Component } from 'react';
import WaveformVisual from './WaveformVisual.js'
import getUserMedia from '../../audioHelpers/getUserMedia.js';
import stopRecord from '../../audioHelpers/stopRecord.js';
import record from '../../audioHelpers/record.js';
import play from '../../audioHelpers/play.js';
import waveformInit from '../../audioHelpers/waveformInit.js';
import { Button } from "react-materialize";

class JamView extends Component {
  constructor() {
    super();
    this.state = {
      recorder: null,
      recording: false,
      urls: [],
      offset: 0,
      firstRec: false,
      change: false,
      wavesurfer: null
    }
  }

  componentDidMount() {
    //TODO: grab existing track and set to urls
    getUserMedia(
      this.setUrl.bind(this),
      this.setRecorder.bind(this)
    );
    waveformInit(this.setWavesurfer.bind(this));
  }

  setRecorder(recorder) {
    this.setState({recorder: recorder});
  }

  setRecording() {
    this.setState({recording: !this.state.recording});
  }

  setUrl(url) {
    this.state.urls.push(url);
    this.setState({change: !this.state.change});
  }

  setOffset(offset) {
    this.setState({offset: offset});
  }

  setTrackOffset(i, offset) {
    this.state.urls[i].offset = offset;
    this.setState({change: !this.state.change});
  }

  setFirstRec() {
    this.setState({firstRec: !this.state.firstRec});
  }

  setWavesurfer(wave) {
    this.setState({wavesurfer: wave});
  }

  render() {
    return (
      <div className="jamView">

        <div className="jam_header">
          <h2>{this.props.songCreateTitle}</h2>
          <h3>{this.props.songCreateGenre}</h3>
        </div>

        {this.state.recording ? (

          <Button className='recordButton' floating large waves='light' icon='mic_off'
            onClick={() => {
              stopRecord(this.state.recorder, this.setRecording.bind(this));
            }}
          >Stop</Button>

        ) : (
          <Button className='recordButton'  floating large waves='light' icon='mic_none'
            onClick={() => {
              record(
                this.state.recorder,
                this.state.urls,
                this.setRecording.bind(this),
                this.state.firstRec,
                this.setFirstRec.bind(this)
              );
            }}
          >Rec</Button>

        )}
        <Button floating large  waves='light' icon='play_arrow' onClick={() => {
          play(this.state.urls, this.state.offset, this.setTrackOffset.bind(this));
        }}>Play</Button>
        {this.state.urls > 1 ? (
          <input onChange={e => {
            this.setOffset(e.target.value);
            console.log('current offset is', e.target.value);
          }}></input>
        ) : null}

        <div className="waveform"></div>
        {this.state.urls.map((url, i) => {
          return <WaveformVisual
            key={i}
            url={url.url}
            wavesurfer={this.state.wavesurfer}
          />
        })}

      </div>
    );
  }
}


export default JamView;
