import type { PorkbunClient } from "../client";
import type { PingResponse } from "../types/ping";

export const createPingMethod = (client: PorkbunClient) => {
	/**
	 * Pings the Porkbun API to verify connectivity and authentication.
	 * @returns A promise that resolves with the ping response containing your IP address.
	 * @example
	 * client.ping();
	 */
	return function ping(): Promise<PingResponse> {
		return client.request<PingResponse>("/ping")
	}
}