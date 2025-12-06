import type { PorkbunClient } from "../client";
import type { PricingResponse } from "../types/pricing";

export type PricingMethod = ReturnType<typeof createPricingMethod>;

export const createPricingMethod = (client: PorkbunClient) => {
	/**
	 * Check default domain pricing information for all supported TLDs. This requests takes a while.
	 * @returns A promise that resolves to an object containing objects with pricing information for every supported TLD. 
	 * @example
	 * client.getDefaultPricing();
	 */
	return function getDefaultPricing(): Promise<PricingResponse> {
		return client.request<PricingResponse>("/pricing/get")
	}
}