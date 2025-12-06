import type { PorkbunBaseResponse } from "../client";

export interface PricingResponse extends PorkbunBaseResponse {
	pricing: Record<string, {
		registration: string;
		renewal: string;
		transfer: string;
		coupons: string[];
	}>[];
}