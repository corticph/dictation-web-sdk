export class AudioService {
    private audioContext: AudioContext;

    private analyser: AnalyserNode;
  
    constructor(mediaStream: MediaStream) {
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 8192;
      source.connect(this.analyser);
    }
  
    public getAudioLevel(): number {
      const bufferLength = this.analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i += 1) {
        const normalized = (dataArray[i] - 128) / 128;
        sum += normalized * normalized;
      }
      return Math.sqrt(sum / bufferLength);
    }
  }
  