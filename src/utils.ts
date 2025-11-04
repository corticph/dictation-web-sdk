/* eslint-disable no-console */
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
      return;
    }

    const permissionStatus = await navigator.permissions.query({
      // eslint-disable-next-line no-undef
      name: 'microphone' as PermissionName,
    });

    if (permissionStatus.state === 'prompt') {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
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
  defaultDevice?: MediaDeviceInfo;
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
    const defaultDevice = audioDevices.length > 0 ? audioDevices[0] : undefined;
    return { devices: audioDevices, defaultDevice };
  } catch (error) {
    console.error('Error enumerating devices:', error);
    return { devices: [] };
  }
}

/**
 * Decodes a JWT token and extracts environment and tenant details from its issuer URL.
 *
 * NOTE: This function is temporarily kept for backward compatibility in return values.
 * The SDK now handles token parsing internally, so this should be removed once we
 * reduce the return results to only include what's necessary.
 *
 * @param token - A JSON Web Token (JWT) string.
 * @returns An object containing:
 *  - `environment`: The extracted environment from the issuer URL.
 *  - `tenant`: The extracted tenant from the issuer URL.
 *  - `accessToken`: The original token string.
 *  - `expiresAt`: The expiration timestamp from the token.
 * If the issuer URL doesn't match the expected format, returns undefined.
 *
 * @throws Will throw an error if:
 *  - The token format is invalid.
 *  - The base64 decoding or URI decoding fails.
 *  - The JSON payload is invalid.
 *  - The token payload does not contain an issuer (iss) field.
 */
export function decodeToken(token: string): {
  environment: string;
  tenant: string;
  accessToken: string;
  expiresAt?: number;
} | undefined {
  // Validate the token structure (should contain at least header and payload parts)
  const parts = token.split('.');
  if (parts.length < 2) {
    throw new Error('Invalid token format');
  }

  // Retrieve the payload (second part) of the JWT token
  const base64Url = parts[1];

  // Replace URL-safe characters to match standard base64 encoding
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  // Decode the base64 string into a JSON string
  let jsonPayload: string;
  try {
    jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
  } catch (error) {
    throw new Error('Failed to decode token payload');
  }

  // Parse the JSON string to obtain token details
  let tokenDetails: { iss: string; exp?: number; [key: string]: unknown };
  try {
    tokenDetails = JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error('Invalid JSON payload in token');
  }

  // Extract the issuer URL from the token details
  const issuerUrl: string = tokenDetails.iss;
  if (!issuerUrl) {
    throw new Error('Token payload does not contain an issuer (iss) field');
  }

  // Regex to extract environment and tenant from issuer URL:
  // Expected format: https://keycloak.{environment}.corti.app/realms/{tenant}
  // Note: Unnecessary escapes in character classes have been removed.
  const regex =
    /^https:\/\/(keycloak|auth)\.([^.]+)\.corti\.app\/realms\/([^/]+)/;
  const match = issuerUrl.match(regex);

  // If the issuer URL matches the expected pattern, return the extracted values along with the token
  if (match) {
    const expiresAt = tokenDetails.exp && typeof tokenDetails.exp === 'number'
      ? tokenDetails.exp
      : undefined;

    return {
      environment: match[2],
      tenant: match[3],
      accessToken: token,
      expiresAt,
    };
  }

  return undefined;
}

export async function getMediaStream(deviceId?: string): Promise<MediaStream> {
  if (!deviceId) {
    throw new Error('No device ID provided');
  }

  if (deviceId === 'display_audio') {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });
    stream.getTracks().forEach(track => {
      if (track.kind === 'video') {
        stream.removeTrack(track);
      }
    });
    return stream;
  }

  // Get media stream and initialize audio service.
  const constraints: MediaStreamConstraints =
    deviceId !== 'default'
      ? { audio: { deviceId: { exact: deviceId } } }
      : { audio: true };

  return await navigator.mediaDevices.getUserMedia(constraints);
}

export function getErrorMessage(event: Error) {
  try {
    return JSON.parse(event.message);
  } catch {
    return event?.message || event;
  }
}
