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

export interface RetrieveDnsRecordsByTypePayload {
	domain: string;
	type: string;
}
export interface RetrieveDnsRecordsByTypeResponse extends PorkbunBaseResponse {
	records: DnsRecord[];
}

export interface RetrieveDnsRecordsBySubdomainPayload {
	domain: string;
	type: string;
	subdomain: string;
}
export interface RetrieveDnsRecordsBySubdomainResponse extends PorkbunBaseResponse {
	records: DnsRecord[];
}