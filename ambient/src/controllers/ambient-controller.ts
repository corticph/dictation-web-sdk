import { SocketController } from "@corti/core-web/controllers/socket-controller.js";
import type { StreamAmbientMessage } from "@corti/core-web/socket-messages.js";
import type { ProxyOptions } from "@corti/core-web/types.js";
import {
  type Corti,
  type CortiClient,
  CortiWebSocketProxyClient,
} from "@corti/sdk";

export type { StreamAmbientMessage } from "@corti/core-web/socket-messages.js";

export type AmbientStreamSessionConfig = {
  interactionId: string;
  configuration: Corti.StreamConfig;
};

type AmbientStreamSocket = Awaited<
  ReturnType<CortiClient["stream"]["connect"]>
>;

type OutboundItem = Blob | Corti.StreamEndMessage;

export class AmbientController extends SocketController<
  OutboundItem,
  StreamAmbientMessage,
  AmbientStreamSessionConfig,
  AmbientStreamSocket
> {
  async stopRecording(): Promise<void> {
    await this.closeConnection();
  }

  protected async _connectThroughProxy(
    session: AmbientStreamSessionConfig,
    proxy: ProxyOptions,
  ): Promise<AmbientStreamSocket> {
    return await CortiWebSocketProxyClient.stream.connect({
      // awaitConfiguration: false — CONFIG_* appears in network activity before the socket is configured server-side
      awaitConfiguration: false,
      configuration: session.configuration,
      proxy,
    });
  }

  protected async _connectThroughAuth(
    client: CortiClient,
    session: AmbientStreamSessionConfig,
  ): Promise<AmbientStreamSocket> {
    return await client.stream.connect({
      // awaitConfiguration: false — CONFIG_* appears in network activity before the socket is configured server-side
      awaitConfiguration: false,
      configuration: session.configuration,
      id: session.interactionId,
    });
  }
}
