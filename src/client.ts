import { createDnsNamespace, type DnsNamespace } from "./endpoints/dns";
import {
	createDomainsNamespace,
	type DomainsNamespace,
} from "./endpoints/domains";
import { createPingMethod, type PingMethod } from "./endpoints/ping";
import { createPricingMethod, PricingMethod } from "./endpoints/pricing";
import { createSslNamespace, type SslNamespace } from "./endpoints/ssl";
import {
	PorkbunAPIError,
	PorkbunHTTPError,
	PorkbunNetworkError,
	PorkbunResponseError,
} from "./errors";
import { assertValid, validateDomain } from "./validation";

export interface PorkbunClientOptions {
	apiKey: string;
	secretApiKey: string;
	baseUrl?: string;
}

/** Type guard to check if a value is a valid Porkbun API response */
function isPorkbunResponse(value: unknown): value is PorkbunBaseResponse {
	return (
		typeof value === "object" &&
		value !== null &&
		"status" in value &&
		typeof (value as PorkbunBaseResponse).status === "string"
	);
}

/**
 * Base response structure returned by all Porkbun API endpoints.
 */
export interface PorkbunBaseResponse {
	/** The status of the request. "SUCCESS" indicates a successful response. */
	status: string;
	/** An optional message providing additional details about the response. */
	message?: string;
	/** Rate limit information for the API. */
	limits?: {
		/** Time-to-live in seconds until the rate limit resets. */
		TTL: number;
		/** Maximum number of requests allowed in the rate limit window. */
		limit: number;
		/** Number of requests used in the current rate limit window. */
		used: number;
		/** Human-readable description of the rate limit status. */
		naturalLanguage: string;
	};
}

export class PorkbunClient {
	private apiKey: string;
	private secretApiKey: string;
	private baseUrl: string;

	constructor(options: PorkbunClientOptions) {
		this.apiKey = options.apiKey;
		this.secretApiKey = options.secretApiKey;
		this.baseUrl =
			options.baseUrl?.replace(/\/+$/, "") ??
			"https://api.porkbun.com/api/json/v3";

		// Endpoint namespaces
		this.ping = createPingMethod(this);
		this.getDefaultPricing = createPricingMethod(this);
		this.domains = createDomainsNamespace(this);
		this.dns = createDnsNamespace(this);
		this.ssl = createSslNamespace(this);
	}

	async request<T>(path: string, payload?: object): Promise<T> {
		let response: Response;

		// Domain is common enough in most payloads that we can save some boilerplate by checking it here
		if (payload && typeof payload === "object" && "domain" in payload) {
			const domain = (payload as { domain: string }).domain;
			assertValid(validateDomain(domain), "domain", domain);
		}

		try {
			const body = JSON.stringify({
				apikey: this.apiKey,
				secretapikey: this.secretApiKey,
				...payload,
			});

			response = await fetch(`${this.baseUrl}${path}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body,
			});
		} catch (err) {
			throw new PorkbunNetworkError("Network request failed", err as Error);
		}

		if (!response.ok) {
			throw new PorkbunHTTPError(
				`HTTP ${response.status}`,
				response.status,
				response.statusText,
				await response.text(),
			);
		}

		const json: unknown = await response.json();

		if (!isPorkbunResponse(json)) {
			throw new PorkbunResponseError("Invalid response format");
		}

		if (json.status !== "SUCCESS") {
			throw new PorkbunAPIError(
				json.message ?? "Unknown error",
				json.status,
				json.message,
			);
		}

		return json as T;
	}

	ping: PingMethod;
	getDefaultPricing: PricingMethod;
	domains: DomainsNamespace;
	dns: DnsNamespace;
	ssl: SslNamespace;
}

export type {
	PingMethod,
	PricingMethod,
	DomainsNamespace,
	DnsNamespace,
	SslNamespace,
};
