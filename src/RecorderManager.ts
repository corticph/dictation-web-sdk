import { getAudioDevices } from './utils.js';
import { AudioService } from './audioService.js';
import { DictationService } from './DictationService.js';
import type { DictationConfig, RecordingState } from './types.js';

export class RecorderManager extends EventTarget {
  public devices: MediaDeviceInfo[] = [];

  public selectedDevice: MediaDeviceInfo | undefined;

  public recordingState: RecordingState = 'stopped';

  private _mediaStream: MediaStream | null = null;

  private _audioService: AudioService | null = null;

  private _dictationService: DictationService | null = null;

  private _visualiserInterval?: number;

  constructor() {
    super();
    navigator.mediaDevices.addEventListener(
      'devicechange',
      this.handleDevicesChange.bind(this),
    );
  }

  async initialize() {
    const deviceResponse = await getAudioDevices();
    this.devices = deviceResponse.devices;
    this.selectedDevice = deviceResponse.defaultDevice;
    return { devices: this.devices, selectedDevice: this.selectedDevice };
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

  private async handleDevicesChange() {
    const deviceResponse = await getAudioDevices();
    this.devices = deviceResponse.devices;
    if (
      !this.devices.find(
        device => device.deviceId === this.selectedDevice?.deviceId,
      )
    ) {
      this.selectedDevice = deviceResponse.defaultDevice;
    }
    this.dispatchCustomEvent('recording-devices-changed', {
      devices: deviceResponse.devices,
      selectedDevice: this.selectedDevice || deviceResponse.defaultDevice,
    });
  }

  async startRecording(params: {
    dictationConfig: DictationConfig;
    authToken: string;
  }): Promise<void> {
    this._updateRecordingState('initializing');

    // Get media stream and initialize audio service.
    const constraints: MediaStreamConstraints =
      this.selectedDevice && this.selectedDevice.deviceId !== 'default'
        ? { audio: { deviceId: { exact: this.selectedDevice.deviceId } } }
        : { audio: true };

    try {
      this._mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);
      this._mediaStream.getTracks().forEach((track: MediaStreamTrack) => {
        track.addEventListener('ended', () => {
          if (this.recordingState === 'recording') {
            this.dispatchCustomEvent('error', {
              message: 'Microphone access was lost.',
            });
            this.stopRecording();
          }
        });
      });

      this._audioService = new AudioService(this._mediaStream);
    } catch (error) {
      this.dispatchCustomEvent('error', error);
      this.stopRecording();
      return;
    }

    // Initialize dictation service.
    try {
      this._dictationService = new DictationService(this._mediaStream, params);

      // Forward custom events from dictation service
      this._dictationService.addEventListener('error', e => {
        this.dispatchEvent(
          new CustomEvent('error', {
            detail: (e as CustomEvent).detail,
            bubbles: true,
            composed: true,
          }),
        );
        this.stopRecording();
      });
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
      this.dispatchCustomEvent('error', error);
      this.stopRecording();
      return;
    }

    try {
      this._dictationService?.startRecording();
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent('error', {
          detail: error,
          bubbles: true,
          composed: true,
        }),
      );
      this.stopRecording();
      return;
    }
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
    }
    this.dispatchCustomEvent('audio-level-changed', { audioLevel: 0 });
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
