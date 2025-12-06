export class PorkbunError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PorkbunError";
    }
}

// API returned an error response (status !== "SUCCESS")
export class PorkbunAPIError extends PorkbunError {
    constructor(
        message: string,
        public readonly status: string,
        public readonly apiMessage?: string
    ) {
        super(message);
        this.name = "PorkbunAPIError";
    }
}

// Network/fetch failures
export class PorkbunNetworkError extends PorkbunError {
    constructor(
        message: string,
        public readonly cause?: Error 
    ) {
        super(message);
        this.name = "PorkbunNetworkError";
    }
}

// HTTP errors (4xx, 5xx)
export class PorkbunHTTPError extends PorkbunError {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly statusText: string,
        public readonly body?: string
    ) {
        super(message);
        this.name = "PorkbunHTTPError";
    }
}

// Invalid response format
export class PorkbunResponseError extends PorkbunError {
    constructor(message: string) {
        super(message);
        this.name = "PorkbunResponseError";
    }
}