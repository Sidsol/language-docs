---
sourceUrl: https://docs.python.org/3/library/http.client.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

**Source code:** [Lib/http/client.py](https://github.com/python/cpython/tree/3.14/Lib/http/client.py)

* * *

This module defines classes that implement the client side of the HTTP and HTTPS protocols. It is normally not used directly — the module `urllib.request` uses it to handle URLs that use HTTP and HTTPS.

See also: The [Requests package](https://requests.readthedocs.io/en/latest/) is recommended for a higher-level HTTP client interface.

Note: HTTPS support is only available if Python was compiled with SSL support (through the `ssl` module).

## HTTPConnection Objects

### class http.client.HTTPConnection(host, port=None, [timeout, ] source_address=None, blocksize=8192)

An `HTTPConnection` instance represents one transaction with an HTTP server.

```python
>>> h1 = http.client.HTTPConnection('www.python.org')
>>> h2 = http.client.HTTPConnection('www.python.org:80')
>>> h3 = http.client.HTTPConnection('www.python.org', 80)
>>> h4 = http.client.HTTPConnection('www.python.org', 80, timeout=10)
```

### class http.client.HTTPSConnection(host, port=None, *, [timeout, ] source_address=None, context=None, blocksize=8192)

A subclass of `HTTPConnection` that uses SSL for communication with secure servers. Default port is `443`. If *context* is specified, it must be a `ssl.SSLContext` instance.

### HTTPConnection Methods

- **request(method, url, body=None, headers={}, *, encode_chunked=False)** - Send a request to the server using the HTTP request method *method* and the request URI *url*.

```python
>>> import http.client
>>> host = "docs.python.org"
>>> conn = http.client.HTTPSConnection(host)
>>> conn.request("GET", "/3/", headers={"Host": host})
>>> response = conn.getresponse()
>>> print(response.status, response.reason)
200 OK
```

- **getresponse()** - Should be called after a request is sent to get the response from the server. Returns an `HTTPResponse` instance.
- **set_debuglevel(level)** - Set the debugging level (default: `0`).
- **set_tunnel(host, port=None, headers=None)** - Set the host and port for HTTP Connect Tunnelling.
- **connect()** - Connect to the server specified when the object was created.
- **close()** - Close the connection to the server.
- **blocksize** - Buffer size in bytes for sending a file-like message body.

### Low-Level Methods

- **putrequest(method, url, skip_host=False, skip_accept_encoding=False)** - Send a request line to the server.
- **putheader(header, argument[, ...])** - Send an RFC 822-style header to the server.
- **endheaders(message_body=None, *, encode_chunked=False)** - Send a blank line to the server, signalling the end of the headers.
- **send(data)** - Send data to the server.

## HTTPResponse Objects

### class http.client.HTTPResponse(sock, debuglevel=0, method=None, url=None)

Class whose instances are returned upon successful connection.

**Methods:**

- **read([amt])** - Reads and returns the response body, or up to the next *amt* bytes.
- **readinto(b)** - Reads up to the next `len(b)` bytes of the response body into the buffer *b*.
- **getheader(name, default=None)** - Return the value of the header *name*, or *default* if there is no header matching *name*.
- **getheaders()** - Return a list of `(header, value)` tuples.
- **fileno()** - Return the `fileno` of the underlying socket.
- **close()** - Closes the response.

**Attributes:**

- **msg** - An `http.client.HTTPMessage` instance containing the response headers.
- **version** - HTTP protocol version used by server (10 for HTTP/1.0, 11 for HTTP/1.1).
- **url** - URL of the resource retrieved.
- **headers** - Headers of the response in the form of an `email.message.EmailMessage` instance.
- **status** - Status code returned by server.
- **reason** - Reason phrase returned by server.
- **debuglevel** - A debugging hook.
- **closed** - Is `True` if the stream has been closed.
- **length** - Number of bytes left to read.

## Constants

- **http.client.HTTP_PORT** - The default port for HTTP protocol (always `80`).
- **http.client.HTTPS_PORT** - The default port for HTTPS protocol (always `443`).
- **http.client.responses** - Dictionary mapping HTTP 1.1 status codes to W3C names.

## Exceptions

- **http.client.HTTPException** - Base class for all other exceptions in this module.
- **http.client.NotConnected** - Subclass of `HTTPException`.
- **http.client.InvalidURL** - Raised if a port is given and is either non-numeric or empty.
- **http.client.UnknownProtocol** - Subclass of `HTTPException`.
- **http.client.UnknownTransferEncoding** - Subclass of `HTTPException`.
- **http.client.UnimplementedFileMode** - Subclass of `HTTPException`.
- **http.client.IncompleteRead** - Subclass of `HTTPException`.
- **http.client.ImproperConnectionState** - Subclass of `HTTPException`.
- **http.client.CannotSendRequest** - Subclass of `ImproperConnectionState`.
- **http.client.CannotSendHeader** - Subclass of `ImproperConnectionState`.
- **http.client.ResponseNotReady** - Subclass of `ImproperConnectionState`.
- **http.client.BadStatusLine** - Raised if a server responds with an HTTP status code we don't understand.
- **http.client.LineTooLong** - Raised if an excessively long line is received.
- **http.client.RemoteDisconnected** - Subclass of `ConnectionResetError` and `BadStatusLine`. Raised when the remote end has closed the connection.

## Examples

### GET Request

```python
import http.client

conn = http.client.HTTPSConnection("www.python.org")
conn.request("GET", "/")
r1 = conn.getresponse()
print(r1.status, r1.reason)  # 200 OK
data1 = r1.read()
conn.close()
```

### HEAD Request

```python
import http.client

conn = http.client.HTTPSConnection("www.python.org")
conn.request("HEAD", "/")
res = conn.getresponse()
print(res.status, res.reason)  # 200 OK
data = res.read()
print(len(data))  # 0
conn.close()
```

### POST Request

```python
import http.client
import urllib.parse

params = urllib.parse.urlencode({'@number': 12524, '@type': 'issue', '@action': 'show'})
headers = {"Content-type": "application/x-www-form-urlencoded",
           "Accept": "text/plain"}
conn = http.client.HTTPSConnection("bugs.python.org")
conn.request("POST", "", params, headers)
response = conn.getresponse()
print(response.status, response.reason)
data = response.read()
conn.close()
```

### PUT Request with Chunked Encoding

```python
import http.client

BODY = "***filecontents***"
conn = http.client.HTTPSConnection("localhost", 8080)
conn.request("PUT", "/file", BODY)
response = conn.getresponse()
print(response.status, response.reason)
data = response.read()
conn.close()
```
