import type { PorkbunClient } from "../client";
import type {
	RetrieveSslBundlePayload,
	RetrieveSslBundleResponse,
} from "../types/ssl";
import { assertValid, validateDomain } from "../validation";

export type SslNamespace = ReturnType<typeof createSslNamespace>;

export const createSslNamespace = (client: PorkbunClient) => {
	const BASE_PATH = "/ssl";

	return {
		/**
		 * Retrieves the SSL certificate bundle for a domain.
		 * @param payload.domain The domain to retrieve the SSL bundle for.
		 * @returns A promise that resolves with the SSL certificate chain, private key, and public key.
		 * @example
		 * client.ssl.getSslBundle({ domain: 'example.com' });
		 */
		getSslBundle(
			payload: RetrieveSslBundlePayload,
		): Promise<RetrieveSslBundleResponse> {
			assertValid(validateDomain(payload.domain), "domain", payload.domain);

			return client.request<RetrieveSslBundleResponse>(
				`${BASE_PATH}/retrieve/${payload.domain}`,
			);
		},
	};
};
