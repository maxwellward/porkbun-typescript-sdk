import type { PorkbunClient } from "../client";
import { RetrieveDnsRecordsBySubdomainPayload, RetrieveDnsRecordsBySubdomainResponse, RetrieveDnsRecordsByTypePayload, RetrieveDnsRecordsByTypeResponse, RetrieveDnsRecordsPayload, RetrieveDnsRecordsResponse } from "../types/dns";

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
	}
}