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

export interface ListAllResponse extends PorkbunBaseResponse {
	domains: Domain[];
}

export interface ListAllPayload {
	start?: number;
	includeLabels?: boolean;
}