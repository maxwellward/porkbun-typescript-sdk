import type { PorkbunBaseResponse } from "../client";

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
	SSHFP = "SSHFP",
}

export interface DnsRecord {
	id: string;
	name: string;
	type: `${DNS_RECORD_TYPE}`;
	content: string;
	ttl: number;
	prio: string;
	notes: string;
}

export interface DnssecRecord {
	keyTag: number;
	alg: number;
	digestType: number;
	digest: string;
}

export interface RetrieveDnsRecordsPayload {
	domain: string;
	type?: `${DNS_RECORD_TYPE}`;
}
export interface RetrieveDnsRecordsResponse extends PorkbunBaseResponse {
	records: DnsRecord[];
}

export interface RetrieveDnsRecordPayload {
	domain: string;
	record_id: string;
}
export interface RetrieveDnsRecordResponse extends PorkbunBaseResponse {
	record: DnsRecord | null;
}

export interface RetrieveDnsRecordsByTypePayload {
	domain: string;
	type: `${DNS_RECORD_TYPE}`;
}
export interface RetrieveDnsRecordsByTypeResponse extends PorkbunBaseResponse {
	records: DnsRecord[];
}

export interface RetrieveDnsRecordsBySubdomainPayload {
	domain: string;
	type: `${DNS_RECORD_TYPE}`;
	subdomain: string;
}
export interface RetrieveDnsRecordsBySubdomainResponse
	extends PorkbunBaseResponse {
	records: DnsRecord[];
}

export interface CreateDnsRecordPayload {
	domain: string;
	name?: string;
	type: `${DNS_RECORD_TYPE}`;
	content: string;
	ttl?: number;
	prio?: string;
	notes?: string;
}
export interface CreateDnsRecordResponse extends PorkbunBaseResponse {
	id: string;
}

export interface EditDnsRecordByIdPayload {
	domain: string;
	record_id: string;
	name?: string;
	type: `${DNS_RECORD_TYPE}`;
	content: string;
	ttl?: number;
	prio?: string;
	notes?: string;
}
export interface EditDnsRecordByIdResponse extends PorkbunBaseResponse {}

export interface EditDnsRecordsBySubdomainPayload {
	domain: string;
	type: `${DNS_RECORD_TYPE}`;
	subdomain: string;
	content: string;
	ttl?: number;
	prio?: string;
	notes?: string;
}
export interface EditDnsRecordsBySubdomainResponse
	extends PorkbunBaseResponse {}

export interface DeleteDnsRecordByIdPayload {
	domain: string;
	record_id: string;
}
export interface DeleteDnsRecordByIdResponse extends PorkbunBaseResponse {}

export interface DeleteDnsRecordsBySubdomainPayload {
	domain: string;
	type: `${DNS_RECORD_TYPE}`;
	subdomain: string;
}
export interface DeleteDnsRecordsBySubdomainResponse
	extends PorkbunBaseResponse {}

export interface CreateDnssecRecordPayload {
	domain: string;
	keyTag?: number;
	alg?: number;
	digestType?: number;
	digest?: string;
	maxSigLife?: string;
	keyDataFlags?: string;
	keyDataProtocol?: string;
	keyDataAlgo?: string;
	keyDataPubKey?: string;
}
export interface CreateDnssecRecordResponse extends PorkbunBaseResponse {}

export interface DeleteDnssecRecordPayload {
	domain: string;
	keyTag: number;
}
export interface DeleteDnssecRecordResponse extends PorkbunBaseResponse {}

export interface GetDnssecRecordsPayload {
	domain: string;
}
export interface GetDnssecRecordResponse extends PorkbunBaseResponse {
	records: Record<string, DnssecRecord>;
}
