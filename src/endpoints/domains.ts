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
	CreateGluePayload,
	CreateGlueResponse,
	UpdateGlueResponse,
	UpdateGluePayload,
	DeleteGluePayload,
	DeleteGlueResponse,
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
			return this.getNameservers(payload);
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

		/**
		 * Create glue record for a domain.
		 * @param payload.domain The TLD to modify without the protocol or any path.
		 * @param payload.glue_host_subdomain
		 * @param payload.ips An array of IP addresses.
		 * @example
		 * client.createGlue({ domain: 'example.com', glue_host_subdomain: "ns1", ips: ["192.168.1.1", "2001:db8:3333:4444:5555:6666:7777:8888"] });
		 */
		createGlue(payload: CreateGluePayload): Promise<CreateGlueResponse> {
			const { domain, glue_host_subdomain, ...body } = payload;
			return client.request<CreateGlueResponse>(`${BASE_PATH}/createGlue/${payload.domain}/${payload.glue_host_subdomain}`, body)
		},

		/**
		 * Update glue record for a domain.
		 * @param payload.domain The TLD to modify without the protocol or any path.
		 * @param payload.glue_host_subdomain The glue host subdomain to modify.
		 * @param payload.ips An array of IP addresses.
		 * @example
		 * client.updateGlue({ domain: 'example.com', glue_host_subdomain: "ns1", ips: ["192.168.1.1", "2001:db8:3333:4444:5555:6666:7777:8888"] });
		 */
		updateGlue(payload: UpdateGluePayload): Promise<UpdateGlueResponse> {
			const { domain, glue_host_subdomain, ...body } = payload;
			return client.request<UpdateGlueResponse>(`${BASE_PATH}/updateGlue/${payload.domain}/${payload.glue_host_subdomain}`, body)
		},

		/**
		 * Delete a glue record for a domain.
		 * @param payload.domain The TLD to modify without the protocol or any path.
		 * @param payload.glue_host_subdomain The glue host subdomain to delete.
		 * @example
		 * client.deleteGlue({ domain: 'example.com', glue_host_subdomain: "ns1" });
		 */
		deleteGlue(payload: DeleteGluePayload): Promise<DeleteGlueResponse> {
			const { domain, glue_host_subdomain, ...body } = payload;
			return client.request<DeleteGlueResponse>(`${BASE_PATH}/deleteGlue/${payload.domain}/${payload.glue_host_subdomain}`, body)
		},
	}
}