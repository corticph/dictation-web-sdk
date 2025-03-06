/* eslint-disable @typescript-eslint/no-explicit-any */
import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import CortiDictation from '../src/index.js';
import '../src/corti-dictation.js';

// Stub class for RecorderManager
class StubRecorderManager extends EventTarget {
  devices: MediaDeviceInfo[] = [];

  selectedDevice = '';

  startRecording = sinon.spy();

  stopRecording = sinon.spy();

  async initialize() {
    // Simulate async initialization.
  }
}

describe('CortiDictation', () => {
  let stubRecorder: StubRecorderManager;

  beforeEach(() => {
    stubRecorder = new StubRecorderManager();
  });

  it('renders a callout warning if serverConfig is not configured', async () => {
    const el = await fixture<CortiDictation>(
      html`<corti-dictation></corti-dictation>`,
    );
    // Override the recorderManager to avoid real initialization.
    (el as any).recorderManager = stubRecorder;
    el.authToken = ''; // Empty string
    await el.updateComplete;
    const callout = el.shadowRoot?.querySelector('.callout');
    expect(callout).to.exist;
    expect(el.shadowRoot?.textContent).to.include(
      'Please configure the server settings in the parent component',
    );
  });

  it('renders the recording icon when recordingState is "recording"', async () => {
    const el = await fixture<CortiDictation>(
      html`<corti-dictation></corti-dictation>`,
    );
    (el as any).recorderManager = stubRecorder;
    el.authToken = 'abc';
    el.recordingState = 'recording';
    await el.updateComplete;
    const recordingIcon = el.shadowRoot?.querySelector('icon-recording');
    expect(recordingIcon).to.exist;
  });

  it('calls startRecording when button is clicked and state is "stopped"', async () => {
    const el = await fixture<CortiDictation>(
      html`<corti-dictation></corti-dictation>`,
    );
    (el as any).recorderManager = stubRecorder;
    el.authToken = 'abc';
    el.recordingState = 'stopped';
    await el.updateComplete;
    const button = el.shadowRoot!.querySelector('button')!;
    button.click();
    expect(stubRecorder.startRecording.calledOnce).to.be.true;
    // Check that startRecording was called with a config object
    const args = stubRecorder.startRecording.getCall(0).args[0];
    expect(args).to.have.property('dictationConfig');
    expect(args).to.have.property('authToken');
  });

  it('calls stopRecording when button is clicked and state is "recording"', async () => {
    const el = await fixture<CortiDictation>(
      html`<corti-dictation></corti-dictation>`,
    );
    (el as any).recorderManager = stubRecorder;
    el.authToken = '';
    el.recordingState = 'recording';
    await el.updateComplete;
    const button = el.shadowRoot!.querySelector('button')!;
    button.click();
    expect(stubRecorder.stopRecording.calledOnce).to.be.true;
  });

  it('updates the audio level when an "audio-level-changed" event is dispatched', async () => {
    const el = await fixture<CortiDictation>(
      html`<corti-dictation></corti-dictation>`,
    );
    (el as any).recorderManager = stubRecorder;
    el.authToken = 'abc';
    el.recordingState = 'recording';
    await el.updateComplete;
    const testLevel = 42;
    const event = new CustomEvent('audio-level-changed', {
      detail: { audioLevel: testLevel },
    });
    stubRecorder.dispatchEvent(event);
    await el.updateComplete;
    const audioVisualiser = el.shadowRoot?.querySelector('audio-visualiser');
    expect(audioVisualiser).to.exist;
    expect((audioVisualiser as any).level).to.equal(testLevel);
  });

  it('re-dispatches recorderManager events', async () => {
    const el = await fixture<CortiDictation>(
      html`<corti-dictation></corti-dictation>`,
    );
    (el as any).recorderManager = stubRecorder;
    el.authToken = 'abc';
    el.recordingState = 'stopped';
    await el.updateComplete;
    // Listen for a re-dispatched event from the component.
    setTimeout(() => {
      const event = new CustomEvent('transcript', {
        detail: { transcript: 'hello' },
      });
      stubRecorder.dispatchEvent(event);
    });
    const dispatchedEvent = (await oneEvent(el, 'transcript')) as CustomEvent;
    expect(dispatchedEvent.detail.transcript).to.equal('hello');
  });
});
