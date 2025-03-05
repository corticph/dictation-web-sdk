import { getAudioDevices } from './utils.js';
import { AudioService } from './audioService.js';
import { DictationService } from './DictationService.js';
import type { DictationConfig, RecordingState } from './types.js';

export class RecorderManager extends EventTarget {
  public devices: MediaDeviceInfo[] = [];

  public selectedDevice: string = '';

  public recordingState: RecordingState = 'stopped';

  private _mediaStream: MediaStream | null = null;

  private _audioService: AudioService | null = null;

  private _dictationService: DictationService | null = null;

  private _visualiserInterval?: number;

  async initialize() {
    const deviceResponse = await getAudioDevices();
    this.devices = deviceResponse.devices;
    this.selectedDevice = deviceResponse.defaultDeviceId || '';
    return deviceResponse;
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

  async startRecording(params: {
    dictationConfig: DictationConfig;
    authToken: string;
  }): Promise<void> {
    this._updateRecordingState('initializing');

    // Get media stream and initialize audio service.
    try {
      this._mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: this.selectedDevice },
      });
      this._audioService = new AudioService(this._mediaStream);
    } catch (error) {
      this.dispatchCustomEvent('error', error);
      this._updateRecordingState('stopped');
      return;
    }

    // Initialize dictation service.
    try {
      this._dictationService = new DictationService(this._mediaStream, params);
    } catch (error) {
      this.dispatchCustomEvent('error', error);
      this.stopRecording();
      return;
    }

    // Forward dictation service events.
    this._dictationService.addEventListener('error', e =>
      this.dispatchCustomEvent('error', (e as CustomEvent).detail),
    );
    this._dictationService.addEventListener('stream-closed', () =>
      this.stopRecording(),
    );
    this._dictationService.addEventListener('transcript', e =>
      this.dispatchCustomEvent('transcript', (e as CustomEvent).detail),
    );

    this._dictationService.startRecording();
    this._updateRecordingState('recording');

    // Update audio level visualization.
    this._visualiserInterval = window.setInterval(() => {
      const level = this._audioService
        ? this._audioService.getAudioLevel() * 3
        : 0;
      this.dispatchCustomEvent('audio-level-changed', { audioLevel: level });
    }, 150);
  }

  async stopRecording() {
    this._updateRecordingState('stopping');
    if (this._visualiserInterval) {
      clearInterval(this._visualiserInterval);
      this._visualiserInterval = undefined;
    }
    if (this._mediaStream) {
      this._mediaStream.getTracks().forEach(track => track.stop());
      this._mediaStream = null;
    }
    await this._dictationService?.stopRecording();
    this._updateRecordingState('stopped');
  }

  private _updateRecordingState(state: RecordingState) {
    this.recordingState = state;
    this.dispatchEvent(
      new CustomEvent('recording-state-changed', {
        detail: { state },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
