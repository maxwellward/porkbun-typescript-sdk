import { PorkbunValidationError } from "./errors";
import { DNS_RECORD_TYPE } from "./types/dns";

export type ValidationResult =
	| { valid: true }
	| { valid: false; reason: string };

/**
 * Throws a PorkbunValidationError if the validation result is invalid.
 */
export function assertValid(
	result: ValidationResult,
	field: string,
	value?: unknown,
): void {
	if (!result.valid) {
		throw new PorkbunValidationError(result.reason, field, value);
	}
}

/**
 * Validates a domain name format.
 * @example validateDomain("example.com") // valid
 * @example validateDomain("sub.example.com") // valid
 */
export const validateDomain = (domain: string): ValidationResult => {
	if (!domain || domain.length === 0) {
		return { valid: false, reason: "Domain cannot be empty" };
	}

	// Basic domain pattern (allows subdomains)
	const domainRegex =
		/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
	if (!domainRegex.test(domain)) {
		return { valid: false, reason: "Invalid domain format" };
	}

	return { valid: true };
};

/**
 * Validates a subdomain format.
 * Empty string is valid (represents root domain).
 * @example validateSubdomain("www") // valid
 * @example validateSubdomain("") // valid (root domain)
 * @example validateSubdomain("*") // valid (wildcard)
 */
export const validateSubdomain = (subdomain: string): ValidationResult => {
	// Empty is valid (root domain)
	if (subdomain === "" || subdomain === "*") {
		return { valid: true };
	}

	// Subdomain pattern: alphanumeric, hyphens, can have dots for nested subdomains
	const subdomainRegex =
		/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
	if (!subdomainRegex.test(subdomain)) {
		return { valid: false, reason: "Invalid subdomain format" };
	}

	return { valid: true };
};

/**
 * Validates a TTL value.
 * Must be an integer >= 600 (Porkbun minimum).
 */
export const validateTTL = (ttl: number): ValidationResult => {
	if (!Number.isInteger(ttl)) {
		return { valid: false, reason: "TTL must be an integer" };
	}
	if (ttl < 600) {
		return { valid: false, reason: "TTL must be at least 600 seconds" };
	}
	return { valid: true };
};

/**
 * Validates a priority value for MX/SRV records.
 * Must be an integer between 0-65535.
 */
export const validatePriority = (prio: string): ValidationResult => {
	const num = parseInt(prio, 10);
	if (isNaN(num)) {
		return { valid: false, reason: "Priority must be a numeric string" };
	}
	if (!Number.isInteger(num) || num < 0 || num > 65535) {
		return {
			valid: false,
			reason: "Priority must be an integer between 0 and 65535",
		};
	}
	return { valid: true };
};

/**
 * Validates a record ID.
 * Must be a non-empty string.
 */
export const validateRecordId = (recordId: string): ValidationResult => {
	if (!recordId || recordId.trim().length === 0) {
		return { valid: false, reason: "Record ID cannot be empty" };
	}
	return { valid: true };
};

/**
 * Validates an IPv4 address.
 * @example validateIPv4("192.168.1.1") // valid
 */
export const validateIPv4 = (ip: string): ValidationResult => {
	const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
	const match = ip.match(ipv4Regex);
	if (!match) {
		return { valid: false, reason: "Invalid IPv4 format" };
	}
	const octets = match.slice(1).map(Number);
	if (octets.some((o) => o > 255)) {
		return { valid: false, reason: "IPv4 octets must be between 0 and 255" };
	}
	return { valid: true };
};

/**
 * Validates an IPv6 address.
 * @example validateIPv6("2001:db8::1") // valid
 */
export const validateIPv6 = (ip: string): ValidationResult => {
	// Comprehensive IPv6 regex supporting full, compressed, and mixed formats
	const ipv6Regex =
		/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/;
	if (!ipv6Regex.test(ip)) {
		return { valid: false, reason: "Invalid IPv6 format" };
	}
	return { valid: true };
};

/**
 * Validates an IP address (IPv4 or IPv6).
 */
export const validateIP = (ip: string): ValidationResult => {
	const ipv4Result = validateIPv4(ip);
	if (ipv4Result.valid) return ipv4Result;

	const ipv6Result = validateIPv6(ip);
	if (ipv6Result.valid) return ipv6Result;

	return {
		valid: false,
		reason: "Invalid IP address format (must be valid IPv4 or IPv6)",
	};
};

