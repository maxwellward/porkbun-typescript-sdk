import type { PorkbunClient } from "../client";
import { CreateDnsRecordPayload, CreateDnsRecordResponse, DeleteDnsRecordByIdPayload, DeleteDnsRecordByIdResponse, DeleteDnsRecordsBySubdomainPayload, DeleteDnsRecordsBySubdomainResponse, EditDnsRecordByIdPayload, EditDnsRecordByIdResponse, EditDnsRecordsBySubdomainPayload, EditDnsRecordsBySubdomainResponse, RetrieveDnsRecordsBySubdomainPayload, RetrieveDnsRecordsBySubdomainResponse, RetrieveDnsRecordsByTypePayload, RetrieveDnsRecordsByTypeResponse, RetrieveDnsRecordsPayload, RetrieveDnsRecordsResponse } from "../types/dns";

export const createDnsNamespace = (client: PorkbunClient) => {
	const BASE_PATH = '/dns'

	return {
		/**
		 * Retrieves all DNS records associated with a domain or a single record for a particular record ID.
		 * @param payload.domain The TLD to retrieve DNS records from.
		 * @param {string|undefined} payload.record_id The ID of the record to get the details of.
		 * @returns A promise that resolves with the DNS record or list of DNS records.
		 * @example
		 * client.getDnsRecords({ domain: 'example.com' });
		 * @example
		 * client.getDnsRecords({ domain: 'example.com', record_id: '106926652' });
		 */
		getDnsRecords(payload: RetrieveDnsRecordsPayload): Promise<RetrieveDnsRecordsResponse> {
			if (payload.record_id) {
				return client.request<RetrieveDnsRecordsResponse>(`${BASE_PATH}/retrieve/${payload.domain}/${payload.record_id}`)
			} else {
				return client.request<RetrieveDnsRecordsResponse>(`${BASE_PATH}/retrieve/${payload.domain}`)
			}
		},

		/**
		 * Retrieves all DNS records associated with a domain and record type.
		 * WARNING: This is potentially currently bugged on the Porkbun API side and will not return all the right results.
		 * @param payload.domain The TLD to retrieve DNS records from.
		 * @param payload.type The type of record to filter by.
		 * @returns A promise that resolves with a list of DNS records for the specified domain, matching the type filter.
		 * @example
		 * client.getDnsRecordsByType({ domain: 'example.com', type: 'cname' });
		 */
		getDnsRecordsByType(payload: RetrieveDnsRecordsByTypePayload): Promise<RetrieveDnsRecordsByTypeResponse> {
			console.log(`${BASE_PATH}/retrieveByNameType/${payload.domain}/${payload.type}`);

			return client.request<RetrieveDnsRecordsByTypeResponse>(`${BASE_PATH}/retrieveByNameType/${payload.domain}/${payload.type}`)
		},

		/**
		 * Retrieves all DNS records associated with a domain, record type, and subdomain.
		 * WARNING: This is potentially currently bugged on the Porkbun API side and will not return all the right results.
		 * @param payload.domain The TLD to retrieve DNS records from.
		 * @param payload.type The type of record to filter by.
		 * @param payload.subdomain The subdomain to filter by.
		 * @returns A promise that resolves with a list of DNS records for the specified domain, matching the type and subdomain filter.
		 * @example
		 * client.getDnsRecordsBySubdomain({ domain: 'example.com', type: 'cname', subdomain: 'hello' });
		 */
		getDnsRecordsBySubdomain(payload: RetrieveDnsRecordsBySubdomainPayload): Promise<RetrieveDnsRecordsBySubdomainResponse> {
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
		 * @param {string|undefined} payload.name The new subdomain for the record, not including the domain itself. Leave blank to create a record on the root domain. Use * to create a wildcard record.
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
	}
}