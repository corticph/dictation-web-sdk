import { DictationConfig } from './types';
import { decodeToken } from './utils';

export class DictationService extends EventTarget {
  private mediaRecorder: MediaRecorder;

  private webSocket!: WebSocket;

  private authToken!: string;

  private dictationConfig!: DictationConfig;

  constructor(
    mediaStream: MediaStream,
    {
      dictationConfig,
      authToken,
    }: { dictationConfig: DictationConfig; authToken: string },
  ) {
    super();
    this.mediaRecorder = new MediaRecorder(mediaStream);
    this.authToken = authToken;
    this.dictationConfig = dictationConfig;
    this.mediaRecorder.ondataavailable = event => {
      // if webSocket is open, send the data
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.webSocket.send(event.data);
      }
    };
  }

  public startRecording() {
    const serverConfig = decodeToken(this.authToken);
    if (!serverConfig) {
      this.dispatchEvent(
        new CustomEvent('error', {
          detail: 'Invalid token',
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }

    console.log('serverConfig:', serverConfig);

    const url = `wss://api.${serverConfig.environment}.corti.app/audio-bridge/v2/transcribe?tenant-name=${serverConfig.tenant}&token=Bearer%20${this.authToken}`;
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
      if (message.type === 'CONFIG_ACCEPTED') {
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
    this.webSocket.onerror = event => {
      this.dispatchEvent(
        new CustomEvent('error', {
          detail: event,
          bubbles: true,
          composed: true,
        }),
      );
    };
    this.webSocket.onclose = event => {
      this.dispatchEvent(
        new CustomEvent('stream-closed', {
          detail: event,
          bubbles: true,
          composed: true,
        }),
      );
    };
  }

  public async stopRecording() {
    this.mediaRecorder.stop();

    if (this.webSocket?.readyState === WebSocket.OPEN) {
      this.webSocket.send(
        JSON.stringify({
          type: 'end',
        }),
      );
    }

    const timeOut: NodeJS.Timeout = setTimeout(() => {
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.webSocket.close();
      }
    }, 10000);

    // This implementation should be replaced by handling a proper 'ended' message from the server
    this.webSocket.onclose = () => {
      this.webSocket?.close();
      clearTimeout(timeOut);
    };
  }
}