/**
 * Validates a URL for URL forwarding.
 * Must be a valid http or https URL.
 */
export const validateUrl = (url: string): ValidationResult => {
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
			return { valid: false, reason: "URL must use http or https protocol" };
		}
		return { valid: true };
	} catch {
		return { valid: false, reason: "Invalid URL format" };
	}
};

/**
 * Validates a hostname (for nameservers, MX targets, etc.).
 */
export const validateHostname = (hostname: string): ValidationResult => {
	if (!hostname || hostname.length === 0) {
		return { valid: false, reason: "Hostname cannot be empty" };
	}

	// Allow trailing dot for FQDN
	const normalizedHostname = hostname.endsWith(".")
		? hostname.slice(0, -1)
		: hostname;

	const hostnameRegex =
		/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
	if (!hostnameRegex.test(normalizedHostname)) {
		return { valid: false, reason: "Invalid hostname format" };
	}
	return { valid: true };
};

/**
 * Validates a forward ID.
 */
export const validateForwardId = (forwardId: string): ValidationResult => {
	if (!forwardId || forwardId.trim().length === 0) {
		return { valid: false, reason: "Forward ID cannot be empty" };
	}
	return { valid: true };
};

/**
 * Validates URL forward type.
 */
export const validateForwardType = (type: string): ValidationResult => {
	if (type !== "temporary" && type !== "permanent") {
		return {
			valid: false,
			reason: "Forward type must be 'temporary' or 'permanent'",
		};
	}
	return { valid: true };
};

/**
 * Validates yes/no string values.
 */
export const validateYesNo = (value: string): ValidationResult => {
	if (value !== "yes" && value !== "no") {
		return { valid: false, reason: "Value must be 'yes' or 'no'" };
	}
	return { valid: true };
};

/**
 * Validates DNS record content based on record type.
 */
export const validateDnsContent = (
	type: `${DNS_RECORD_TYPE}`,
	content: string,
): ValidationResult => {
	if (!content || content.length === 0) {
		return { valid: false, reason: "Content cannot be empty" };
	}

	switch (type) {
		case DNS_RECORD_TYPE.A:
			return validateIPv4(content);
		case DNS_RECORD_TYPE.AAAA:
			return validateIPv6(content);
		case DNS_RECORD_TYPE.MX:
		case DNS_RECORD_TYPE.CNAME:
		case DNS_RECORD_TYPE.NS:
		case DNS_RECORD_TYPE.ALIAS:
			return validateHostname(content);
		case DNS_RECORD_TYPE.TXT:
			// TXT records can contain almost anything
			return { valid: true };
		case DNS_RECORD_TYPE.SRV:
			// SRV format: priority weight port target (we validate loosely)
			if (!/^\d+\s+\d+\s+\d+\s+\S+$/.test(content)) {
				return {
					valid: false,
					reason: "SRV record must be in format: priority weight port target",
				};
			}
			return { valid: true };
		case DNS_RECORD_TYPE.CAA:
			// CAA format: flag tag value
			if (
				!/^\d+\s+\S+\s+".+"$/.test(content) &&
				!/^\d+\s+\S+\s+\S+$/.test(content)
			) {
				return {
					valid: false,
					reason: "CAA record must be in format: flag tag value",
				};
			}
			return { valid: true };
		default:
			// For other types (TLSA, HTTPS, SVCB, SSHFP), accept any non-empty content
			return { valid: true };
	}
};

/**
 * Validates an array of nameservers.
 */
export const validateNameservers = (ns: string[]): ValidationResult => {
	if (!Array.isArray(ns) || ns.length === 0) {
		return { valid: false, reason: "Nameservers array cannot be empty" };
	}

	for (let i = 0; i < ns.length; i++) {
		const result = validateHostname(ns[i]);
		if (!result.valid) {
			return {
				valid: false,
				reason: `Nameserver at index ${i}: ${result.reason}`,
			};
		}
	}

	return { valid: true };
};

/**
 * Validates an array of IP addresses (for glue records).
 */
export const validateIPs = (ips: string[]): ValidationResult => {
	if (!Array.isArray(ips) || ips.length === 0) {
		return { valid: false, reason: "IPs array cannot be empty" };
	}

	for (let i = 0; i < ips.length; i++) {
		const result = validateIP(ips[i]);
		if (!result.valid) {
			return { valid: false, reason: `IP at index ${i}: ${result.reason}` };
		}
	}

	return { valid: true };
};
