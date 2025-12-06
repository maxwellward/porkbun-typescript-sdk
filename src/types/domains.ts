import type { PorkbunBaseResponse } from "../client";

export interface DomainLabel {
	id: string;
	title: string;
	color: string;
}

export interface Domain {
	domain: string;
	status: string;
	tld: string;
	createDate: string;
	expireDate: string;
	securityLock: string;
	whoisPrivacy: string;
	autoRenew: number;
	notLocal: number;
	labels?: DomainLabel[];
}

export interface ListAllPayload {
	start?: number;
	includeLabels?: boolean;
}
export interface ListAllResponse extends PorkbunBaseResponse {
	domains: Domain[];
}

export interface CheckDomainPayload {
	domain: string;
}
export interface CheckDomainResponse extends PorkbunBaseResponse {
	avail: "yes" | "no";
	type: string;
	price: string;
	firstYearPromo: string;
	regularPrice: string;
	premium: string;
	additional: {
		renewal: {
			type: string;
			price: string;
			regularPrice: string;
		};
		transfer: {
			type: string;
			price: string;
			regularPrice: string;
		};
	};
}

export interface GetNsPayload {
	domain: string;
}
export interface GetNsResponse extends PorkbunBaseResponse {
	ns: string[];
}

export interface UpdateNsPayload {
	domain: string;
	ns: string[];
}
export interface UpdateNsResponse extends PorkbunBaseResponse {}

export interface GetUrlForwardingPayload {
	domain: string;
}
export interface GetUrlForwardingResponse extends PorkbunBaseResponse {
	forwards: {
		id: string;
		subdomain: string;
		location: string;
		type: "temporary" | "permanent";
		includePath: "yes" | "no";
		wildcard: "yes" | "no";
	}[];
}

export interface AddUrlForwardPayload {
	domain: string;
	subdomain?: string;
	location: string;
	type: "temporary" | "permanent";
	includePath: "yes" | "no";
	wildcard: "yes" | "no";
}
export interface AddUrlForwardResponse extends PorkbunBaseResponse {}

export interface DeleteUrlForwardPayload {
	domain: string;
	forward_id: string;
}
export interface DeleteUrlForwardResponse extends PorkbunBaseResponse {}

export interface GetGlueRecordsPayload {
	domain: string;
}
export interface GlueRecordAddresses {
	v4: string[];
	v6: string[];
}
export type GlueRecord = [string, GlueRecordAddresses];
export interface GetGlueRecordsResponse extends PorkbunBaseResponse {
	hosts?: GlueRecord[];
}

export interface CreateGluePayload {
	domain: string;
	glue_host_subdomain: string;
	ips: string[];
}
export interface CreateGlueResponse extends PorkbunBaseResponse {}

export interface UpdateGluePayload {
	domain: string;
	glue_host_subdomain: string;
	ips: string[];
}
export interface UpdateGlueResponse extends PorkbunBaseResponse {}

export interface DeleteGluePayload {
	domain: string;
	glue_host_subdomain: string;
}
export interface DeleteGlueResponse extends PorkbunBaseResponse {}
