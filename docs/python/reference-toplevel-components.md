---
sourceUrl: https://docs.python.org/3/reference/toplevel_components.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: reference
---

# 9. Top-level components[¶](#top-level-components)

The Python interpreter can get its input from a number of sources: from a script
passed to it as standard input or as program argument, typed in interactively,
from a module source file, etc. This chapter gives the syntax used in these
cases.

## 9.1. Complete Python programs[¶](#complete-python-programs)

While a language specification need not prescribe how the language interpreter
is invoked, it is useful to have a notion of a complete Python program. A
complete Python program is executed in a minimally initialized environment: all
built-in and standard modules are available, but none have been initialized,
except for [`sys`](../library/sys.html#module-sys) (various system services), [`builtins`](../library/builtins.html#module-builtins) (built-in
functions, exceptions and `None`) and [`__main__`](../library/__main__.html#module-__main__). The latter is used to
provide the local and global namespace for execution of the complete program.

The syntax for a complete Python program is that for file input, described in
the next section.

The interpreter may also be invoked in interactive mode; in this case, it does
not read and execute a complete program but reads and executes one statement
(possibly compound) at a time. The initial environment is identical to that of
a complete program; each statement is executed in the namespace of
[`__main__`](../library/__main__.html#module-__main__).

A complete program can be passed to the interpreter
in three forms: with the [`-c`](../using/cmdline.html#cmdoption-c) *string* command line option, as a file
passed as the first command line argument, or as standard input. If the file
or standard input is a tty device, the interpreter enters interactive mode;
otherwise, it executes the file as a complete program.

## 9.2. File input[¶](#file-input)

All input read from non-interactive files has the same form:

```

**file_input**: (NEWLINE | [`statement`](compound_stmts.html#grammar-token-python-grammar-statement))* ENDMARKER

```

This syntax is used in the following situations:

* when parsing a complete Python program (from a file or from a string);

* when parsing a module;

* when parsing a string passed to the [`exec()`](../library/functions.html#exec) function;

## 9.3. Interactive input[¶](#interactive-input)

Input in interactive mode is parsed using the following grammar:

```

**interactive_input**: [[`stmt_list`](compound_stmts.html#grammar-token-python-grammar-stmt_list)] NEWLINE | [`compound_stmt`](compound_stmts.html#grammar-token-python-grammar-compound_stmt) NEWLINE | ENDMARKER

```

Note that a (top-level) compound statement must be followed by a blank line in
interactive mode; this is needed to help the parser detect the end of the input.

## 9.4. Expression input[¶](#expression-input)

[`eval()`](../library/functions.html#eval) is used for expression input. It ignores leading whitespace. The
string argument to `eval()` must have the following form:

```

**eval_input**: [`expression_list`](expressions.html#grammar-token-python-grammar-expression_list) NEWLINE* ENDMARKER

```

### [Table of Contents](../contents.html)

* [9. Top-level components](#)
* [9.1. Complete Python programs](#complete-python-programs)

* [9.2. File input](#file-input)

* [9.3. Interactive input](#interactive-input)

* [9.4. Expression input](#expression-input)

#### Previous topic

[8. Compound statements](compound_stmts.html)

#### Next topic

[10. Full Grammar specification](grammar.html)

### This page

* [Report a bug](../bugs.html)

* [Improve this page](../improve-page-nojs.html)

*
[Show source
](https://github.com/python/cpython/blob/main/Doc/reference/toplevel_components.rst?plain=1)

«

### Navigation

*
[index](../genindex.html)

*
[modules](../py-modindex.html) |

*
[next](grammar.html) |

*
[previous](compound_stmts.html) |

*

* [Python](https://www.python.org/)

*

*

*
[3.14.4 Documentation](../index.html)

* [The Python Language Reference](index.html)

* [9. Top-level components]()

*

|

*

Theme

Auto
Light
Dark

|

&copy; [Copyright](../copyright.html) 2001 Python Software Foundation.

This page is licensed under the Python Software Foundation License Version 2.

Examples, recipes, and other code in the documentation are additionally licensed under the Zero Clause BSD License.

See [History and License](/license.html) for more information.

The Python Software Foundation is a non-profit corporation.
[Please donate.](https://www.python.org/psf/donations/)

Last updated on Apr 19, 2026 (21:51 UTC).

[Found a bug](/bugs.html)?

Created using [Sphinx](https://www.sphinx-doc.org/) 8.2.3.
