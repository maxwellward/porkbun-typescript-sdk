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
	avail: string,
	type: string,
	price: string,
	firstYearPromo: string,
	regularPrice: string,
	premium: string,
	additional: {
		renewal: {
			type: string,
			price: string,
			regularPrice: string
		},
		transfer: {
			type: string,
			price: string,
			regularPrice: string
		}
	}
}

export interface GetNsPayload {
	domain: string;
}
export interface GetNsResponse extends PorkbunBaseResponse {
	ns: string[]
}

export interface GetUrlForwardingPayload {
	domain: string;
}
export interface GetUrlForwardingResponse extends PorkbunBaseResponse {
	forwards: [
		{
			id: string,
			subdomain: string,
			location: string,
			type: string,
			includePath: string,
			wildcard: string,
		}
	]
}