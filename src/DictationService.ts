import { DictationConfig, ServerConfig } from "./types";


export class DictationService extends EventTarget {
  private mediaRecorder: MediaRecorder;
  private webSocket!: WebSocket;
  private serverConfig!: ServerConfig;
  private dictationConfig!: DictationConfig;

  constructor(mediaStream: MediaStream, {dictationConfig, serverConfig}: {dictationConfig: DictationConfig, serverConfig: ServerConfig}) {
    super();
    this.mediaRecorder = new MediaRecorder(mediaStream);
    this.serverConfig = serverConfig;
    this.dictationConfig = dictationConfig;
    this.mediaRecorder.ondataavailable = event => {
      // if (event.data && event.data.size > 0) {
      //   this.dispatchEvent(
      //     new CustomEvent('audio-packet', {
      //       detail: event.data,
      //       bubbles: true,
      //       composed: true,
      //     }),
      //   );
      // }

      // if webSocket is open, send the data
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.webSocket.send(event.data
        );
      }
    };
  }

  public startRecording() {
    const url = `wss://api.${this.serverConfig.environment}.corti.app/audio-bridge/v2/transcribe?tenant-name=${this.serverConfig.tenant}&token=Bearer%20${this.serverConfig.token}`
    this.webSocket = new WebSocket(url);
    this.webSocket.onopen = () => {
      this.webSocket.send(
        JSON.stringify({
          type: 'config',
          configuration: this.dictationConfig,
        }),
      );
    };
    this.webSocket.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.type === 'config') {
        this.mediaRecorder.start(250);
      } else if (message.type === 'transcript') {
        this.dispatchEvent(
          new CustomEvent('transcript', {
            detail: message,
            bubbles: true,
            composed: true,
          }),
        );
      }
    };
  }

  public async stopRecording() {
    let timeOut: any;
    this.mediaRecorder.stop();
    if (this.webSocket?.readyState === WebSocket.OPEN) {
      this.webSocket.send(
        JSON.stringify({
          type: 'end',
        }),
      );
    }
    this.webSocket.onmessage = (e) => {

    };
    // this implementation should be replaced by handling a proper 'ended' message from the server
    this.webSocket.onclose = async() => {
      this.webSocket.close();
      clearTimeout(timeOut);
      await new Promise((resolve) => setTimeout(resolve, 100));
      return
    };
    timeOut = setTimeout(() => {
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.webSocket.close();
      }
    }, 10000);
  }
}
