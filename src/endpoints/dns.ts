import type { PorkbunClient } from "../client";
import { CreateDnsRecordPayload, CreateDnsRecordResponse, CreateDnssecRecordPayload, CreateDnssecRecordResponse, DeleteDnsRecordByIdPayload, DeleteDnsRecordByIdResponse, DeleteDnsRecordsBySubdomainPayload, DeleteDnsRecordsBySubdomainResponse, DeleteDnssecRecordPayload, DeleteDnssecRecordResponse, EditDnsRecordByIdPayload, EditDnsRecordByIdResponse, EditDnsRecordsBySubdomainPayload, EditDnsRecordsBySubdomainResponse, GetDnssecRecordResponse, GetDnssecRecordsPayload, RetrieveDnsRecordPayload, RetrieveDnsRecordResponse, RetrieveDnsRecordsBySubdomainPayload, RetrieveDnsRecordsBySubdomainResponse, RetrieveDnsRecordsByTypePayload, RetrieveDnsRecordsByTypeResponse, RetrieveDnsRecordsPayload, RetrieveDnsRecordsResponse } from "../types/dns";

export const createDnsNamespace = (client: PorkbunClient) => {
	const BASE_PATH = '/dns'

	return {
		/**
		 * Retrieves all DNS records associated with a domain.
		 * @param payload.domain The TLD to retrieve DNS records from.
		 * @returns A promise that resolves with the DNS record or list of DNS records.
		 * @example
		 * client.getDnsRecords({ domain: 'example.com' });
		 */
		getDnsRecords(payload: RetrieveDnsRecordsPayload): Promise<RetrieveDnsRecordsResponse> {
			return client.request<RetrieveDnsRecordsResponse>(`${BASE_PATH}/retrieve/${payload.domain}`)
		},

		/**
		 * Retrieves a DNS record by its ID.
		 * @param payload.domain The TLD to retrieve DNS records from.
		 * @param payload.record_id The ID of the record to get the details of.
		 * @returns A promise that resolves with the DNS record or list of DNS records.
		 * @example
		 * client.getDnsRecord({ domain: 'example.com', record_id: '106926652' });
		 */
		async getDnsRecord(payload: RetrieveDnsRecordPayload): Promise<RetrieveDnsRecordResponse> {
			const response = await client.request<RetrieveDnsRecordsResponse>(`${BASE_PATH}/retrieve/${payload.domain}/${payload.record_id}`)
			const { records, ...rest } = response;
			return {
				...rest,
				record: records?.[0] ?? null,
			};
		},

		/**
		 * Retrieves all DNS records of a given type at the root domain.
		 * Note: This searches the root domain only, not subdomains. For example, searching for CNAME
		 * records will return nothing if your root domain has no CNAME (root domains typically use
		 * ALIAS or A records instead). Use `getSubdomainDnsRecords` to search specific subdomains.
		 * @param payload.domain The domain to retrieve DNS records from.
		 * @param payload.type The type of record to filter by (e.g., 'A', 'CNAME', 'TXT').
		 * @returns A promise that resolves with a list of DNS records matching the type at the root domain.
		 * @example
		 * // Get all A records at the root domain
		 * client.dns.getRootDnsRecords({ domain: 'example.com', type: 'A' });
		 */
		getRootDnsRecords(payload: RetrieveDnsRecordsByTypePayload): Promise<RetrieveDnsRecordsByTypeResponse> {
			return client.request<RetrieveDnsRecordsByTypeResponse>(`${BASE_PATH}/retrieveByNameType/${payload.domain}/${payload.type}`)
		},

		/**
		 * Retrieves all DNS records of a given type at a specific subdomain.
		 * @param payload.domain The domain to retrieve DNS records from.
		 * @param payload.type The type of record to filter by (e.g., 'A', 'CNAME', 'TXT').
		 * @param payload.subdomain The subdomain to search (e.g., 'www', 'api', 'review').
		 * @returns A promise that resolves with a list of DNS records matching the type and subdomain.
		 * @example
		 * // Get all CNAME records at the 'www' subdomain
		 * client.dns.getSubdomainDnsRecords({ domain: 'example.com', type: 'CNAME', subdomain: 'www' });
		 */
		getSubdomainDnsRecords(payload: RetrieveDnsRecordsBySubdomainPayload): Promise<RetrieveDnsRecordsBySubdomainResponse> {
			return client.request<RetrieveDnsRecordsBySubdomainResponse>(`${BASE_PATH}/retrieveByNameType/${payload.domain}/${payload.type}/${payload.subdomain}`)
		},

		/**
		 * Creates a DNS record on the specified domain.
		 * @param payload.domain The TLD to retrieve DNS records from.
		 * @param {string|undefined} payload.name The subdomain for the record being created, not including the domain itself. Leave blank to create a record on the root domain. Use * to create a wildcard record.
		 * @param payload.type The type of record being created. Valid types are: A, MX, CNAME, ALIAS, TXT, NS, AAAA, SRV, TLSA, CAA, HTTPS, SVCB, SSHFP
		 * @param payload.content The answer content for the record. See the DNS management popup from the domain management console on the Porkbun website for proper formatting of each record type.
		 * @param {number|undefined} payload.ttl The time to live in seconds for the record. The minimum and the default is 600 seconds.
		 * @param {string|undefined} payload.prio The priority of the record for those that support it.
		 * @param {string|undefined} payload.notes Any notes that you'd like to set for the record.
		 * @returns A promise that resolves with the ID of the newly created record.
		 * @example
		 * client.createDnsRecord({ domain: 'example.com', name: 'www', type: 'A', content: '1.1.1.1', ttl: 600 });
		 */
		createDnsRecord(payload: CreateDnsRecordPayload): Promise<CreateDnsRecordResponse> {
			const { domain, ...body } = payload;
			return client.request<CreateDnsRecordResponse>(`${BASE_PATH}/create/${domain}`, body)
		},

		/**
		 * Edits a DNS record on the specified domain.
		 * @param payload.domain The TLD to retrieve DNS records from.
		 * @param payload.record_id The ID of the DNS record to edit. 
		 * @param {string|undefined} payload.name The new subdomain for the record, not including the domain itself. Leave blank to edit a record on the root domain. Use * to edit a wildcard record.
		 * @param payload.type The new type for the record. Valid types are: A, MX, CNAME, ALIAS, TXT, NS, AAAA, SRV, TLSA, CAA, HTTPS, SVCB, SSHFP
		 * @param payload.content The new answer content for the record. See the DNS management popup from the domain management console on the Porkbun website for proper formatting of each record type.
		 * @param {number|undefined} payload.ttl The new time to live in seconds for the record. The minimum and the default is 600 seconds.
		 * @param {string|undefined} payload.prio The new priority of the record for those that support it.
		 * @param {string|undefined} payload.notes Any notes that you'd like to set for the record (replaces old notes).
		 * @returns A promise that resolves successful when the record is edited.
		 * @example
		 * client.editDnsRecordById({ domain: 'example.com', record_id: '106926659', name: 'www', type: 'A', content: '1.1.1.1', ttl: 600 });
		 */
		editDnsRecordById(payload: EditDnsRecordByIdPayload): Promise<EditDnsRecordByIdResponse> {
			const { domain, record_id, ...body } = payload;
			return client.request<EditDnsRecordByIdResponse>(`${BASE_PATH}/edit/${domain}/${record_id}`, body)
		},

		/**
		 * Edit all DNS records for a domain that match a particular subdomain and type.
		 * @param payload.domain The TLD to retrieve DNS records from.
		 * @param payload.type The type to filter by. Valid types are: A, MX, CNAME, ALIAS, TXT, NS, AAAA, SRV, TLSA, CAA, HTTPS, SVCB, SSHFP
		 * @param payload.subdomain The subdomain to filter by. 
		 * @param payload.content The new answer content for the record. See the DNS management popup from the domain management console on the Porkbun website for proper formatting of each record type.
		 * @param {number|undefined} payload.ttl The new time to live in seconds for the record. The minimum and the default is 600 seconds.
		 * @param {string|undefined} payload.prio The new priority of the record for those that support it.
		 * @param {string|undefined} payload.notes Any notes that you'd like to set for the record (replaces old notes).
		 * @returns A promise that resolves successful when the records are edited.
		 * @example
		 * client.editDnsRecordsBySubdomain({ domain: 'example.com', type: 'A', subdomain: 'hello', content: '1.1.1.1', ttl: 600 });
		 */
		editDnsRecordsBySubdomain(payload: EditDnsRecordsBySubdomainPayload): Promise<EditDnsRecordsBySubdomainResponse> {
			const { domain, type, subdomain, ...body } = payload;
			return client.request<EditDnsRecordsBySubdomainResponse>(`${BASE_PATH}/editByNameType/${domain}/${type}/${subdomain}`, body)
		},

		/**
		 * Delete a specific DNS record on a domain.
		 * @param payload.domain The TLD to delete the DNS record from.
		 * @param payload.record_id The ID of the DNS record to delete. 
		 * @returns A promise that resolves successful when the record is deleted.
		 * @example
		 * client.deleteDnsRecordById({ domain: 'example.com', record_id: '106926659' });
		 */
		deleteDnsRecordById(payload: DeleteDnsRecordByIdPayload): Promise<DeleteDnsRecordByIdResponse> {
			return client.request<DeleteDnsRecordByIdResponse>(`${BASE_PATH}/delete/${payload.domain}/${payload.record_id}`)
		},

		/**
		 * Delete all DNS records for a domain that match a particular subdomain and type.
		 * @param payload.domain The TLD to retrieve DNS records from.
		 * @param payload.type The type to filter by. Valid types are: A, MX, CNAME, ALIAS, TXT, NS, AAAA, SRV, TLSA, CAA, HTTPS, SVCB, SSHFP
		 * @param payload.subdomain The subdomain to filter by. 
		 * @returns A promise that resolves successful when the records are deleted.
		 * @example
		 * client.deleteDnsRecordsBySubdomain({ domain: 'example.com', type: 'A', subdomain: 'hello' });
		 */
		deleteDnsRecordsBySubdomain(payload: DeleteDnsRecordsBySubdomainPayload): Promise<DeleteDnsRecordsBySubdomainResponse> {
			const { domain, type, subdomain, ...body } = payload;
			return client.request<DeleteDnsRecordsBySubdomainResponse>(`${BASE_PATH}/deleteByNameType/${domain}/${type}/${subdomain}`, body)
		},

		/**
		 * Create a DNSSEC record at the registry. Please note that DNSSEC creation differs at the various registries and some elements may or may not be required. Most often the max sig life and key data elements are not required.
		 *
		 * @param payload.domain The domain to create the DNSSEC record for.
		 * @param {number|undefined} payload.keyTag Key Tag.
		 * @param {number|undefined} payload.alg DS Data Algorithm.
		 * @param {number|undefined} payload.digestType Digest Type.
		 * @param {string|undefined} payload.digest Digest.
		 * @param {string|undefined} payload.maxSigLife Max Sig Life.
		 * @param {string|undefined} payload.keyDataFlags Key Data Flags.
		 * @param {string|undefined} payload.keyDataProtocol Key Data Protocol.
		 * @param {string|undefined} payload.keyDataAlgo Key Data Algorithm.
		 * @param {string|undefined} payload.keyDataPubKey Key Data Public Key.
		 * @returns A promise that resolves successfully when the record is created.
		 * @example
		 * client.createDnssecRecord({ domain: 'example.com', keyTag: 12345, alg: 13, digestType: 2, digest: 'abc123...' });
		 */
		createDnssecRecord(payload: CreateDnssecRecordPayload): Promise<CreateDnssecRecordResponse> {
			const { domain, ...body } = payload;
			return client.request<CreateDnssecRecordResponse>(`${BASE_PATH}/createDnssecRecord/${domain}`, body)
		},

		/**
		 * Delete a DNSSEC record associated with the domain at the registry. Please note that most registries will delete all records with matching data, not just the record with the matching key tag.
		 *
		 * @param payload.domain The domain to delete the DNSSEC record on.
		 * @param payload.keyTag The key tag value for the DNSSEC record.
		 * @returns A promise that resolves successfully when the record is deleted.
		 * @example
		 * client.deleteDnssecRecord({ domain: 'example.com', keyTag: 12345 });
		 */
		deleteDnssecRecord(payload: DeleteDnssecRecordPayload): Promise<DeleteDnssecRecordResponse> {
			return client.request<DeleteDnssecRecordResponse>(`${BASE_PATH}/deleteDnssecRecord/${payload.domain}/${payload.keyTag}`)
		},

		/**
		 * Gets all DNSSEC records at the registry for a specific domain. 
		 *
		 * @param payload.domain The domain to get the DNSSEC records for.
		 * @returns A promise that returns an object of all the DNSSEC records for the specified domain. Null if empty.
		 * @example
		 * client.getDnssecRecords({ domain: 'example.com' });
		 */
		getDnssecRecords(payload: GetDnssecRecordsPayload): Promise<GetDnssecRecordResponse> {
			return client.request<GetDnssecRecordResponse>(`${BASE_PATH}/getDnssecRecords/${payload.domain}`)
		},
	}
}