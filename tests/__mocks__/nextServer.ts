class MockResponse implements Response {
  readonly status: number;
  readonly headers: Headers;
  readonly body: string | null;
  readonly ok: boolean;
  readonly redirected: boolean;
  readonly type: ResponseType;
  readonly url: string;
  readonly statusText: string;
  readonly bodyUsed: boolean;

  constructor(init?: { status?: number; headers?: HeadersInit; body?: string | null }) {
    this.status = init?.status || 200;
    this.headers = new Headers(init?.headers);
    this.body = init?.body || null;
    this.ok = this.status >= 200 && this.status < 300;
    this.redirected = false;
    this.type = 'default';
    this.url = '';
    this.statusText = '';
    this.bodyUsed = false;
  }

  static json(data: unknown, init?: { status?: number; headers?: HeadersInit }) {
    const body = JSON.stringify(data);
    const headers = new Headers(init?.headers);
    headers.set('Content-Type', 'application/json');
    return new MockResponse({
      status: init?.status || 200,
      headers,
      body
    });
  }

  static error(): Response {
    return new MockResponse({ status: 500 });
  }

  static redirect(url: string | URL, status?: number): Response {
    const headers = new Headers();
    headers.set('Location', url.toString());
    return new MockResponse({ status: status || 302, headers });
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    throw new Error('Not implemented');
  }

  async blob(): Promise<Blob> {
    throw new Error('Not implemented');
  }

  async formData(): Promise<FormData> {
    throw new Error('Not implemented');
  }

  async json() {
    return this.body ? JSON.parse(this.body) : null;
  }

  async text() {
    return this.body || '';
  }

  clone(): Response {
    return new MockResponse({
      status: this.status,
      headers: this.headers,
      body: this.body
    });
  }
}

class MockRequest implements Request {
  readonly cache: RequestCache;
  readonly credentials: RequestCredentials;
  readonly destination: RequestDestination;
  readonly headers: Headers;
  readonly integrity: string;
  readonly keepalive: boolean;
  readonly method: string;
  readonly mode: RequestMode;
  readonly redirect: RequestRedirect;
  readonly referrer: string;
  readonly referrerPolicy: ReferrerPolicy;
  readonly signal: AbortSignal;
  readonly url: string;
  readonly bodyUsed: boolean;
  private bodyInit: BodyInit | null;

  constructor(input: RequestInfo | URL, init?: RequestInit) {
    this.bodyInit = init?.body || null;
    this.headers = new Headers(init?.headers);
    this.method = init?.method || 'GET';
    this.url = input.toString();
    this.cache = init?.cache || 'default';
    this.credentials = init?.credentials || 'same-origin';
    this.destination = 'document';
    this.integrity = '';
    this.keepalive = false;
    this.mode = init?.mode || 'cors';
    this.redirect = init?.redirect || 'follow';
    this.referrer = '';
    this.referrerPolicy = init?.referrerPolicy || '';
    this.signal = init?.signal || new AbortController().signal;
    this.bodyUsed = false;
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    throw new Error('Not implemented');
  }

  async blob(): Promise<Blob> {
    throw new Error('Not implemented');
  }

  async formData(): Promise<FormData> {
    throw new Error('Not implemented');
  }

  async json() {
    if (!this.bodyInit) return null;
    return JSON.parse(this.bodyInit.toString());
  }

  async text() {
    return this.bodyInit?.toString() || '';
  }

  clone(): Request {
    return new MockRequest(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.bodyInit,
      mode: this.mode,
      credentials: this.credentials,
      cache: this.cache,
      redirect: this.redirect,
      referrerPolicy: this.referrerPolicy,
      signal: this.signal
    });
  }
}

// Define Request and Response if they don't exist
if (typeof Request === 'undefined') {
  (global as any).Request = MockRequest;
}

if (typeof Response === 'undefined') {
  (global as any).Response = MockResponse;
}

export const NextResponse = MockResponse;
export const NextRequest = MockRequest; 