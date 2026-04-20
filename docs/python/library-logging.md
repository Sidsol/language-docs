---
sourceUrl: https://docs.python.org/3/library/logging.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

**Source code:** [Lib/logging/__init__.py](https://github.com/python/cpython/tree/3.14/Lib/logging/__init__.py)

* * *

This module defines functions and classes which implement a flexible event logging system for applications and libraries.

The key benefit of having the logging API provided by a standard library module is that all Python modules can participate in logging, so your application log can include your own messages integrated with messages from third-party modules.

## Basic Usage

```python
# myapp.py
import logging
import mylib
logger = logging.getLogger(__name__)

def main():
    logging.basicConfig(filename='myapp.log', level=logging.INFO)
    logger.info('Started')
    mylib.do_something()
    logger.info('Finished')

if __name__ == '__main__':
    main()

# mylib.py
import logging
logger = logging.getLogger(__name__)

def do_something():
    logger.info('Doing something')
```

Output in `myapp.log`:
```
INFO:__main__:Started
INFO:mylib:Doing something
INFO:__main__:Finished
```

The key feature is that the majority of code simply creates a module level logger with `getLogger(__name__)`, and uses that logger to do any needed logging. This approach is known as hierarchical logging.

## Core Components

- **Loggers** expose the interface that application code directly uses.
- **Handlers** send the log records (created by loggers) to the appropriate destination.
- **Filters** provide a finer grained facility for determining which log records to output.
- **Formatters** specify the layout of log records in the final output.

## Logging Levels

| Level | Numeric value |
|-------|---------------|
| CRITICAL | 50 |
| ERROR | 40 |
| WARNING | 30 |
| INFO | 20 |
| DEBUG | 10 |
| NOTSET | 0 |

## Logger Objects

Loggers should NEVER be instantiated directly, but always through the module-level function `logging.getLogger(name)`. Multiple calls to `getLogger()` with the same name will always return a reference to the same Logger object.

### class logging.Logger

**Attributes:**

- **name** - The logger's name (read-only).
- **level** - The threshold of this logger. Use `setLevel()` to change.
- **parent** - The parent logger (read-only).
- **propagate** - If true, events logged to this logger will be passed to handlers of ancestor loggers (default: `True`).
- **handlers** - The list of handlers directly attached to this logger (read-only).
- **disabled** - Disables handling of any events (read-only).

**Methods:**

- **setLevel(level)** - Sets the threshold for this logger to *level*.
- **isEnabledFor(level)** - Indicates if a message of severity *level* would be processed.
- **getEffectiveLevel()** - Returns the effective level for this logger.
- **getChild(suffix)** - Returns a logger which is a descendant to this logger.
- **getChildren()** - Returns a set of loggers which are immediate children. (Added 3.12)
- **debug(msg, *args, **kwargs)** - Logs a message with level DEBUG.
- **info(msg, *args, **kwargs)** - Logs a message with level INFO.
- **warning(msg, *args, **kwargs)** - Logs a message with level WARNING.
- **error(msg, *args, **kwargs)** - Logs a message with level ERROR.
- **critical(msg, *args, **kwargs)** - Logs a message with level CRITICAL.
- **log(level, msg, *args, **kwargs)** - Logs a message with integer level *level*.
- **exception(msg, *args, **kwargs)** - Logs a message with level ERROR with exception info. Should only be called from an exception handler.
- **addFilter(filter)** - Adds the specified filter to this logger.
- **removeFilter(filter)** - Removes the specified filter from this logger.
- **filter(record)** - Apply this logger's filters to the record.
- **addHandler(hdlr)** - Adds the specified handler to this logger.
- **removeHandler(hdlr)** - Removes the specified handler from this logger.
- **findCaller(stack_info=False, stacklevel=1)** - Finds the caller's source filename and line number.
- **handle(record)** - Handles a record by passing it to all handlers.
- **makeRecord(name, level, fn, lno, msg, args, exc_info, func=None, extra=None, sinfo=None)** - Factory method for creating a LogRecord.
- **hasHandlers()** - Returns True if this logger has any handlers configured.

Keyword arguments for logging methods:
- **exc_info** - If not false, causes exception information to be added to the message.
- **stack_info** - If true, stack information is added to the message.
- **stacklevel** - If greater than 1, skips stack frames when computing line number.
- **extra** - A dictionary used to populate the LogRecord with user-defined attributes.

## Handler Objects

Handlers are responsible for dispatching the appropriate log messages to the handler's specified destination.

### class logging.Handler

- **setLevel(level)** - Sets the threshold for this handler.
- **setFormatter(fmt)** - Sets the Formatter for this handler.
- **addFilter(filter)** - Adds the specified filter to this handler.
- **removeFilter(filter)** - Removes the specified filter from this handler.
- **filter(record)** - Apply this handler's filters to the record.
- **emit(record)** - Do whatever it takes to actually log the specified record (must be implemented by subclass).
- **handle(record)** - Conditionally emits the specified logging record.
- **flush()** - Ensure all logging output has been flushed.
- **close()** - Tidy up any resources used by the handler.
- **handleError(record)** - Called when an exception is encountered during `emit()`.

## Formatter Objects

### class logging.Formatter(fmt=None, datefmt=None, style='%', validate=True, *, defaults=None)

Responsible for converting a LogRecord to an output string.

- **format(record)** - The record's attribute dictionary is used as the operand to a string formatting operation.
- **formatTime(record, datefmt=None)** - Format the creation time of the specified LogRecord.
- **formatException(exc_info)** - Formats the specified exception information as a string.
- **formatStack(stack_info)** - Formats the specified stack information as a string.

## Filter Objects

### class logging.Filter(name='')

Filters can be used by Handlers and Loggers for more sophisticated filtering than is provided by levels.

- **filter(record)** - Returns True if the specified record is to be logged, False otherwise.

## LogRecord Objects

### class logging.LogRecord(name, level, pathname, lineno, msg, args, exc_info, func=None, sinfo=None)

Contains all the information pertinent to the event being logged.

Key attributes: `name`, `msg`, `args`, `levelname`, `levelno`, `pathname`, `filename`, `module`, `exc_info`, `exc_text`, `stack_info`, `lineno`, `funcName`, `created`, `msecs`, `relativeCreated`, `thread`, `threadName`, `process`, `processName`, `message`.

## Module-Level Functions

- **logging.getLogger(name=None)** - Return a logger with the specified name, creating it if necessary. If no name, return the root logger.
- **logging.getLoggerClass()** - Return the logger class.
- **logging.getLogRecordFactory()** - Return a callable used to create a LogRecord.
- **logging.debug(msg, *args, **kwargs)** - Logs a message with level DEBUG on the root logger.
- **logging.info(msg, *args, **kwargs)** - Logs a message with level INFO on the root logger.
- **logging.warning(msg, *args, **kwargs)** - Logs a message with level WARNING on the root logger.
- **logging.error(msg, *args, **kwargs)** - Logs a message with level ERROR on the root logger.
- **logging.critical(msg, *args, **kwargs)** - Logs a message with level CRITICAL on the root logger.
- **logging.exception(msg, *args, **kwargs)** - Logs a message with level ERROR on the root logger with exception info.
- **logging.log(level, msg, *args, **kwargs)** - Logs a message with the given level on the root logger.
- **logging.disable(level=CRITICAL)** - Provides an overriding level for all loggers.
- **logging.addLevelName(level, levelName)** - Associates level with text *levelName*.
- **logging.getLevelNamesMapping()** - Returns a mapping of level names to their corresponding logging levels. (Added 3.11)
- **logging.getLevelName(level)** - Returns the textual or numeric representation of logging level.
- **logging.getHandlerByName(name)** - Returns a handler with the specified name. (Added 3.12)
- **logging.getHandlerNames()** - Returns an immutable set of all known handler names. (Added 3.12)
- **logging.makeLogRecord(attrdict)** - Creates and returns a new LogRecord instance.
- **logging.basicConfig(**kwargs)** - Does basic configuration for the logging system.
- **logging.shutdown()** - Informs the logging system to perform an orderly shutdown.
- **logging.setLoggerClass(klass)** - Sets the class to be used when instantiating a logger.
- **logging.setLogRecordFactory(factory)** - Set a callable to create a LogRecord.

### basicConfig Parameters

- **filename** - Use `FileHandler` with specified filename.
- **filemode** - File mode for opening (default: `'a'`).
- **format** - Format string for the handler.
- **datefmt** - Date/time format for `asctime`.
- **style** - Format style: `'%'`, `'{'`, or `'$'` (default: `'%'`).
- **level** - Set the root logger level.
- **stream** - Use `StreamHandler` with specified stream.
- **handlers** - Iterable of already created handlers.
- **force** - If True, remove and close any existing handlers before configuration.
- **encoding** - Encoding for `FileHandler`.
- **errors** - Error handling scheme for `FileHandler`.
