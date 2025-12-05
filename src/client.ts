import { createDomainsNamespace } from "./endpoints/domains";
import { createPingMethod } from "./endpoints/ping";

export interface PorkbunClientOptions {
	apiKey: string;
	secretApiKey: string;
	baseUrl?: string;
}

export interface PorkbunBaseResponse {
	status: string,
	message?: string,
	limits?: {
		TTL: number,
		limit: number,
		used: number,
		naturalLanguage: string
	}
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
}