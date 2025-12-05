import type { PorkbunClient } from "../client";
import type {
	ListAllPayload, ListAllResponse,
	CheckDomainPayload, CheckDomainResponse,
	GetNsPayload, GetNsResponse,
	GetUrlForwarding,
	GetUrlForwardingPayload,
	GetUrlForwardingResponse,
} from "../types/domains";

export const createDomainsNamespace = (client: PorkbunClient) => {
	const BASE_PATH = '/domain'

	return {
		/**
		 * Retrieves all domains in the account.
		 * @param payload.start - The index to start retrieving domains from. Defaults to 0.
		 * @param payload.includeLabels - Whether to include domain labels in the response. Defaults to false.
		 * @returns A promise that resolves with the list of domains.
		 * @example
		 * client.listAll();
		 */
		listAll(payload?: ListAllPayload): Promise<ListAllResponse> {
			return client.request<ListAllResponse>(`${BASE_PATH}/listAll`, {
				start: 0,
				includeLabels: false,
				...payload
			})
		},

		/**
		 * Checks the availability of a domain
		 * @param payload.domain - The TLD to check without the protocol or any path.
		 * @returns A promise that resolves with details about the domain, if it's available, and any additional purchase information.
		 * @example
		 * client.checkDomain({ domain: 'example.com' });
		 */
		checkDomain(payload: CheckDomainPayload): Promise<CheckDomainResponse> {
			return client.request<CheckDomainResponse>(`${BASE_PATH}/checkDomain/${payload.domain}`)
		},

		/**
		 * Gets the authoritative name servers listed at the registry for a domain.
		 * @param payload.domain - The TLD to check without the protocol or any path.
		 * @returns A promise that resolves with an array of nameservers.
		 * @example
		 * client.getNameservers({ domain: 'example.com' });
		 */
		getNameservers(payload: GetNsPayload): Promise<GetNsResponse> {
			return this.getNs(payload);
		},

		/**
		 * @see {@link getNameservers}
		 */
		getNs(payload: GetNsPayload): Promise<GetNsResponse> {
			return client.request<GetNsResponse>(`${BASE_PATH}/getNs/${payload.domain}`)
		},

		/**
		 * Gets a list of URL forwards for a domain
		 * @param payload.domain - The TLD to check without the protocol or any path.
		 * @returns A promise that resolves with an array of forwards.
		 * @example
		 * client.getUrlForwarding({ domain: 'example.com' });
		 */
		getUrlForwarding(payload: GetUrlForwardingPayload): Promise<GetUrlForwardingResponse> {
			return client.request<GetUrlForwardingResponse>(`${BASE_PATH}/getUrlForwarding/${payload.domain}`)
		},
	}
}