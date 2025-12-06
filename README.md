# Porkbun TypeScript SDK  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Overview

This SDK acts as a wrapper around the Porkbun API by way of a `PorkbunClient` class providing methods for every API endpoint, along with additional helper functions.

This project is not affiliated with or endorsed by Porkbun. Please ask questions or report issues on our [issue tracker](https://github.com/maxwellward/porkbun-typescript-sdk/issues), *not* through any official Porkbun channels.

## Installation

```
npm install [PACKAGE NAME HERE]
```

## Quick Start

1. Ensure your domain is accessible via the API under `Domain Management -> Details -> API Access`
2. Create a API key and secret key at https://porkbun.com/account/api
3. In your project, initialize the `PorkbunClient` class like so:
> [!WARNING]
> Do not keep your keys in your source code! Use environment variables or some other method of protecting your keys.
```ts
import { PorkbunClient } from 'porkbun-typescript-sdk';

const pbClient = new PorkbunClient({
	secretApiKey: 'sk1_12a3b456...',
	apiKey: 'pk1_1234ab56...'
})
```
4. Start interacting with the API!
```ts
const getAllDomains = async () => {
	const response = await pbClient.domains.listAll();
	console.log(response);
}

/*
{
  status: "SUCCESS",
  domains: [
    {
      domain: "example.com",
      status: "ACTIVE",
      tld: "com",
      createDate: "2025-07-03 02:06:57",
      expireDate: "2026-07-03 02:06:57",
      securityLock: "1",
      whoisPrivacy: "1",
      autoRenew: "1",
      notLocal: 0,
    }, {
      domain: "example.net",
      status: "ACTIVE",
      tld: "net",
      createDate: "2023-07-30 20:25:46",
      expireDate: "2026-07-30 20:25:46",
      securityLock: "1",
      whoisPrivacy: "1",
      autoRenew: "1",
      notLocal: 0,
    }
  ],
}
*/
```

If you need to change the base URL (defaults to `https://api.porkbun.com/api/json/v3`), you can pass the `baseUrl` parameter into the `PorkbunClient` constructor alongside your API key.

## Namespaces

The SDK is broken up into 3 namespaces: `domains`, `dns`, and `ssl`, along with standalone `ping()` and `getDefaultPricing()` methods.

Parameters, return types, and examples are documented within the SDK using JSDoc. Hover over any method in your IDE to reveal it.

<details>
<summary>Domains Methods</summary>

- `listAll()` - Retrieves all domains in the account.
- `checkDomain()` - Checks the availability of a domain.
- `getNameservers()` - Gets the authoritative name servers listed at the registry for a domain.
- `updateNameservers()` - Updates the authoritative name servers listed at the registry for a domain.
- `getUrlForwarding()` - Gets a list of URL forwards for a domain.
- `addUrlForward()` - Adds a URL forward to a domain.
- `deleteUrlForward()` - Deletes a URL forward from a domain.
- `getGlueRecords()` - Gets a list of hosts and their glue records for a domain.
- `createGlue()` - Creates a glue record for a domain.
- `updateGlue()` - Updates a glue record for a domain.
- `deleteGlue()` - Deletes a glue record for a domain.

</details>

<details>
<summary>DNS Methods</summary>

- `getDnsRecords()` - Retrieves all DNS records associated with a domain.
- `getDnsRecord()` - Retrieves a DNS record by its ID.
- `getRootDnsRecords()` - Retrieves all DNS records of a given type at the root domain.
- `getSubdomainDnsRecords()` - Retrieves all DNS records of a given type at a specific subdomain.
- `createDnsRecord()` - Creates a DNS record on the specified domain.
- `editDnsRecordById()` - Edits a DNS record on the specified domain.
- `editDnsRecordsBySubdomain()` - Edits all DNS records for a domain that match a particular subdomain and type.
- `deleteDnsRecordById()` - Deletes a specific DNS record on a domain.
- `deleteDnsRecordsBySubdomain()` - Deletes all DNS records for a domain that match a particular subdomain and type.
- `createDnssecRecord()` - Creates a DNSSEC record at the registry.
- `deleteDnssecRecord()` - Deletes a DNSSEC record associated with the domain at the registry.
- `getDnssecRecords()` - Gets all DNSSEC records at the registry for a specific domain.

</details>

<details>
<summary>SSL Methods</summary>

- `getSslBundle()` - Retrieves the SSL certificate bundle for a domain.

</details>

## Types

Types are exported for your use and convenience. These include all the `payload` and `response` types corresponding to each endpoint, such as `RetrieveDnsRecordsPayload` and `RetrieveDnsRecordsResponse`.

Additionally, you have access to these entity types:

<details>
<summary>Domains Types</summary>

- `Domain` - A domain in your account with status, dates, and settings.
- `DomainLabel` - A label that can be attached to domains for organization.
- `GlueRecord` - A glue record mapping a hostname to IP addresses.
- `GlueRecordAddresses` - IPv4 and IPv6 addresses for a glue record.

</details>

<details>
<summary>DNS Types</summary>

- `DnsRecord` - A DNS record with id, name, type, content, TTL, priority, and notes.
- `DnssecRecord` - A DNSSEC record with keyTag, algorithm, digestType, and digest.
- `DNS_RECORD_TYPE` - Enum of supported DNS record types (A, MX, CNAME, ALIAS, TXT, NS, AAAA, SRV, TLSA, CAA, HTTPS, SVCB, SSHFP).

</details>

## Contributing

Any kind of good-faith contribution is welcome, no matter how small. For larger contributions that modify the external API the SDK provides - such as adding new helper functions, - consider discussing your idea with us ahead of time in an issue so you don't end up working on something for nothing.

This project uses [Bun](https://bun.com/), a fast JavaScript runtime that acts as a drop-in replacement for Node.js. Please see the [Bun website](https://bun.com) for simple installation instructions. 

### Clone the repository

```bash
git clone https://github.com/maxwellward/porkbun-typescript-sdk.git
```

### Install dependencies

```bash
bun install
```

### Build package
To run:

```bash
bun run build
```

### Link to a test project
You can use `bun link` to link the in-development package to another project temporarially to test your changes.

First, run `bun link` in the root of this project. Then, in the root of your test project, run `bun link porkbun-typescript-sdk` to install it. Once done, you can simply rebuild the package and the link will automatically update.

## License

This project is licensed under the [MIT License](LICENSE).