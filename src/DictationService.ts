import type { DictationConfig, ServerConfig } from './types.js';
import { decodeToken } from './utils.js';

export class DictationService extends EventTarget {
  private mediaRecorder: MediaRecorder;
  private webSocket!: WebSocket;
  private authToken: string;
  private dictationConfig: DictationConfig;

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

    this.mediaRecorder.ondataavailable = event => {
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.webSocket.send(event.data);
      }
    };
  }

  private dispatchCustomEvent(eventName: string, detail?: unknown): void {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  public startRecording() {
    const serverConfig: ServerConfig | undefined = decodeToken(this.authToken);
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
      switch (message.type) {
        case 'CONFIG_ACCEPTED':
          this.mediaRecorder.start(250);
          break;
        case 'CONFIG_DENIED':
          this.dispatchCustomEvent('error', message);
          return this.stopRecording();
        case 'transcript':
          this.dispatchCustomEvent('transcript', message);
          break;
        case 'command':
          this.dispatchCustomEvent('command', message);
          console.log('Command received:', message);
          break;
        default:
          console.warn(`Unhandled message type: ${message.type}`);
          break;
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
    this.mediaRecorder?.stop();

    if (this.webSocket?.readyState === WebSocket.OPEN) {
      this.webSocket.send(JSON.stringify({ type: 'end' }));
    }

    const timeout: NodeJS.Timeout = setTimeout(() => {
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
