---
sourceUrl: https://docs.python.org/3/howto/regex.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: howto
---

Author: A.M. Kuchling

## Introduction

Regular expressions (called REs, or regexes, or regex patterns) are essentially a tiny, highly specialized programming language embedded inside Python and made available through the `re` module. Using this little language, you specify the rules for the set of possible strings that you want to match; this set might contain English sentences, or e-mail addresses, or TeX commands, or anything you like.

Regular expression patterns are compiled into a series of bytecodes which are then executed by a matching engine written in C.

## Simple patterns

### Matching characters

Most letters and characters will simply match themselves. Some characters are special metacharacters, and don't match themselves:

```
. ^ $ * + ? { } [ ] \ | ( )
```

- `[` and `]` specify a character class, e.g., `[abc]` matches `a`, `b`, or `c`; `[a-z]` matches lowercase letters.
- `[^5]` matches any character except `'5'` (complementing).
- `\` is the backslash for escape sequences:
  - `\d` - matches any decimal digit (`[0-9]`)
  - `\D` - matches any non-digit character (`[^0-9]`)
  - `\s` - matches any whitespace character (`[ \t\n\r\f\v]`)
  - `\S` - matches any non-whitespace character
  - `\w` - matches any alphanumeric character (`[a-zA-Z0-9_]`)
  - `\W` - matches any non-alphanumeric character
- `.` matches anything except a newline character (unless `re.DOTALL` is used)

### Repeating things

- `*` - zero or more times (greedy)
- `+` - one or more times
- `?` - zero or one time
- `{m,n}` - at least m repetitions, at most n
- `{m}` - exactly m times

Repetitions are greedy by default; the matching engine will try to repeat as many times as possible, then back up if needed.

## Using regular expressions

### Compiling regular expressions

```python
>>> import re
>>> p = re.compile('ab*')
>>> p = re.compile('ab*', re.IGNORECASE)
```

### The backslash plague

Use Python's raw string notation for regular expressions to avoid doubling backslashes:

| Regular String | Raw string |
|---------------|------------|
| `"\\\\section"` | `r"\\section"` |
| `"\\w+\\s+\\1"` | `r"\w+\s+\1"` |

### Performing matches

| Method/Attribute | Purpose |
|-----------------|---------|
| `match()` | Determine if the RE matches at the beginning of the string |
| `search()` | Scan through a string, looking for any location where this RE matches |
| `findall()` | Find all substrings where the RE matches, and return them as a list |
| `finditer()` | Find all substrings where the RE matches, and return them as an iterator |

Match object methods:

| Method | Purpose |
|--------|---------|
| `group()` | Return the string matched by the RE |
| `start()` | Return the starting position of the match |
| `end()` | Return the ending position of the match |
| `span()` | Return a tuple containing the (start, end) positions of the match |

```python
>>> p = re.compile('[a-z]+')
>>> m = p.match('tempo')
>>> m.group()
'tempo'
>>> m.span()
(0, 5)
```

### Module-level functions

The `re` module also provides top-level functions called `match()`, `search()`, `findall()`, `sub()`, etc. that take pattern as the first argument:

```python
>>> re.match(r'From\s+', 'From amk Thu May 14 19:12:10 1998')
```

### Compilation flags

| Flag | Meaning |
|------|---------|
| `DOTALL, S` | Make `.` match any character, including newlines |
| `IGNORECASE, I` | Do case-insensitive matches |
| `LOCALE, L` | Do a locale-aware match |
| `MULTILINE, M` | Multi-line matching, affecting `^` and `$` |
| `VERBOSE, X` | Enable verbose REs, which can be organized more cleanly |
| `ASCII, A` | Make `\w`, `\b`, `\s` and `\d` match only on ASCII characters |

## More pattern power

### Grouping

Groups are marked by the `(`, `)` metacharacters. Groups indicate the start and end of a group. `group()` returns the whole match, `group(1)`, `group(2)`, ... return individual groups:

```python
>>> p = re.compile('(ab)*')
>>> m = p.match('ababababab')
>>> m.group()
'ababababab'
>>> m.group(0)
'ababababab'
```

### Backreferences

You can refer to captured groups with `\1`, `\2`, etc.:

```python
>>> p = re.compile(r'\b(\w+)\s+\1\b')
>>> p.search('Paris in the the spring').group()
'the the'
```

### Non-capturing and named groups

- `(?:...)` - non-capturing group
- `(?P<name>...)` - named group
- `(?P=name)` - backreference to a named group

### Lookahead assertions

- `(?=...)` - positive lookahead
- `(?!...)` - negative lookahead

## Modifying strings

### Splitting strings

`split()` splits a string wherever the RE matches:

```python
>>> p = re.compile(r'\W+')
>>> p.split('This is a test, short and sweet, of split().')
['This', 'is', 'a', 'test', 'short', 'and', 'sweet', 'of', 'split', '']
```

### Search and replace

`sub()` replaces all occurrences of the RE pattern with a replacement string:

```python
>>> p = re.compile('(blue|white|red)')
>>> p.sub('colour', 'blue socks and red shoes')
'colour socks and colour shoes'
```

`subn()` does the same thing but returns the new string and the number of replacements.

## Common problems

- Use raw strings for patterns
- Don't use `re.match()` when you mean `re.search()`
- Greedy vs. non-greedy: adding `?` after a quantifier makes it non-greedy (e.g., `*?`, `+?`)
