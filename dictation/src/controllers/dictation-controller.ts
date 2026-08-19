import { SocketController } from "@core/controllers/socket-controller.js";
import type { TranscribeMessage } from "@core/socket-messages.js";
import type { ProxyOptions } from "@core/types.js";
import { speechAnalytics } from "@core/utils/analytics.js";
import {
  type Corti,
  type CortiClient,
  CortiWebSocketProxyClient,
} from "@corti/sdk";
import { WEB_COMPONENT_NAME, WEB_COMPONENT_VERSION } from "../version.js";

export type { TranscribeMessage } from "@core/socket-messages.js";

type TranscribeSocket = Awaited<
  ReturnType<CortiClient["transcribe"]["connect"]>
>;

type OutboundItem =
  | Blob
  | Corti.TranscribeFlushMessage
  | Corti.TranscribeEndMessage;

export class DictationController extends SocketController<
  OutboundItem,
  TranscribeMessage,
  Corti.TranscribeConfig,
  TranscribeSocket
> {
  protected readonly _analytics = speechAnalytics(
    WEB_COMPONENT_NAME,
    WEB_COMPONENT_VERSION,
  );

  async stopRecording(): Promise<void> {
    await this.pause();
  }

  protected async _connectThroughProxy(
    dictationConfig: Corti.TranscribeConfig,
    proxy: ProxyOptions,
  ): Promise<TranscribeSocket> {
    return await CortiWebSocketProxyClient.transcribe.connect({
      // awaitConfiguration: false — CONFIG_* appears in network activity before the socket is configured server-side
      awaitConfiguration: false,
      configuration: dictationConfig,
      proxy,
    });
  }

  protected async _connectThroughAuth(
    client: CortiClient,
    dictationConfig: Corti.TranscribeConfig,
  ): Promise<TranscribeSocket> {
    return await client.transcribe.connect({
      // awaitConfiguration: false — CONFIG_* appears in network activity before the socket is configured server-side
      awaitConfiguration: false,
      configuration: dictationConfig,
    });
  }
}
