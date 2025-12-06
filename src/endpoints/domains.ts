import type { PorkbunClient } from "../client";
import type {
	AddUrlForwardPayload,
	AddUrlForwardResponse,
	CheckDomainPayload,
	CheckDomainResponse,
	CreateGluePayload,
	CreateGlueResponse,
	DeleteGluePayload,
	DeleteGlueResponse,
	DeleteUrlForwardPayload,
	DeleteUrlForwardResponse,
	GetGlueRecordsPayload,
	GetGlueRecordsResponse,
	GetNsPayload,
	GetNsResponse,
	GetUrlForwardingPayload,
	GetUrlForwardingResponse,
	ListAllPayload,
	ListAllResponse,
	UpdateGluePayload,
	UpdateGlueResponse,
	UpdateNsPayload,
	UpdateNsResponse,
} from "../types/domains";
import {
	assertValid,
	validateDomain,
	validateForwardId,
	validateForwardType,
	validateIPs,
	validateNameservers,
	validateSubdomain,
	validateUrl,
	validateYesNo,
} from "../validation";

export type DomainsNamespace = ReturnType<typeof createDomainsNamespace>;

export const createDomainsNamespace = (client: PorkbunClient) => {
	const BASE_PATH = "/domain";

	return {
		/**
		 * Retrieves all domains in the account.
		 * @param payload.start The index to start retrieving domains from. Defaults to 0.
		 * @param payload.includeLabels Whether to include domain labels in the response. Defaults to false.
		 * @returns A promise that resolves with the list of domains.
		 * @example
		 * client.domains.listAll();
		 */
		listAll(payload?: ListAllPayload): Promise<ListAllResponse> {
			return client.request<ListAllResponse>(`${BASE_PATH}/listAll`, {
				start: 0,
				includeLabels: false,
				...payload,
			});
		},

		/**
		 * Checks the availability of a domain.
		 * @param payload.domain The domain to check without the protocol or any path.
		 * @returns A promise that resolves with details about the domain, if it's available, and any additional purchase information.
		 * @example
		 * client.domains.checkDomain({ domain: 'example.com' });
		 */
		checkDomain(payload: CheckDomainPayload): Promise<CheckDomainResponse> {
			assertValid(validateDomain(payload.domain), "domain", payload.domain);

			return client.request<CheckDomainResponse>(
				`${BASE_PATH}/checkDomain/${payload.domain}`,
			);
		},

		/**
		 * Gets the authoritative name servers listed at the registry for a domain.
		 * @param payload.domain The domain to check without the protocol or any path.
		 * @returns A promise that resolves with an array of nameservers.
		 * @example
		 * client.domains.getNameservers({ domain: 'example.com' });
		 */
		getNameservers(payload: GetNsPayload): Promise<GetNsResponse> {
			assertValid(validateDomain(payload.domain), "domain", payload.domain);

			return client.request<GetNsResponse>(
				`${BASE_PATH}/getNs/${payload.domain}`,
			);
		},

		/**
		 * @see {@link getNameservers}
		 */
		getNs(payload: GetNsPayload): Promise<GetNsResponse> {
			return this.getNameservers(payload);
		},

		/**
		 * Updates the authoritative name servers listed at the registry for a domain.
		 * @param payload.domain The domain to update without the protocol or any path.
		 * @param payload.ns An array of nameservers to set for the domain.
		 * @returns A promise that resolves with the operation status.
		 * @example
		 * client.domains.updateNameservers({ domain: 'example.com', ns: ['curitiba.ns.porkbun.com', 'fortaleza.ns.porkbun.com', 'maceio.ns.porkbun.com', 'salvador.ns.porkbun.com'] });
		 */
		updateNameservers(payload: UpdateNsPayload): Promise<UpdateNsResponse> {
			assertValid(validateNameservers(payload.ns), "ns", payload.ns);

			const { domain, ...body } = payload;
			return client.request<UpdateNsResponse>(
				`${BASE_PATH}/updateNs/${domain}`,
				body,
			);
		},

		/**
		 * @see {@link updateNameservers}
		 */
		updateNs(payload: UpdateNsPayload): Promise<UpdateNsResponse> {
			return this.updateNameservers(payload);
		},

		/**
		 * Gets a list of URL forwards for a domain.
		 * @param payload.domain The domain to check without the protocol or any path.
		 * @returns A promise that resolves with an array of forwards.
		 * @example
		 * client.domains.getUrlForwarding({ domain: 'example.com' });
		 */
		getUrlForwarding(
			payload: GetUrlForwardingPayload,
		): Promise<GetUrlForwardingResponse> {
			assertValid(validateDomain(payload.domain), "domain", payload.domain);

			return client.request<GetUrlForwardingResponse>(
				`${BASE_PATH}/getUrlForwarding/${payload.domain}`,
			);
		},

		/**
		 * Adds a URL forward to a domain.
		 * @param payload.domain The domain to modify without the protocol or any path.
		 * @param {string|undefined} payload.subdomain A subdomain that you would like to add URL forwarding for. Leave this blank to forward the root domain.
		 * @param payload.location Where you'd like to forward the domain to.
		 * @param payload.type The type of forward. Valid types are: temporary or permanent.
		 * @param payload.includePath Whether or not to include the URI path in the redirection. Valid options are yes or no.
		 * @param payload.wildcard Also forward all subdomains of the domain. Valid options are yes or no.
		 * @returns A promise that resolves with the operation status.
		 * @example
		 * client.domains.addUrlForward({ domain: 'example.com', subdomain: 'blog', location: 'https://blog.example.com', type: 'temporary', includePath: 'no', wildcard: 'yes' });
		 */
		addUrlForward(
			payload: AddUrlForwardPayload,
		): Promise<AddUrlForwardResponse> {
			assertValid(validateUrl(payload.location), "location", payload.location);
			assertValid(validateForwardType(payload.type), "type", payload.type);
			assertValid(
				validateYesNo(payload.includePath),
				"includePath",
				payload.includePath,
			);
			assertValid(
				validateYesNo(payload.wildcard),
				"wildcard",
				payload.wildcard,
			);
			if (payload.subdomain !== undefined) {
				assertValid(
					validateSubdomain(payload.subdomain),
					"subdomain",
					payload.subdomain,
				);
			}

			const { domain, ...body } = payload;
			return client.request<AddUrlForwardResponse>(
				`${BASE_PATH}/addUrlForward/${domain}`,
				body,
			);
		},

		/**
		 * Deletes a URL forward from a domain.
		 * @param payload.domain The domain to modify without the protocol or any path.
		 * @param payload.forward_id The ID of the forward to delete.
		 * @returns A promise that resolves with the operation status.
		 * @example
		 * client.domains.deleteUrlForward({ domain: 'example.com', forward_id: '22049209' });
		 */
		deleteUrlForward(
			payload: DeleteUrlForwardPayload,
		): Promise<DeleteUrlForwardResponse> {
			assertValid(
				validateForwardId(payload.forward_id),
				"forward_id",
				payload.forward_id,
			);

			return client.request<DeleteUrlForwardResponse>(
				`${BASE_PATH}/deleteUrlForward/${payload.domain}/${payload.forward_id}`,
			);
		},

		/**
		 * Gets a list of hosts and their glue records for a domain.
		 * @param payload.domain The domain to check without the protocol or any path.
		 * @returns A promise that resolves with an array of hosts and their glue records. Null if empty.
		 * @example
		 * client.domains.getGlueRecords({ domain: 'example.com' });
		 */
		getGlueRecords(
			payload: GetGlueRecordsPayload,
		): Promise<GetGlueRecordsResponse> {
			assertValid(validateDomain(payload.domain), "domain", payload.domain);

			return client.request<GetGlueRecordsResponse>(
				`${BASE_PATH}/getGlue/${payload.domain}`,
			);
		},

		/**
		 * Creates a glue record for a domain.
		 * @param payload.domain The domain to modify without the protocol or any path.
		 * @param payload.glue_host_subdomain The subdomain for the glue record (e.g., "ns1").
		 * @param payload.ips An array of IP addresses.
		 * @returns A promise that resolves with the operation status.
		 * @example
		 * client.domains.createGlue({ domain: 'example.com', glue_host_subdomain: 'ns1', ips: ['192.168.1.1', '2001:db8:3333:4444:5555:6666:7777:8888'] });
		 */
		createGlue(payload: CreateGluePayload): Promise<CreateGlueResponse> {
			assertValid(
				validateSubdomain(payload.glue_host_subdomain),
				"glue_host_subdomain",
				payload.glue_host_subdomain,
			);
			assertValid(validateIPs(payload.ips), "ips", payload.ips);

			const { domain, glue_host_subdomain, ...body } = payload;
			return client.request<CreateGlueResponse>(
				`${BASE_PATH}/createGlue/${domain}/${glue_host_subdomain}`,
				body,
			);
		},

		/**
		 * Updates a glue record for a domain.
		 * @param payload.domain The domain to modify without the protocol or any path.
		 * @param payload.glue_host_subdomain The glue host subdomain to modify.
		 * @param payload.ips An array of IP addresses.
		 * @returns A promise that resolves with the operation status.
		 * @example
		 * client.domains.updateGlue({ domain: 'example.com', glue_host_subdomain: 'ns1', ips: ['192.168.1.1', '2001:db8:3333:4444:5555:6666:7777:8888'] });
		 */
		updateGlue(payload: UpdateGluePayload): Promise<UpdateGlueResponse> {
			assertValid(
				validateSubdomain(payload.glue_host_subdomain),
				"glue_host_subdomain",
				payload.glue_host_subdomain,
			);
			assertValid(validateIPs(payload.ips), "ips", payload.ips);

			const { domain, glue_host_subdomain, ...body } = payload;
			return client.request<UpdateGlueResponse>(
				`${BASE_PATH}/updateGlue/${domain}/${glue_host_subdomain}`,
				body,
			);
		},

		/**
		 * Deletes a glue record for a domain.
		 * @param payload.domain The domain to modify without the protocol or any path.
		 * @param payload.glue_host_subdomain The glue host subdomain to delete.
		 * @returns A promise that resolves with the operation status.
		 * @example
		 * client.domains.deleteGlue({ domain: 'example.com', glue_host_subdomain: 'ns1' });
		 */
		deleteGlue(payload: DeleteGluePayload): Promise<DeleteGlueResponse> {
			assertValid(
				validateSubdomain(payload.glue_host_subdomain),
				"glue_host_subdomain",
				payload.glue_host_subdomain,
			);

			return client.request<DeleteGlueResponse>(
				`${BASE_PATH}/deleteGlue/${payload.domain}/${payload.glue_host_subdomain}`,
			);
		},
	};
};
