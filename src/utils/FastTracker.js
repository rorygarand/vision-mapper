export default class FastTracker {
  constructor(props = { threshold: 2 }) {
    const { threshold, tracking } = props;

    this.threshold = threshold;
    this.tracking = tracking;
  }

  track = (pixels, width, height) => {
    const gray = this.tracking.Image.grayscale(pixels, width, height);
    const data = this.tracking.Fast.findCorners(gray, width, height);

    this.emit('track', { data });
  };
}
