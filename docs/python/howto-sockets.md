---
sourceUrl: https://docs.python.org/3/howto/sockets.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: howto
---

Author: Gordon McMillan

## Sockets

This HOWTO covers INET (IPv4) STREAM (TCP) sockets. Part of the trouble with understanding these things is that "socket" can mean a number of subtly different things, depending on context. Let's make a distinction between a "client" socket - an endpoint of a conversation, and a "server" socket, which is more like a switchboard operator.

### History

Of the various forms of IPC, sockets are by far the most popular. They were invented in Berkeley as part of the BSD flavor of Unix. They spread like wildfire with the internet.

## Creating a Socket

Client socket example:

```python
# create an INET, STREAMing socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# now connect to the web server on port 80 - the normal http port
s.connect(("www.python.org", 80))
```

Server socket example:

```python
# create an INET, STREAMing socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# bind the socket to a public host, and a well-known port
serversocket.bind((socket.gethostname(), 80))
# become a server socket
serversocket.listen(5)
```

Main server loop:

```python
while True:
    # accept connections from outside
    (clientsocket, address) = serversocket.accept()
    # now do something with the clientsocket
    ct = make_client_thread(clientsocket)
    ct.start()
```

There are 3 general ways the loop could work: dispatching a thread, creating a new process, or using non-blocking sockets with `select`.

### IPC

If you need fast IPC between two processes on one machine, look into pipes or shared memory. If using AF_INET sockets, bind the "server" socket to `'localhost'` for better performance.

## Using a Socket

The web browser's "client" socket and the web server's "client" socket are identical beasts - this is a "peer to peer" conversation.

Important points about `send` and `recv`:
- They operate on the network buffers, not necessarily handling all bytes at once
- They return how many bytes they handled
- It is your responsibility to call them again until your message has been completely dealt with
- When `recv` returns 0 bytes, the other side has closed the connection

Messages must either be fixed length, delimited, indicate how long they are, or end by shutting down the connection.

Example fixed-length message handler:

```python
class MySocket:
    def __init__(self, sock=None):
        if sock is None:
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        else:
            self.sock = sock

    def connect(self, host, port):
        self.sock.connect((host, port))

    def mysend(self, msg):
        totalsent = 0
        while totalsent < MSGLEN:
            sent = self.sock.send(msg[totalsent:])
            if sent == 0:
                raise RuntimeError("socket connection broken")
            totalsent = totalsent + sent

    def myreceive(self):
        chunks = []
        bytes_recd = 0
        while bytes_recd < MSGLEN:
            chunk = self.sock.recv(min(MSGLEN - bytes_recd, 2048))
            if chunk == b'':
                raise RuntimeError("socket connection broken")
            chunks.append(chunk)
            bytes_recd = bytes_recd + len(chunk)
        return b''.join(chunks)
```

### Binary Data

Not all machines use the same formats for binary data. Socket libraries have calls for converting integers: `ntohl`, `htonl`, `ntohs`, `htons` where "n" means network and "h" means host, "s" means short and "l" means long.

## Disconnecting

Use `shutdown` on a socket before you `close` it. The `shutdown` is an advisory to the socket at the other end:
- `shutdown(1)` means "I'm done sending, but I'll still listen"
- Python takes automatic shutdown a step further with garbage collection, but always explicitly `close` your sockets

### When Sockets Die

If the other side comes down hard (without doing a `close`), your blocking socket is likely to hang. TCP will wait a long time before giving up on a connection.

## Non-blocking Sockets

Use `socket.setblocking(False)` to make a socket non-blocking. Use `select` to manage non-blocking sockets:

```python
ready_to_read, ready_to_write, in_error = \
               select.select(
                  potential_readers,
                  potential_writers,
                  potential_errs,
                  timeout)
```

You pass `select` three lists (readable, writable, errors) and it returns three lists that are subsets of the input - the sockets that are actually ready.

**Portability alert**: On Unix, `select` works with both sockets and files. On Windows, `select` works with sockets only.
