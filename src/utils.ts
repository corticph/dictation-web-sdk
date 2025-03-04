/**
 * Returns the localized name of a language given its BCP-47 code.
 *
 * @param languageCode - The BCP-47 language code (e.g. "en")
 * @returns The localized language name (e.g. "English") or the original code if unavailable.
 */
export function getLanguageName(languageCode: string): string {
  const userLocale = navigator.language || 'en';
  const displayNames = new Intl.DisplayNames([userLocale], {
    type: 'language',
  });
  const languageName = displayNames.of(languageCode);
  return languageName || languageCode;
}

/**
 * Requests access to the microphone.
 *
 * This function checks if the microphone permission is in "prompt" state, then requests
 * access and stops any active tracks immediately. It also logs if permission is already granted.
 *
 * @returns A promise that resolves when the permission request is complete.
 */
export async function requestMicAccess(): Promise<void> {
  try {
    // Fallback if Permissions API is not available
    if (!navigator.permissions) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      console.log('Microphone permission requested (via fallback).');
      return;
    }

    const permissionStatus = await navigator.permissions.query({
      name: 'microphone' as PermissionName,
    });

    if (permissionStatus.state === 'prompt') {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      console.log('Microphone permission requested.');
    } else if (permissionStatus.state === 'denied') {
      console.warn('Microphone permission is denied.');
    }
  } catch (error) {
    console.error('Error checking/requesting microphone permission:', error);
  }
}

/**
 * Retrieves available audio input devices.
 *
 * This function uses the mediaDevices API to enumerate devices and filters out those
 * which are audio inputs. In some browsers, you may need to request user media before
 * device labels are populated.
 *
 * @returns A promise that resolves with an object containing:
 *  - `devices`: an array of MediaDeviceInfo objects for audio inputs.
 *  - `defaultDeviceId`: the deviceId of the first audio input, if available.
 */
export async function getAudioDevices(): Promise<{
  devices: MediaDeviceInfo[];
  defaultDeviceId?: string;
}> {
  if (!navigator.mediaDevices?.enumerateDevices) {
    console.error('Media devices API not supported.');
    return { devices: [] };
  }

  await requestMicAccess();

  try {
    // Optionally: await navigator.mediaDevices.getUserMedia({ audio: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    const defaultDeviceId =
      audioDevices.length > 0 ? audioDevices[0].deviceId : undefined;
    return { devices: audioDevices, defaultDeviceId };
  } catch (error) {
    console.error('Error enumerating devices:', error);
    return { devices: [] };
  }
}
