---
sourceUrl: https://docs.python.org/3/library/socket.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

**Source code:** [Lib/socket.py](https://github.com/python/cpython/tree/3.14/Lib/socket.py)

* * *

This module provides access to the BSD *socket* interface. It is available on all modern Unix systems, Windows, MacOS, and probably additional platforms.

## Socket Families

Depending on the system and the build options, various socket families are supported:

- **AF_UNIX** - Unix domain sockets (address: string path)
- **AF_INET** - IPv4 (address: `(host, port)` tuple)
- **AF_INET6** - IPv6 (address: `(host, port, flowinfo, scope_id)` tuple)
- **AF_BLUETOOTH** - Bluetooth sockets
- **AF_CAN** - CAN bus interface
- **AF_PACKET** - Low-level interface directly to network devices (Linux)
- **AF_VSOCK** - Communication between virtual machines and hosts
- **AF_HYPERV** - Hyper-V communication (Windows)

## Socket Types

- **SOCK_STREAM** - TCP (connection-oriented, reliable)
- **SOCK_DGRAM** - UDP (connectionless, unreliable)
- **SOCK_RAW** - Raw socket access
- **SOCK_RDM** - Reliable datagrams
- **SOCK_SEQPACKET** - Sequential packet service

## Exceptions

- **socket.error** - Deprecated alias of `OSError`.
- **socket.herror** - Address-related errors (subclass of `OSError`).
- **socket.gaierror** - Address-related errors by `getaddrinfo()` and `getnameinfo()`.
- **socket.timeout** - Deprecated alias of `TimeoutError`.

## Creating Sockets

### socket.socket(family=AF_INET, type=SOCK_STREAM, proto=0, fileno=None)

Create a new socket using the given address family, socket type and protocol number.

```python
import socket

# TCP socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# UDP socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
```

### socket.create_connection(address, timeout=GLOBAL_DEFAULT, source_address=None, *, all_errors=False)

Connect to a TCP service listening on the internet *address* (a 2-tuple `(host, port)`), and return the socket object.

### socket.create_server(address, *, family=AF_INET, backlog=None, reuse_port=False, dualstack_ipv6=False)

Convenience function which creates a TCP socket bound to *address* and returns the socket object.

## Module-Level Functions

### Name Resolution

- **socket.getaddrinfo(host, port, family=0, type=0, proto=0, flags=0)** - Translate the host/port argument into a sequence of 5-tuples.
- **socket.gethostbyname(hostname)** - Translate a host name to IPv4 address format.
- **socket.gethostbyname_ex(hostname)** - Extended version of `gethostbyname()`.
- **socket.gethostname()** - Return the hostname of the machine.
- **socket.gethostbyaddr(ip_address)** - Return a triple `(hostname, aliaslist, ipaddrlist)`.
- **socket.getnameinfo(sockaddr, flags)** - Translate a socket address into a 2-tuple `(host, port)`.
- **socket.getfqdn([name])** - Return a fully qualified domain name.

### Utility Functions

- **socket.inet_aton(ip_string)** - Convert an IPv4 address from dotted-quad string format to 32-bit packed binary format.
- **socket.inet_ntoa(packed_ip)** - Convert a 32-bit packed IPv4 address to string format.
- **socket.inet_pton(address_family, ip_string)** - Convert an IP address to packed binary format.
- **socket.inet_ntop(address_family, packed_ip)** - Convert packed IP address to string format.
- **socket.getdefaulttimeout()** - Return the default timeout in seconds.
- **socket.setdefaulttimeout(timeout)** - Set the default timeout in seconds.

## Socket Object Methods

### Connection

- **socket.accept()** - Accept a connection. Returns `(conn, address)`.
- **socket.bind(address)** - Bind the socket to *address*.
- **socket.close()** - Mark the socket closed.
- **socket.connect(address)** - Connect to a remote socket at *address*.
- **socket.connect_ex(address)** - Like `connect()`, but return an error indicator instead of raising an exception.
- **socket.listen([backlog])** - Enable a server to accept connections.
- **socket.shutdown(how)** - Shut down one or both halves of the connection.

### Data Transfer

- **socket.recv(bufsize[, flags])** - Receive data from the socket.
- **socket.recvfrom(bufsize[, flags])** - Receive data from the socket, returns `(bytes, address)`.
- **socket.recvmsg(bufsize[, ancbufsize[, flags]])** - Receive data and ancillary data.
- **socket.recvfrom_into(buffer[, nbytes[, flags]])** - Receive data into buffer.
- **socket.recv_into(buffer[, nbytes[, flags]])** - Receive data into buffer.
- **socket.send(data[, flags])** - Send data to the socket.
- **socket.sendall(data[, flags])** - Send data to the socket (continue sending until all data is sent).
- **socket.sendto(data, address)** - Send data to the socket at *address*.
- **socket.sendmsg(buffers[, ancdata[, flags[, address]]])** - Send data and ancillary data.
- **socket.sendfile(file, offset=0, count=None)** - Send a file until EOF using high-performance `os.sendfile`.

### Socket Options

- **socket.setsockopt(level, optname, value)** - Set the value of the given socket option.
- **socket.getsockopt(level, optname[, buflen])** - Return the value of the given socket option.
- **socket.setblocking(flag)** - Set blocking or non-blocking mode.
- **socket.getblocking()** - Return `True` if socket is in blocking mode, `False` otherwise.
- **socket.settimeout(value)** - Set a timeout on blocking socket operations.
- **socket.gettimeout()** - Return the timeout in seconds.

### Information

- **socket.fileno()** - Return the socket's file descriptor.
- **socket.getpeername()** - Return the remote address to which the socket is connected.
- **socket.getsockname()** - Return the socket's own address.
- **socket.type** - The socket type.
- **socket.family** - The socket family.
- **socket.proto** - The socket protocol.

## Example: TCP Echo Server

```python
import socket

HOST = ''        # all available interfaces
PORT = 50007

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen(1)
    conn, addr = s.accept()
    with conn:
        print('Connected by', addr)
        while True:
            data = conn.recv(1024)
            if not data:
                break
            conn.sendall(data)
```

## Example: TCP Echo Client

```python
import socket

HOST = 'localhost'
PORT = 50007

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    s.sendall(b'Hello, world')
    data = s.recv(1024)

print('Received', repr(data))
```
