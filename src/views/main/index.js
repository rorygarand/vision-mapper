import React, { Component } from 'react';
import FastTracker from '../../utils/FastTracker';

import 'tracking';
import 'tracking/build/data/face-min';
import './style.css';

class Main extends Component {
  componentDidMount() {
    const { tracking } = window;
    const { FastTracker } = this.state;

    /* ===========================================================
     * Face Tracking
     * ===========================================================
     */
    const face = document.getElementById('face');
    const faceContext = face.getContext('2d');

    const faceTracker = new tracking.ObjectTracker('face');

    faceTracker.setInitialScale(4);
    faceTracker.setStepSize(2);
    faceTracker.setEdgesDensity(0.1);

    faceTracker.on('track', this.faceTrack.bind(null, face, faceContext));

    /* ===========================================================
     * Fast Tracking
     * ===========================================================
     */
    const fast = document.getElementById('fast');
    const fastContext = fast.getContext('2d');
    const threshold = 2;

    tracking.inherits(FastTracker, tracking.Tracker);
    tracking.Fast.THRESHOLD = threshold;

    const fastTracker = new FastTracker({ threshold, tracking });
    fastTracker.on('track', this.fastTrack.bind(null, fast, fastContext));

    /* ===========================================================
     * Event Listeners
     * ===========================================================
     */
    const faceTask = tracking.track('#video', faceTracker, { camera: true });
    const fastTask = tracking.track('#video', fastTracker, { camera: true });

    faceTask.stop();
    this.setState({ face, fast, faceTask, faceContext, fastTask, fastContext });
  }

  constructor(props) {
    super(props);

    this.state = { FastTracker, on: false };
  }

  handleClick = ev => {
    const { face, faceContext, faceTask, on } = this.state;

    if (on) {
      faceContext.clearRect(0, 0, face.width, face.height);
      faceTask.stop();
    } else faceTask.run();

    this.setState({ on: !on });
  };

  faceTrack = (canvas, context, ev) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    ev.data.forEach(rect => {
      context.strokeStyle = '#000';
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.fillStyle = '#fff';
    });
  };

  fastTrack = (canvas, context, ev) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const corners = ev.data;
    for (var i = 0; i < corners.length; i += 2) {
      context.fillStyle = 'rgba(255, 0, 0, 0.5)';
      context.fillRect(corners[i], corners[i + 1], 2, 2);
    }
  };

  render() {
    const { on } = this.state;

    return (
      <div className="main">
        <video
          id="video"
          width="600"
          height="400"
          preload
          autoPlay
          loop
          muted
        />
        <canvas id="fast" width="600" height="400" />
        <canvas id="face" width="600" height="400" />
        <button onClick={this.handleClick}>
          {on && 'un'}do it
        </button>
      </div>
    );
  }
}

export default Main;
