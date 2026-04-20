---
sourceUrl: https://docs.python.org/3/library/argparse.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

Added in version 3.2.

**Source code:** [Lib/argparse.py](https://github.com/python/cpython/tree/3.14/Lib/argparse.py)

* * *

The `argparse` module makes it easy to write user-friendly command-line interfaces. The program defines what arguments it requires, and `argparse` will figure out how to parse those out of `sys.argv`. The `argparse` module also automatically generates help and usage messages. The module will also issue errors when users give the program invalid arguments.

## Basic Usage

The `argparse` module's support for command-line interfaces is built around an instance of `argparse.ArgumentParser`:

```python
parser = argparse.ArgumentParser(
    prog='ProgramName',
    description='What the program does',
    epilog='Text at the bottom of help')

parser.add_argument('filename')           # positional argument
parser.add_argument('-c', '--count')      # option that takes a value
parser.add_argument('-v', '--verbose',
                    action='store_true')  # on/off flag

args = parser.parse_args()
print(args.filename, args.count, args.verbose)
```

## ArgumentParser Objects

```python
class argparse.ArgumentParser(
    prog=None, usage=None, description=None, epilog=None,
    parents=[], formatter_class=argparse.HelpFormatter,
    prefix_chars='-', fromfile_prefix_chars=None,
    argument_default=None, conflict_handler='error',
    add_help=True, allow_abbrev=True, exit_on_error=True,
    *, suggest_on_error=False, color=True)
```

Parameters:

- **prog** - The name of the program (default: generated from `sys.argv[0]`)
- **usage** - The string describing the program usage (default: generated from arguments)
- **description** - Text to display before the argument help
- **epilog** - Text to display after the argument help
- **parents** - A list of `ArgumentParser` objects whose arguments should also be included
- **formatter_class** - A class for customizing the help output
- **prefix_chars** - The set of characters that prefix optional arguments (default: `'-'`)
- **fromfile_prefix_chars** - The set of characters that prefix files from which additional arguments should be read
- **argument_default** - The global default value for arguments
- **conflict_handler** - The strategy for resolving conflicting optionals
- **add_help** - Add a `-h/--help` option to the parser (default: `True`)
- **allow_abbrev** - Allows long options to be abbreviated if unambiguous (default: `True`)
- **exit_on_error** - Whether `ArgumentParser` exits with error info on error (default: `True`)
- **suggest_on_error** - Enables suggestions for mistyped argument choices (default: `False`, added 3.14)
- **color** - Allow color output (default: `True`, added 3.14)

### Formatter Classes

- **argparse.RawDescriptionHelpFormatter** - Prevents line-wrapping of description and epilog
- **argparse.RawTextHelpFormatter** - Maintains whitespace for all sorts of help text
- **argparse.ArgumentDefaultsHelpFormatter** - Automatically adds default values info to help messages
- **argparse.MetavarTypeHelpFormatter** - Uses type name for each argument as display name

## The add_argument() Method

```python
ArgumentParser.add_argument(name or flags..., *, action, nargs, const,
    default, type, choices, required, help, metavar, dest)
```

Parameters:

- **name or flags** - Either a name or a list of option strings, e.g. `foo` or `-f, --foo`
- **action** - The basic type of action to be taken when this argument is encountered
  - `'store'` - Store the argument's value (default)
  - `'store_const'` - Store the value specified by the `const` keyword argument
  - `'store_true'` / `'store_false'` - Store `True` / `False`
  - `'append'` - Append each argument value to a list
  - `'append_const'` - Append the value specified by `const` to a list
  - `'count'` - Count the number of times a keyword argument occurs
  - `'help'` - Print help message
  - `'version'` - Print version information
  - `'extend'` - Store a list, extending each argument value to the list
- **nargs** - The number of command-line arguments that should be consumed
  - `N` (an integer) - N arguments gathered into a list
  - `'?'` - One argument consumed optionally
  - `'*'` - All command-line arguments gathered into a list
  - `'+'` - Like `'*'` but produces an error if there wasn't at least one argument
- **const** - A constant value required by some action and nargs selections
- **default** - The value produced if the argument is absent
- **type** - The type to which the command-line argument should be converted
- **choices** - A sequence of allowable values for the argument
- **required** - Whether or not the command-line option may be omitted (optionals only)
- **help** - A brief description of what the argument does
- **metavar** - A name for the argument in usage messages
- **dest** - The name of the attribute to be added to the object returned by `parse_args()`

## The parse_args() Method

```python
ArgumentParser.parse_args(args=None, namespace=None)
```

Convert argument strings to objects and assign them as attributes of the namespace. Returns the populated namespace.

## Other ArgumentParser Methods

- **parse_known_args(args=None, namespace=None)** - Parse known arguments, returning a tuple of the populated namespace and the list of remaining argument strings
- **add_subparsers([title][, description][, prog][, ...])** - Create subcommands
- **add_argument_group(title=None, description=None)** - Create argument groups for better help organization
- **add_mutually_exclusive_group(required=False)** - Create a mutually exclusive group
- **set_defaults(**kwargs)** - Set default values for arguments
- **get_default(dest)** - Get the default value for a namespace attribute
- **print_usage(file=None)** - Print a brief usage message
- **print_help(file=None)** - Print a help message
- **format_usage()** - Return a string containing a brief usage message
- **format_help()** - Return a string containing a help message
- **exit(status=0, message=None)** - Terminate the program with the specified status and message
- **error(message)** - Print a usage message and exit with status code 2

## Subcommands Example

```python
parser = argparse.ArgumentParser()
subparsers = parser.add_subparsers(dest='command')

# create the parser for the "checkout" command
parser_checkout = subparsers.add_parser('checkout')
parser_checkout.add_argument('branch')

# create the parser for the "commit" command
parser_commit = subparsers.add_parser('commit')
parser_commit.add_argument('-m', '--message')

args = parser.parse_args()
```

## Mutual Exclusion Example

```python
parser = argparse.ArgumentParser()
group = parser.add_mutually_exclusive_group()
group.add_argument('--verbose', action='store_true')
group.add_argument('--quiet', action='store_true')
args = parser.parse_args()
```
