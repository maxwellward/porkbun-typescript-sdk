import type { PorkbunClient } from "../client";
import type {
	ListAllPayload, ListAllResponse,
	CheckDomainPayload, CheckDomainResponse,
	GetNsPayload, GetNsResponse,
	GetUrlForwardingPayload, GetUrlForwardingResponse,
	GetGlueRecordsPayload, GetGlueRecordsResponse,
	UpdateNsPayload,
	UpdateNsResponse,
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
			return client.request<GetNsResponse>(`${BASE_PATH}/getNs/${payload.domain}`)
		},

		/**
		 * @see {@link getNameservers}
		 */
		getNs(payload: GetNsPayload): Promise<GetNsResponse> {
			return this.getNs(payload);
		},

		/**
		 * Updates the authoritative name servers listed at the registry for a domain.
		 * @param payload.domain - The TLD to update without the protocol or any path.
		 * @returns A promise with an operation status.
		 * @example
		 * client.updateNameservers({ domain: 'example.com', ns: [ "curitiba.ns.porkbun.com", "fortaleza.ns.porkbun.com", "maceio.ns.porkbun.com", "salvador.ns.porkbun.com" ] });
		 */
		updateNameservers(payload: UpdateNsPayload): Promise<UpdateNsResponse> {
			const { domain, ...body } = payload;
			return client.request<UpdateNsResponse>(`${BASE_PATH}/updateNs/${payload.domain}`, body);
		},

		/**
		 * @see {@link updateNameservers}
		 */
		updateNs(payload: UpdateNsPayload): Promise<UpdateNsResponse> {
			return this.updateNameservers(payload);
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

		/**
		 * Gets a list of hosts and their glue records for a domain.
		 * @param payload.domain - The TLD to check without the protocol or any path.
		 * @returns A promise that resolves with an array of hosts and their glue records. Null if empty.
		 * @example
		 * client.getGlueRecords({ domain: 'example.com' });
		 */
		getGlueRecords(payload: GetGlueRecordsPayload): Promise<GetGlueRecordsResponse> {
			return client.request<GetGlueRecordsResponse>(`${BASE_PATH}/getGlue/${payload.domain}`)
		},
	}
}