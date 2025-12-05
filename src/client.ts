import { createDnsNamespace } from "./endpoints/dns";
import { createDomainsNamespace } from "./endpoints/domains";
import { createPingMethod } from "./endpoints/ping";

export interface PorkbunClientOptions {
	apiKey: string;
	secretApiKey: string;
	baseUrl?: string;
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
		this.baseUrl = options.baseUrl ?? 'https://api.porkbun.com/api/json/v3'

		// Endpoint namespaces
		this.ping = createPingMethod(this);
		this.domains = createDomainsNamespace(this);
		this.dns = createDnsNamespace(this);
	}

	async request<T>(path: string, payload?: object): Promise<T> {
		const body = JSON.stringify({
			apikey: this.apiKey,
			secretapikey: this.secretApiKey,
			...payload
		})

		const response = await fetch(`${this.baseUrl}${path}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body
		})

		if (!response.ok) {
			throw new Error(`Porkbun API error: HTTP ${response.status} ${response.statusText} ${(await response.text())}`)
		}

		const json: unknown = await response.json();
		const data = json as T;

		if ((data as any).status !== "SUCCESS") {
			const msg = (data as any).message ?? "Unknown error";
			throw new Error(`Porkbun API error: ${msg}`);
		}

		return data;
	}

	ping: ReturnType<typeof createPingMethod>
	domains: ReturnType<typeof createDomainsNamespace>
	dns: ReturnType<typeof createDnsNamespace>
}