---
sourceUrl: https://docs.python.org/3/howto/urllib2.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: howto
---

Author: Michael Foord

## Introduction

**urllib.request** is a Python module for fetching URLs (Uniform Resource Locators). It offers a very simple interface, in the form of the `urlopen` function. This is capable of fetching URLs using a variety of different protocols. It also offers a slightly more complex interface for handling common situations - like basic authentication, cookies, proxies and so on. These are provided by objects called handlers and openers.

This tutorial focuses on the most common case, HTTP.

## Fetching URLs

The simplest way to use urllib.request is as follows:

```python
import urllib.request
with urllib.request.urlopen('http://python.org/') as response:
   html = response.read()
```

If you wish to retrieve a resource via URL and store it in a temporary location:

```python
import shutil
import tempfile
import urllib.request

with urllib.request.urlopen('http://python.org/') as response:
    with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
        shutil.copyfileobj(response, tmp_file)
```

HTTP is based on requests and responses. urllib.request mirrors this with a `Request` object:

```python
import urllib.request

req = urllib.request.Request('http://python.org/')
with urllib.request.urlopen(req) as response:
   the_page = response.read()
```

### Data

Sometimes you want to send data to a URL. With HTTP, this is often done using a **POST** request:

```python
import urllib.parse
import urllib.request

url = 'http://www.someserver.com/cgi-bin/register.cgi'
values = {'name' : 'Michael Foord',
          'location' : 'Northampton',
          'language' : 'Python' }

data = urllib.parse.urlencode(values)
data = data.encode('ascii')
req = urllib.request.Request(url, data)
with urllib.request.urlopen(req) as response:
   the_page = response.read()
```

Data can also be passed in an HTTP GET request by encoding it in the URL itself:

```python
>>> import urllib.request
>>> import urllib.parse
>>> data = {}
>>> data['name'] = 'Somebody Here'
>>> data['location'] = 'Northampton'
>>> data['language'] = 'Python'
>>> url_values = urllib.parse.urlencode(data)
>>> url = 'http://www.example.com/example.cgi'
>>> full_url = url + '?' + url_values
>>> data = urllib.request.urlopen(full_url)
```

## Handling Exceptions

`urlopen` raises `URLError` when it cannot handle a response. `HTTPError` is a subclass of `URLError` raised for HTTP URLs.

### URLError

Often raised because there is no network connection or the specified server doesn't exist:

```python
>>> req = urllib.request.Request('http://www.pretend_server.org')
>>> try: urllib.request.urlopen(req)
... except urllib.error.URLError as e:
...     print(e.reason)
```

### HTTPError

Every HTTP response from the server contains a numeric "status code". Typical errors include '404' (page not found), '403' (request forbidden), and '401' (authentication required).

### Wrapping it Up

Two basic approaches for handling errors:

```python
# Approach 1
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
req = Request(someurl)
try:
    response = urlopen(req)
except HTTPError as e:
    print('The server couldn\'t fulfill the request.')
    print('Error code: ', e.code)
except URLError as e:
    print('We failed to reach a server.')
    print('Reason: ', e.reason)
else:
    # everything is fine
    pass
```

```python
# Approach 2
from urllib.request import Request, urlopen
from urllib.error import URLError
req = Request(someurl)
try:
    response = urlopen(req)
except URLError as e:
    if hasattr(e, 'reason'):
        print('We failed to reach a server.')
        print('Reason: ', e.reason)
    elif hasattr(e, 'code'):
        print('The server couldn\'t fulfill the request.')
        print('Error code: ', e.code)
else:
    # everything is fine
    pass
```

## info and geturl

The response returned by urlopen has two useful methods:
- **geturl** - returns the real URL of the page fetched (useful after redirects)
- **info** - returns a dictionary-like object describing the page fetched (HTTP headers)

## Openers and Handlers

When you fetch a URL you use an opener (an instance of `urllib.request.OpenerDirector`). Normally we use the default opener via `urlopen`, but you can create custom openers.

Use `build_opener` as a convenience function for creating opener objects, and `install_opener` to make an opener the global default.

## Basic Authentication

```python
# create a password manager
password_mgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()

# Add the username and password.
top_level_url = "http://example.com/foo/"
password_mgr.add_password(None, top_level_url, username, password)

handler = urllib.request.HTTPBasicAuthHandler(password_mgr)

# create "opener" (OpenerDirector instance)
opener = urllib.request.build_opener(handler)

# use the opener to fetch a URL
opener.open(a_url)

# Install the opener globally
urllib.request.install_opener(opener)
```

## Proxies

urllib will auto-detect your proxy settings and use those through the `ProxyHandler`. To disable proxy detection:

```python
>>> proxy_support = urllib.request.ProxyHandler({})
>>> opener = urllib.request.build_opener(proxy_support)
>>> urllib.request.install_opener(opener)
```

## Sockets and Layers

The Python support for fetching resources from the web is layered. urllib uses the `http.client` library, which in turn uses the `socket` library.

You can set the socket timeout globally:

```python
import socket
import urllib.request

# timeout in seconds
timeout = 10
socket.setdefaulttimeout(timeout)

# this call to urllib.request.urlopen now uses the default timeout
req = urllib.request.Request('http://www.voidspace.org.uk')
response = urllib.request.urlopen(req)
```

## Headers

Some websites dislike being browsed by programs. By default urllib identifies itself as `Python-urllib/x.y`. You can set the `User-Agent` header:

```python
import urllib.parse
import urllib.request

url = 'http://www.someserver.com/cgi-bin/register.cgi'
user_agent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)'
values = {'name': 'Michael Foord', 'location': 'Northampton', 'language': 'Python'}
headers = {'User-Agent': user_agent}

data = urllib.parse.urlencode(values)
data = data.encode('ascii')
req = urllib.request.Request(url, data, headers)
with urllib.request.urlopen(req) as response:
   the_page = response.read()
```
