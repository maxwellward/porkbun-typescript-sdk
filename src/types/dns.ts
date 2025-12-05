import type { PorkbunBaseResponse } from "../client";

export interface DnsRecord {
	id: string,
	name: string,
	type: string,
	content: string,
	ttl: string,
	prio: string,
	notes: string,
}

export interface RetrieveDnsRecordsPayload {
	domain: string;
	record_id?: string;
}
export interface RetrieveDnsRecordsResponse extends PorkbunBaseResponse {
	records: DnsRecord[];
}