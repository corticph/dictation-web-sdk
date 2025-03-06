import type { DictationConfig, ServerConfig } from './types.js';
import { decodeToken } from './utils.js';

export class DictationService extends EventTarget {
  private mediaRecorder: MediaRecorder;
  private webSocket!: WebSocket;
  private authToken: string;
  private dictationConfig: DictationConfig;
  private serverConfig: ServerConfig;

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

    // Decode token during construction.
    const config = decodeToken(this.authToken);
    if (!config) {
      throw new Error('Invalid token');
    }
    this.serverConfig = config;

    this.mediaRecorder.ondataavailable = event => {
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.webSocket.send(event.data);
      }
    };
  }

  private dispatchCustomEvent(eventName: string, detail: unknown): void {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  public startRecording(): void {
    const url = `wss://api.${this.serverConfig.environment}.corti.app/audio-bridge/v2/transcribe?tenant-name=${this.serverConfig.tenant}&token=Bearer%20${this.authToken}`;
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
        this.dispatchCustomEvent('transcript', message);
      }
    };

    this.webSocket.onerror = event => {
      this.dispatchCustomEvent('error', event);
    };

    this.webSocket.onclose = event => {
      this.dispatchCustomEvent('stream-closed', event);
    };
  }

  public async stopRecording(): Promise<void> {
    this.mediaRecorder.stop();

    if (this.webSocket?.readyState === WebSocket.OPEN) {
      this.webSocket.send(JSON.stringify({ type: 'end' }));
    }

    const timeout = setTimeout(() => {
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.webSocket.close();
      }
    }, 10000);

    this.webSocket.onclose = () => {
      this.webSocket?.close();
      clearTimeout(timeout);
    };
  }
}
