---
sourceUrl: https://docs.python.org/3/library/urllib.request.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

**Source code:** [Lib/urllib/request.py](https://github.com/python/cpython/tree/3.14/Lib/urllib/request.py)

* * *

The `urllib.request` module defines functions and classes which help in opening URLs (mostly HTTP) in a complex world — basic and digest authentication, redirections, cookies and more.

See also: The [Requests package](https://requests.readthedocs.io/en/master/) is recommended for a higher-level HTTP client interface.

## Key Functions

### urllib.request.urlopen(url, data=None, [timeout, ] *, context=None)

Open *url*, which can be either a string containing a valid URL, or a `Request` object.

- *data* must be an object specifying additional data to be sent to the server, or `None`.
- *timeout* specifies a timeout in seconds for blocking operations.
- *context* must be a `ssl.SSLContext` instance for SSL options.

This function always returns an object which can work as a context manager and has the properties *url*, *headers*, and *status*.

For HTTP and HTTPS URLs, this function returns an `http.client.HTTPResponse` object.

```python
import urllib.request

with urllib.request.urlopen('http://www.python.org/') as f:
    print(f.read(300))
```

### urllib.request.install_opener(opener)

Install an `OpenerDirector` instance as the default global opener.

### urllib.request.build_opener([handler, ...])

Return an `OpenerDirector` instance, which chains the handlers in the order given.

### urllib.request.pathname2url(path, *, add_scheme=False)

Convert the given local path to a `file:` URL.

### urllib.request.url2pathname(url, *, require_scheme=False, resolve_host=False)

Convert the given `file:` URL to a local path.

### urllib.request.getproxies()

Returns a dictionary of scheme to proxy server URL mappings.

## Request Objects

### class urllib.request.Request(url, data=None, headers={}, origin_req_host=None, unverifiable=False, method=None)

An abstraction of a URL request.

- *url* - A string containing a valid, properly encoded URL.
- *data* - Additional data to send to the server (bytes, file-like objects, or iterables of bytes). For HTTP POST, should be in *application/x-www-form-urlencoded* format.
- *headers* - Dictionary of HTTP headers.
- *method* - HTTP request method (default: `'GET'` if data is `None`, otherwise `'POST'`).

**Methods:**

- **full_url** - The original URL passed to the constructor.
- **type** - The URI scheme.
- **host** - The URI authority (typically a host, but may also contain a port).
- **origin_req_host** - The request-host of the origin transaction.
- **selector** - The URI path, or a combination of the path and query.
- **data** - The entity body for the request, or `None`.
- **unverifiable** - Whether the request is unverifiable.
- **method** - The HTTP request method to use.
- **get_method()** - Return a string indicating the HTTP request method.
- **add_header(key, val)** - Add another header to the request.
- **add_unredirected_header(key, val)** - Add a header that will not be added to a redirected request.
- **has_header(header)** - Return whether the instance has the named header.
- **remove_header(header)** - Remove named header from the request instance.
- **get_full_url()** - Return the URL given in the constructor.
- **set_proxy(host, type)** - Prepare the request by connecting to a proxy server.
- **get_header(header_name, default=None)** - Return the value of the given header.
- **header_items()** - Return a list of tuples `(header_name, header_value)` of the Request headers.

## OpenerDirector Objects

### class urllib.request.OpenerDirector

Opens URLs via `BaseHandler`s chained together.

- **add_handler(handler)** - Add handler to the chain of handlers.
- **open(url, data=None[, timeout])** - Open the given *url*.
- **error(proto, *args)** - Handle an error of the given protocol.

## Handler Classes

- **urllib.request.BaseHandler** - Base class for all registered handlers.
- **urllib.request.HTTPDefaultErrorHandler** - Defines a default handler for HTTP error responses.
- **urllib.request.HTTPRedirectHandler** - Handles redirections.
- **urllib.request.HTTPCookieProcessor(cookiejar=None)** - Handles HTTP Cookies.
- **urllib.request.ProxyHandler(proxies=None)** - Causes requests to go through a proxy.
- **urllib.request.HTTPPasswordMgr** - Keeps a database of `(realm, uri) -> (user, password)` mappings.
- **urllib.request.HTTPPasswordMgrWithDefaultRealm** - Like `HTTPPasswordMgr` with a catch-all realm.
- **urllib.request.HTTPPasswordMgrWithPriorAuth** - Variant that sends auth credentials immediately.
- **urllib.request.AbstractBasicAuthHandler(password_mgr=None)** - Mixin class for HTTP authentication.
- **urllib.request.HTTPBasicAuthHandler(password_mgr=None)** - Handles authentication with the remote host.
- **urllib.request.ProxyBasicAuthHandler(password_mgr=None)** - Handles authentication with the proxy.
- **urllib.request.AbstractDigestAuthHandler(password_mgr=None)** - Mixin class for HTTP digest authentication.
- **urllib.request.HTTPDigestAuthHandler(password_mgr=None)** - Handles digest authentication with the remote host.
- **urllib.request.ProxyDigestAuthHandler(password_mgr=None)** - Handles digest authentication with the proxy.
- **urllib.request.HTTPHandler** - Handles opening of HTTP URLs.
- **urllib.request.HTTPSHandler(debuglevel=0, context=None)** - Handles opening of HTTPS URLs.
- **urllib.request.FileHandler** - Open local files.
- **urllib.request.DataHandler** - Open data URLs.
- **urllib.request.FTPHandler** - Open FTP URLs.
- **urllib.request.CacheFTPHandler** - Open FTP URLs, keeping a cache of open FTP connections.
- **urllib.request.UnknownHandler** - Catch-all class to handle unknown URLs.
- **urllib.request.HTTPErrorProcessor** - Process HTTP error responses.

## Examples

### GET Request

```python
import urllib.request

with urllib.request.urlopen('http://www.python.org/') as f:
    print(f.read(300))
```

### POST Request

```python
import urllib.parse
import urllib.request

url = 'http://www.someserver.com/cgi-bin/register.cgi'
values = {'name': 'Michael Foord', 'location': 'Northampton', 'language': 'Python'}
data = urllib.parse.urlencode(values)
data = data.encode('ascii')
req = urllib.request.Request(url, data)
with urllib.request.urlopen(req) as response:
    the_page = response.read()
```

### Adding Headers

```python
import urllib.parse
import urllib.request

url = 'http://www.example.com/cgi-bin/query'
values = {'q': 'python'}
data = urllib.parse.urlencode(values)
data = data.encode('ascii')
req = urllib.request.Request(url, data)
req.add_header('User-Agent', 'Mozilla/5.0')
with urllib.request.urlopen(req) as response:
    the_page = response.read()
```

### Using a Proxy

```python
import urllib.request

proxy_handler = urllib.request.ProxyHandler({'http': 'http://www.example.com:3128/'})
opener = urllib.request.build_opener(proxy_handler)
opener.open('http://www.example.com/foo.html')
```

### Basic Authentication

```python
import urllib.request

auth_handler = urllib.request.HTTPBasicAuthHandler()
auth_handler.add_password(realm='PDQ Application',
                          uri='https://mahler:8092/site-updates.py',
                          user='klem', passwd='kadidd!ehopper')
opener = urllib.request.build_opener(auth_handler)
urllib.request.install_opener(opener)
urllib.request.urlopen('http://www.example.com/login.html')
```
