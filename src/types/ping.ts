import type { PorkbunBaseResponse } from "../client";

export interface PingResponse extends PorkbunBaseResponse {
	yourIp: string;
	xForwardedFor: string;
}