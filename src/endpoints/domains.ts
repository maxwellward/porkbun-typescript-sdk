import type { PorkbunClient } from "../client";
import type {
	ListAllPayload, ListAllResponse,
	CheckDomainPayload, CheckDomainResponse,
	GetNsPayload, GetNsResponse,
	GetUrlForwardingPayload, GetUrlForwardingResponse,
	GetGlueRecordsPayload, GetGlueRecordsResponse,
	UpdateNsPayload,
	UpdateNsResponse,
	AddUrlForwardPayload,
	AddUrlForwardResponse,
	DeleteUrlForwardPayload,
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
		 * @param payload.domain The TLD to check without the protocol or any path.
		 * @returns A promise that resolves with details about the domain, if it's available, and any additional purchase information.
		 * @example
		 * client.checkDomain({ domain: 'example.com' });
		 */
		checkDomain(payload: CheckDomainPayload): Promise<CheckDomainResponse> {
			return client.request<CheckDomainResponse>(`${BASE_PATH}/checkDomain/${payload.domain}`)
		},

		/**
		 * Gets the authoritative name servers listed at the registry for a domain.
		 * @param payload.domain The TLD to check without the protocol or any path.
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
		 * @param payload.domain The TLD to update without the protocol or any path.
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
		 * @param payload.domain The TLD to check without the protocol or any path.
		 * @returns A promise that resolves with an array of forwards.
		 * @example
		 * client.getUrlForwarding({ domain: 'example.com' });
		 */
		getUrlForwarding(payload: GetUrlForwardingPayload): Promise<GetUrlForwardingResponse> {
			return client.request<GetUrlForwardingResponse>(`${BASE_PATH}/getUrlForwarding/${payload.domain}`)
		},

		/**
		 * Adds a URL forward to a domain
		 * @param payload.domain The TLD to modify without the protocol or any path.
		 * @param {string|undefined} payload.subdomain A subdomain that you would like to add URL forwarding for. Leave this blank to forward the root domain.
		 * @param payload.location Where you'd like to forward the domain to.
		 * @param payload.type The type of forward. Valid types are: temporary or permanent
		 * @param payload.includePath Whether or not to include the URI path in the redirection. Valid options are yes or no.
		 * @param payload.wildcard Also forward all subdomains of the domain. Valid options are yes or no.
		 * @example
		 * client.addUrlForward({ domain: 'example.com', subdomain: "blog", location: "https://blog.example.com", type: "temporary", includePath: "no", wildcard: "yes" });
		 */
		addUrlForward(payload: AddUrlForwardPayload): Promise<AddUrlForwardResponse> {
			const { domain, ...body } = payload;
			return client.request<AddUrlForwardResponse>(`${BASE_PATH}/addUrlForward/${payload.domain}`, body)
		},

		/**
		 * Deletes a URL forward from a domain
		 * @param payload.domain The TLD to modify without the protocol or any path.
		 * @param payload.record The ID of the record to delete.
		 * @example
		 * client.deleteUrlForward({ domain: 'example.com', forward_id: '22049209' });
		 */
		deleteUrlForward(payload: DeleteUrlForwardPayload): Promise<DeleteUrlForwardPayload> {
			return client.request<DeleteUrlForwardPayload>(`${BASE_PATH}/deleteUrlForward/${payload.domain}/${payload.forward_id}`)
		},


		/**
		 * Gets a list of hosts and their glue records for a domain.
		 * @param payload.domain The TLD to check without the protocol or any path.
		 * @returns A promise that resolves with an array of hosts and their glue records. Null if empty.
		 * @example
		 * client.getGlueRecords({ domain: 'example.com' });
		 */
		getGlueRecords(payload: GetGlueRecordsPayload): Promise<GetGlueRecordsResponse> {
			return client.request<GetGlueRecordsResponse>(`${BASE_PATH}/getGlue/${payload.domain}`)
		},
	}
}