---
sourceUrl: https://docs.python.org/3/library/urllib.parse.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

**Source code:** [Lib/urllib/parse.py](https://github.com/python/cpython/tree/3.14/Lib/urllib/parse.py)

* * *

This module defines a standard interface to break Uniform Resource Locator (URL) strings up in components (addressing scheme, network location, path etc.), to combine the components back into a URL string, and to convert a "relative URL" to an absolute URL given a "base URL."

The module supports URL schemes including: `file`, `ftp`, `gopher`, `hdl`, `http`, `https`, `imap`, `mailto`, `mms`, `news`, `nntp`, `prospero`, `rsync`, `rtsp`, `sftp`, `sip`, `sips`, `snews`, `svn`, `svn+ssh`, `telnet`, `wais`, `ws`, `wss`.

## URL Parsing

### urllib.parse.urlsplit(urlstring, scheme=None, allow_fragments=True)

Parse a URL into five components, returning a 5-item named tuple `SplitResult`:

```python
>>> from urllib.parse import urlsplit
>>> urlsplit("scheme://netloc/path?query#fragment")
SplitResult(scheme='scheme', netloc='netloc', path='/path',
            query='query', fragment='fragment')
>>> o = urlsplit("http://docs.python.org:80/3/library/urllib.parse.html?highlight=params#url-parsing")
>>> o.scheme
'http'
>>> o.netloc
'docs.python.org:80'
>>> o.hostname
'docs.python.org'
>>> o.port
80
```

| Attribute | Index | Value |
|-----------|-------|-------|
| `scheme` | 0 | URL scheme specifier |
| `netloc` | 1 | Network location part |
| `path` | 2 | Hierarchical path |
| `query` | 3 | Query component |
| `fragment` | 4 | Fragment identifier |
| `username` | - | User name |
| `password` | - | Password |
| `hostname` | - | Host name (lower case) |
| `port` | - | Port number as integer |

### urllib.parse.urlparse(urlstring, scheme=None, allow_fragments=True)

Similar to `urlsplit()`, but additionally splits the path component into path and params. Returns a 6-item named tuple `ParseResult`.

### urllib.parse.parse_qs(qs, keep_blank_values=False, strict_parsing=False, encoding='utf-8', errors='replace', max_num_fields=None, separator='&')

Parse a query string given as a string argument. Data are returned as a dictionary. Keys are unique query variable names and values are lists of values for each name.

```python
>>> from urllib.parse import parse_qs
>>> parse_qs('name=John&age=30&name=Jane')
{'name': ['John', 'Jane'], 'age': ['30']}
```

### urllib.parse.parse_qsl(qs, keep_blank_values=False, strict_parsing=False, encoding='utf-8', errors='replace', max_num_fields=None, separator='&')

Parse a query string. Data are returned as a list of name, value pairs.

### urllib.parse.urlunsplit(parts)

Construct a URL from a tuple as returned by `urlsplit()`.

### urllib.parse.urlunparse(parts)

Combine the elements of a tuple as returned by `urlparse()` into a complete URL.

### urllib.parse.urljoin(base, url, allow_fragments=True)

Construct a full ("absolute") URL by combining a "base URL" with another URL:

```python
>>> from urllib.parse import urljoin
>>> urljoin('http://www.cwi.nl/%7Eguido/Python.html', 'FAQ.html')
'http://www.cwi.nl/%7Eguido/FAQ.html'
```

Warning: It is generally not secure to use `urljoin` with an attacker-controlled `url`.

### urllib.parse.urldefrag(url)

If *url* contains a fragment identifier, return a modified version with no fragment identifier, and the fragment identifier as a separate string.

### urllib.parse.unwrap(url)

Extract the url from a wrapped URL.

## URL Quoting

### urllib.parse.quote(string, safe='/', encoding=None, errors=None)

Replace special characters in *string* using the `%xx` escape. Letters, digits, and `_.-~` are never quoted. By default, `/` is also not quoted.

```python
>>> from urllib.parse import quote
>>> quote('/El Niño/')
'/El%20Ni%C3%B1o/'
>>> quote('/El Niño/', safe='')
'%2FEl%20Ni%C3%B1o%2F'
```

### urllib.parse.quote_plus(string, safe='', encoding=None, errors=None)

Like `quote()`, but also replaces spaces with plus signs, as required for quoting HTML form values.

```python
>>> from urllib.parse import quote_plus
>>> quote_plus('Hello World')
'Hello+World'
```

### urllib.parse.unquote(string, encoding='utf-8', errors='replace')

Replace `%xx` escapes with their single-character equivalent.

```python
>>> from urllib.parse import unquote
>>> unquote('/El%20Ni%C3%B1o/')
'/El Niño/'
```

### urllib.parse.unquote_plus(string, encoding='utf-8', errors='replace')

Like `unquote()`, but also replaces plus signs with spaces.

### urllib.parse.urlencode(query, doseq=False, safe='', encoding=None, errors=None, quote_via=quote_plus)

Convert a mapping object or a sequence of two-element tuples to a percent-encoded ASCII text string.

```python
>>> from urllib.parse import urlencode
>>> urlencode({'name': 'John Doe', 'age': '30'})
'name=John+Doe&age=30'
>>> urlencode([('key', 'value1'), ('key', 'value2')])
'key=value1&key=value2'
```

### urllib.parse.quote_from_bytes(bytes, safe='/')

Like `quote()`, but accepts a `bytes` object rather than a `str`, and does not perform string-to-bytes encoding.

### urllib.parse.unquote_to_bytes(string)

Replace `%xx` escapes with their single-octet equivalent, and return a `bytes` object.

## Structured Parse Results

The result objects from `urlparse()`, `urlsplit()`, and `urldefrag()` are subclasses of the `tuple` type with additional read-only convenience attributes.

### class urllib.parse.SplitResult(scheme, netloc, path, query, fragment)

- **geturl()** - Return the re-combined version of the original URL as a string.

### class urllib.parse.ParseResult(scheme, netloc, path, params, query, fragment)

- **geturl()** - Return the re-combined version of the original URL as a string.

## URL Parsing Security

The `urlsplit()` and `urlparse()` APIs do not perform validation of inputs. They may not raise errors on inputs that other applications consider invalid. We recommend that users of these APIs code defensively and do some verification before trusting returned component parts.
