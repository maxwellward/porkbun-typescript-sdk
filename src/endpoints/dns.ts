import type { PorkbunClient } from "../client";
import { RetrieveDnsRecordsPayload, RetrieveDnsRecordsResponse } from "../types/dns";

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
	}
}