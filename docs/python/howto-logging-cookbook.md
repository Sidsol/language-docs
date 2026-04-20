---
sourceUrl: https://docs.python.org/3/howto/logging-cookbook.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: howto
---

Author: Vinay Sajip

This page contains a number of recipes related to logging, which have been found useful in the past.

## Using logging in multiple modules

Multiple calls to `logging.getLogger('someLogger')` return a reference to the same logger object. This is true not only within the same module, but also across modules as long as it is in the same Python interpreter process.

```python
import logging
import auxiliary_module

# create logger with 'spam_application'
logger = logging.getLogger('spam_application')
logger.setLevel(logging.DEBUG)
# create file handler which logs even debug messages
fh = logging.FileHandler('spam.log')
fh.setLevel(logging.DEBUG)
# create console handler with a higher log level
ch = logging.StreamHandler()
ch.setLevel(logging.ERROR)
# create formatter and add it to the handlers
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
ch.setFormatter(formatter)
# add the handlers to the logger
logger.addHandler(fh)
logger.addHandler(ch)
```

## Logging from multiple threads

Logging from multiple threads requires no special effort. The logging module is thread-safe.

```python
import logging
import threading
import time

def worker(arg):
    while not arg['stop']:
        logging.debug('Hi from myfunc')
        time.sleep(0.5)

def main():
    logging.basicConfig(level=logging.DEBUG, format='%(relativeCreated)6d %(threadName)s %(message)s')
    info = {'stop': False}
    thread = threading.Thread(target=worker, args=(info,))
    thread.start()
    while True:
        try:
            logging.debug('Hello from main')
            time.sleep(0.75)
        except KeyboardInterrupt:
            info['stop'] = True
            break
    thread.join()
```

## Multiple handlers and formatters

Loggers are plain Python objects. The `addHandler()` method has no minimum or maximum quota for the number of handlers you may add.

```python
import logging

logger = logging.getLogger('simple_example')
logger.setLevel(logging.DEBUG)
# create file handler which logs even debug messages
fh = logging.FileHandler('spam.log')
fh.setLevel(logging.DEBUG)
# create console handler with a higher log level
ch = logging.StreamHandler()
ch.setLevel(logging.ERROR)
# create formatter and add it to the handlers
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
fh.setFormatter(formatter)
# add the handlers to logger
logger.addHandler(ch)
logger.addHandler(fh)
```

## Logging to multiple destinations

Log to console and file with different message formats and in differing circumstances:

```python
import logging

# set up logging to file
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
                    datefmt='%m-%d %H:%M',
                    filename='myapp.log',
                    filemode='w')
# define a Handler which writes INFO messages or higher to sys.stderr
console = logging.StreamHandler()
console.setLevel(logging.INFO)
formatter = logging.Formatter('%(name)-12s: %(levelname)-8s %(message)s')
console.setFormatter(formatter)
logging.getLogger().addHandler(console)
```

## Custom handling of levels

Using filters to route different severity levels to different destinations:

```python
def filter_maker(level):
    level = getattr(logging, level)
    def filter(record):
        return record.levelno <= level
    return filter
```

## Configuration server example

Using `logging.config.listen()` to receive logging configuration changes at runtime.

## Dealing with handlers that block

Use a `QueueHandler` and `QueueListener` to avoid blocking the thread you're logging from:

```python
import queue
from logging.handlers import QueueHandler, QueueListener

que = queue.Queue(-1)  # no limit on size
queue_handler = QueueHandler(que)
handler = logging.StreamHandler()
listener = QueueListener(que, handler)
root = logging.getLogger()
root.addHandler(queue_handler)
listener.start()
# The listener/handler can now be used from any thread
```

## Sending and receiving logging events across a network

Using `SocketHandler` for sending and a custom receiver for receiving:

```python
import logging
import logging.handlers

rootLogger = logging.getLogger('')
rootLogger.setLevel(logging.DEBUG)
socketHandler = logging.handlers.SocketHandler('localhost',
                    logging.handlers.DEFAULT_TCP_LOGGING_PORT)
rootLogger.addHandler(socketHandler)
```

## Adding contextual information to your logging output

### Using LoggerAdapters

```python
import logging

class CustomAdapter(logging.LoggerAdapter):
    def process(self, msg, kwargs):
        return '[%s] %s' % (self.extra['connid'], msg), kwargs

logger = logging.getLogger(__name__)
adapter = CustomAdapter(logger, {'connid': some_conn_id})
```

### Using Filters

```python
import logging
from random import choice

class ContextFilter(logging.Filter):
    USERS = ['jim', 'fred', 'sheila']
    IPS = ['123.231.231.123', '127.0.0.1', '192.168.0.1']

    def filter(self, record):
        record.ip = choice(self.IPS)
        record.user = choice(self.USERS)
        return True
```

## Logging to a single file from multiple processes

Use `SocketHandler` with a separate receiver process, or `QueueHandler`/`QueueListener`.

## Using file rotation

```python
import logging
import logging.handlers

LOG_FILENAME = 'logging_rotatingfile_example.out'
my_logger = logging.getLogger('MyLogger')
my_logger.setLevel(logging.DEBUG)
handler = logging.handlers.RotatingFileHandler(
              LOG_FILENAME, maxBytes=20, backupCount=5)
my_logger.addHandler(handler)
```

## Use of alternative formatting styles

The logging module supports three formatting styles: `%` (default), `{` (str.format), and `$` (string.Template).

```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('mylogger')
# Using {-style formatting
handler = logging.StreamHandler()
formatter = logging.Formatter('{asctime} {name} {levelname} {message}', style='{')
handler.setFormatter(formatter)
```

## Using a context manager for selective logging

```python
import logging
import sys

class LoggingContext:
    def __init__(self, logger, level=None, handler=None, close=True):
        self.logger = logger
        self.level = level
        self.handler = handler
        self.close = close

    def __enter__(self):
        if self.level is not None:
            self.old_level = self.logger.level
            self.logger.setLevel(self.level)
        if self.handler:
            self.logger.addHandler(self.handler)
        return self

    def __exit__(self, et, ev, tb):
        if self.level is not None:
            self.logger.setLevel(self.old_level)
        if self.handler:
            self.logger.removeHandler(self.handler)
        if self.handler and self.close:
            self.handler.close()
        return False
```

## Patterns to avoid

- Opening the same log file multiple times (use a single handler per file).
- Adding handlers to a logger in library code (let the application configure logging).
- Creating loggers in module-level code that gets called multiple times.
