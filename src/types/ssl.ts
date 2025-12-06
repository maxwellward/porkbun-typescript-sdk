import type { PorkbunBaseResponse } from "../client";

export interface RetrieveSslBundlePayload {
	domain: string;
}
export interface RetrieveSslBundleResponse extends PorkbunBaseResponse {
	certificatechain: string;
	privatekey: string;
	publickey: string;
}
