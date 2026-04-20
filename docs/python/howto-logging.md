---
sourceUrl: https://docs.python.org/3/howto/logging.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: howto
---

Author: Vinay Sajip

This page contains tutorial information for Python's logging module.

## Basic Logging Tutorial

Logging is a means of tracking events that happen when some software runs. The software's developer adds logging calls to their code to indicate that certain events have occurred.

### When to use logging

| Task | Best tool |
|------|-----------|
| Display console output for ordinary usage | `print()` |
| Report events during normal operation | `logger.info()` (or `logger.debug()` for diagnostic purposes) |
| Issue a warning regarding a runtime event | `warnings.warn()` in library code / `logger.warning()` |
| Report an error regarding a runtime event | Raise an exception |
| Report suppression of an error | `logger.error()`, `logger.exception()` or `logger.critical()` |

The standard levels (in increasing order of severity):

| Level | When it's used |
|-------|----------------|
| `DEBUG` | Detailed information, typically of interest only when diagnosing problems. |
| `INFO` | Confirmation that things are working as expected. |
| `WARNING` | An indication that something unexpected happened. |
| `ERROR` | Due to a more serious problem, the software has not been able to perform some function. |
| `CRITICAL` | A serious error, indicating that the program itself may be unable to continue running. |

The default level is `WARNING`.

### A simple example

```python
import logging
logging.warning('Watch out!')  # will print a message to the console
logging.info('I told you so')  # will not print anything
```

### Logging to a file

```python
import logging
logger = logging.getLogger(__name__)
logging.basicConfig(filename='example.log', encoding='utf-8', level=logging.DEBUG)
logger.debug('This message should go to the log file')
logger.info('So should this')
logger.warning('And this, too')
logger.error('And non-ASCII stuff, too, like Øresund and Malmö')
```

### Logging variable data

```python
import logging
logging.warning('%s before you %s', 'Look', 'leap!')
```

### Changing the format of displayed messages

```python
import logging
logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)
logging.debug('This message should appear on the console')
```

### Displaying the date/time in messages

```python
import logging
logging.basicConfig(format='%(asctime)s %(message)s')
logging.warning('is when this event was logged.')
```

## Advanced Logging Tutorial

The logging library takes a modular approach and offers several categories of components: loggers, handlers, filters, and formatters.

*   **Loggers** expose the interface that application code directly uses.
*   **Handlers** send the log records (created by loggers) to the appropriate destination.
*   **Filters** provide a finer grained facility for determining which log records to output.
*   **Formatters** specify the layout of log records in the final output.

A good convention to use when naming loggers is to use a module-level logger:

```python
logger = logging.getLogger(__name__)
```

### Loggers

`Logger` objects have a threefold job:
1. They expose several methods to application code so that applications can log messages at runtime.
2. Logger objects determine which log messages to act upon based upon severity or filter objects.
3. Logger objects pass along relevant log messages to all interested log handlers.

Common configuration methods:
- `Logger.setLevel()` specifies the lowest-severity log message a logger will handle.
- `Logger.addHandler()` and `Logger.removeHandler()` add and remove handler objects.
- `Logger.addFilter()` and `Logger.removeFilter()` add and remove filter objects.

### Handlers

`Handler` objects are responsible for dispatching the appropriate log messages to the handler's specified destination. `Logger` objects can add zero or more handler objects to themselves with the `addHandler()` method.

Useful handlers:
- `StreamHandler` sends messages to streams (file-like objects).
- `FileHandler` sends messages to disk files.
- `RotatingFileHandler` supports log file rotation.
- `SocketHandler` sends messages to TCP/IP sockets.
- `SMTPHandler` sends messages to a designated email address.

### Formatters

Formatter objects configure the final order, structure, and contents of the log message.

```python
logging.Formatter.__init__(fmt=None, datefmt=None, style='%')
```

### Configuring Logging

Programmers can configure logging in three ways:
1. Creating loggers, handlers, and formatters explicitly using Python code.
2. Creating a logging config file and reading it using the `fileConfig()` function.
3. Creating a dictionary of configuration information and passing it to the `dictConfig()` function.

### Logging from multiple modules

The logger name convention using `__name__` allows you to create a hierarchy of loggers that follows the package/module hierarchy.

### Logging to multiple handlers

A logger can have multiple handlers, each with different severity levels and destinations.
