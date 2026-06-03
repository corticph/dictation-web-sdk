import { SocketController } from "@corti/core-web/controllers/socket-controller.js";
import type { TranscribeMessage } from "@corti/core-web/socket-messages.js";
import type { ProxyOptions } from "@corti/core-web/types.js";
import {
  type Corti,
  type CortiClient,
  CortiWebSocketProxyClient,
} from "@corti/sdk";

export type { TranscribeMessage } from "@corti/core-web/socket-messages.js";

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
