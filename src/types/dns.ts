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

export enum DNS_RECORD_TYPE {
	A = "A",
	MX = "MX",
	CNAME = "CNAME",
	ALIAS = "ALIAS",
	TXT = "TXT",
	NS = "NS",
	AAAA = "AAAA",
	SRV = "SRV",
	TLSA = "TLSA",
	CAA = "CAA",
	HTTPS = "HTTPS",
	SVCB = "SVCB",
	SSHFP = "SSHFP"
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

export interface CreateDnsRecordPayload {
	domain: string,
	name?: string,
	type: `${DNS_RECORD_TYPE}`,
	content: string,
	ttl?: number,
	prio?: string,
	notes?: string,
}
export interface CreateDnsRecordResponse extends PorkbunBaseResponse {
	id: string;
}

export interface EditDnsRecordByIdPayload {
	domain: string,
	record_id: string,
	name?: string,
	type: `${DNS_RECORD_TYPE}`,
	content: string,
	ttl?: number,
	prio?: string,
	notes?: string,
}
export interface EditDnsRecordByIdResponse extends PorkbunBaseResponse {}

export interface EditDnsRecordsBySubdomainPayload {
	domain: string,
	type: string,
	subdomain: string,
	content: string,
	ttl?: number,
	prio?: string,
	notes?: string,
}
export interface EditDnsRecordsBySubdomainResponse extends PorkbunBaseResponse {}

export interface DeleteDnsRecordByIdPayload {
	domain: string,
	record_id: string,
}
export interface DeleteDnsRecordByIdResponse extends PorkbunBaseResponse {}

export interface DeleteDnsRecordsBySubdomainPayload {
	domain: string,
	type: string,
	subdomain: string,
}
export interface DeleteDnsRecordsBySubdomainResponse extends PorkbunBaseResponse {}