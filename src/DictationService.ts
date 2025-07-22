import { CortiClient, Corti } from '@corti/sdk';

import type { ServerConfig } from './types.js';
import { getErrorMessage } from './utils.js';

type TranscribeSocket = Awaited<
  ReturnType<CortiClient['transcribe']['connect']>
>;

export class DictationService extends EventTarget {
  private mediaRecorder: MediaRecorder;
  private webSocket!: TranscribeSocket;
  private serverConfig: ServerConfig;
  private dictationConfig: Corti.TranscribeConfig;
  private cortiClient: CortiClient;

  constructor(
    mediaStream: MediaStream,
    {
      dictationConfig,
      serverConfig,
    }: { dictationConfig: Corti.TranscribeConfig; serverConfig: ServerConfig },
  ) {
    super();
    this.mediaRecorder = new MediaRecorder(mediaStream);
    this.serverConfig = serverConfig;
    this.dictationConfig = dictationConfig;

    this.cortiClient = new CortiClient({
      environment: serverConfig.environment,
      tenantName: serverConfig.tenant,
      auth: {
        accessToken: serverConfig.accessToken,
      },
    });

    this.mediaRecorder.ondataavailable = event => {
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.webSocket.sendAudio(event.data);
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

  public async startRecording() {
    if (!this.serverConfig) {
      this.dispatchEvent(
        new CustomEvent('error', {
          detail: 'Invalid token',
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }

    this.webSocket = await this.cortiClient.transcribe.connect({
      configuration: this.dictationConfig,
    });

    this.webSocket.on('message', message => {
      switch (message.type) {
        case 'CONFIG_ACCEPTED':
          this.mediaRecorder.start(250);
          break;
        case 'transcript':
          this.dispatchCustomEvent('transcript', message);
          break;
        case 'command':
          this.dispatchCustomEvent('command', message);
          break;
        default:
          console.warn(`Unhandled message type: ${message.type}`);
          break;
      }
    });

    this.webSocket.on('error', event => {
      this.stopRecording();

      this.dispatchCustomEvent('error', getErrorMessage(event));
    });

    this.webSocket.on('close', event => {
      this.dispatchCustomEvent('stream-closed', event);
    });
  }

  public async stopRecording(): Promise<void> {
    this.mediaRecorder?.stop();

    if (this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.sendEnd({
        type: 'end',
      });
    }

    const timeout: NodeJS.Timeout = setTimeout(() => {
      if (this.webSocket?.readyState === WebSocket.OPEN) {
        this.webSocket.close();
      }
    }, 10000);

    this.webSocket.on('close', () => {
      clearTimeout(timeout);
    });
  }
}
