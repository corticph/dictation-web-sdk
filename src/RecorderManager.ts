import { getAudioDevices } from './utils';
import { AudioService } from './audioService';
import { DictationService } from './DictationService';
import type { DictationConfig, RecordingState, ServerConfig } from './types';

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

  async startRecording(params: {
    dictationConfig: DictationConfig;
    serverConfig: ServerConfig;
  }) {
    this._updateRecordingState('initializing');
    try {
      this._mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: this.selectedDevice },
      });
      this._audioService = new AudioService(this._mediaStream);
      this._dictationService = new DictationService(this._mediaStream, params);

      // Forward custom events from dictation service
      this._dictationService.addEventListener('error', e =>
        this.dispatchEvent(
          new CustomEvent('error', {
            detail: (e as CustomEvent).detail,
            bubbles: true,
            composed: true,
          }),
        ),
      );
      this._dictationService.addEventListener('stream-closed', () =>
        this.stopRecording(),
      );
      this._dictationService.addEventListener('transcript', e =>
        this.dispatchEvent(
          new CustomEvent('transcript', {
            detail: (e as CustomEvent).detail,
            bubbles: true,
            composed: true,
          }),
        ),
      );
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent('error', {
          detail: error,
          bubbles: true,
          composed: true,
        }),
      );
      this._updateRecordingState('stopped');
      return;
    }

    this._dictationService?.startRecording();
    this._updateRecordingState('recording');
    this._visualiserInterval = window.setInterval(() => {
      const level = this._audioService
        ? this._audioService.getAudioLevel() * 3
        : 0;
      this.dispatchEvent(
        new CustomEvent('audio-level-changed', {
          detail: { audioLevel: level },
          bubbles: true,
          composed: true,
        }),
      );
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
