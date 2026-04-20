---
sourceUrl: https://docs.python.org/3/library/http.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

**Source code:** [Lib/http/__init__.py](https://github.com/python/cpython/tree/3.14/Lib/http/__init__.py)

* * *

`http` is a package that collects several modules for working with the HyperText Transfer Protocol:

- `http.client` is a low-level HTTP protocol client; for high-level URL opening use `urllib.request`
- `http.server` contains basic HTTP server classes based on `socketserver`
- `http.cookies` has utilities for implementing state management with cookies
- `http.cookiejar` provides persistence of cookies

## class http.HTTPStatus

A subclass of `enum.IntEnum` that defines a set of HTTP status codes, reason phrases and long descriptions.

```python
>>> from http import HTTPStatus
>>> HTTPStatus.OK
HTTPStatus.OK
>>> HTTPStatus.OK == 200
True
>>> HTTPStatus.OK.value
200
>>> HTTPStatus.OK.phrase
'OK'
>>> HTTPStatus.OK.description
'Request fulfilled, document follows'
```

## HTTP Status Codes

| Code | Enum Name | Category |
|------|-----------|----------|
| 100 | CONTINUE | Informational |
| 101 | SWITCHING_PROTOCOLS | Informational |
| 102 | PROCESSING | Informational |
| 103 | EARLY_HINTS | Informational |
| 200 | OK | Success |
| 201 | CREATED | Success |
| 202 | ACCEPTED | Success |
| 203 | NON_AUTHORITATIVE_INFORMATION | Success |
| 204 | NO_CONTENT | Success |
| 205 | RESET_CONTENT | Success |
| 206 | PARTIAL_CONTENT | Success |
| 207 | MULTI_STATUS | Success |
| 208 | ALREADY_REPORTED | Success |
| 226 | IM_USED | Success |
| 300 | MULTIPLE_CHOICES | Redirection |
| 301 | MOVED_PERMANENTLY | Redirection |
| 302 | FOUND | Redirection |
| 303 | SEE_OTHER | Redirection |
| 304 | NOT_MODIFIED | Redirection |
| 305 | USE_PROXY | Redirection |
| 307 | TEMPORARY_REDIRECT | Redirection |
| 308 | PERMANENT_REDIRECT | Redirection |
| 400 | BAD_REQUEST | Client Error |
| 401 | UNAUTHORIZED | Client Error |
| 402 | PAYMENT_REQUIRED | Client Error |
| 403 | FORBIDDEN | Client Error |
| 404 | NOT_FOUND | Client Error |
| 405 | METHOD_NOT_ALLOWED | Client Error |
| 406 | NOT_ACCEPTABLE | Client Error |
| 407 | PROXY_AUTHENTICATION_REQUIRED | Client Error |
| 408 | REQUEST_TIMEOUT | Client Error |
| 409 | CONFLICT | Client Error |
| 410 | GONE | Client Error |
| 411 | LENGTH_REQUIRED | Client Error |
| 412 | PRECONDITION_FAILED | Client Error |
| 413 | CONTENT_TOO_LARGE | Client Error |
| 414 | URI_TOO_LONG | Client Error |
| 415 | UNSUPPORTED_MEDIA_TYPE | Client Error |
| 416 | RANGE_NOT_SATISFIABLE | Client Error |
| 417 | EXPECTATION_FAILED | Client Error |
| 418 | IM_A_TEAPOT | Client Error |
| 421 | MISDIRECTED_REQUEST | Client Error |
| 422 | UNPROCESSABLE_CONTENT | Client Error |
| 423 | LOCKED | Client Error |
| 424 | FAILED_DEPENDENCY | Client Error |
| 425 | TOO_EARLY | Client Error |
| 426 | UPGRADE_REQUIRED | Client Error |
| 428 | PRECONDITION_REQUIRED | Client Error |
| 429 | TOO_MANY_REQUESTS | Client Error |
| 431 | REQUEST_HEADER_FIELDS_TOO_LARGE | Client Error |
| 451 | UNAVAILABLE_FOR_LEGAL_REASONS | Client Error |
| 500 | INTERNAL_SERVER_ERROR | Server Error |
| 501 | NOT_IMPLEMENTED | Server Error |
| 502 | BAD_GATEWAY | Server Error |
| 503 | SERVICE_UNAVAILABLE | Server Error |
| 504 | GATEWAY_TIMEOUT | Server Error |
| 505 | HTTP_VERSION_NOT_SUPPORTED | Server Error |
| 506 | VARIANT_ALSO_NEGOTIATES | Server Error |
| 507 | INSUFFICIENT_STORAGE | Server Error |
| 508 | LOOP_DETECTED | Server Error |
| 510 | NOT_EXTENDED | Server Error |
| 511 | NETWORK_AUTHENTICATION_REQUIRED | Server Error |

## HTTP Status Category Properties (Added 3.12)

| Property | Indicates |
|----------|-----------|
| `is_informational` | `100 <= status <= 199` |
| `is_success` | `200 <= status <= 299` |
| `is_redirection` | `300 <= status <= 399` |
| `is_client_error` | `400 <= status <= 499` |
| `is_server_error` | `500 <= status <= 599` |

```python
>>> from http import HTTPStatus
>>> HTTPStatus.OK.is_success
True
>>> HTTPStatus.OK.is_client_error
False
```

## class http.HTTPMethod (Added 3.11)

A subclass of `enum.StrEnum` that defines a set of HTTP methods.

```python
>>> from http import HTTPMethod
>>> HTTPMethod.GET
<HTTPMethod.GET>
>>> HTTPMethod.GET == 'GET'
True
>>> HTTPMethod.GET.value
'GET'
>>> HTTPMethod.GET.description
'Retrieve the target.'
```

### HTTP Methods

| Method | Description |
|--------|-------------|
| GET | Retrieve the target |
| HEAD | Same as GET but only transfer status line and headers |
| POST | Perform resource-specific processing on the request payload |
| PUT | Replace all current representations of the target |
| DELETE | Remove all current representations of the target |
| CONNECT | Establish a tunnel to the server |
| OPTIONS | Describe the communication options for the target |
| TRACE | Perform a message loop-back test |
| PATCH | Modify an existing resource |
