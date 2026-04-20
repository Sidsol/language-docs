---
sourceUrl: https://docs.python.org/3/howto/unicode.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: howto
---

Release: 1.12

This HOWTO discusses Python's support for the Unicode specification for representing textual data, and explains various problems that people commonly encounter when trying to work with Unicode.

## Introduction to Unicode

### Definitions

Unicode (https://www.unicode.org/) is a specification that aims to list every character used by human languages and give each character its own unique code. The Unicode specifications are continually revised and updated to add new languages and symbols.

A **character** is the smallest possible component of a text. 'A', 'B', 'C', etc., are all different characters.

The Unicode standard describes how characters are represented by **code points**. A code point value is an integer in the range 0 to 0x10FFFF (about 1.1 million values). In the standard, a code point is written using the notation `U+265E` to mean the character with value `0x265e`.

A character is represented on a screen or on paper by a set of graphical elements called a **glyph**.

### Encodings

A Unicode string is a sequence of code points. This sequence needs to be represented in memory as a set of **code units**, which are then mapped to 8-bit bytes. The rules for translating a Unicode string into a sequence of bytes are called a **character encoding**.

**UTF-8** is one of the most commonly used encodings. It uses the following rules:
1. If the code point is < 128, it's represented by the corresponding byte value.
2. If the code point is >= 128, it's turned into a sequence of two, three, or four bytes.

UTF-8 has several convenient properties:
- It can handle any Unicode code point
- A string of ASCII text is also valid UTF-8 text
- It's fairly compact
- If bytes are corrupted or lost, it's possible to resynchronize

## Python's Unicode Support

### The String Type

Since Python 3.0, the language's `str` type contains Unicode characters. The default encoding for Python source code is UTF-8.

```python
try:
    with open('/tmp/input.txt', 'r') as f:
        ...
except OSError:
    print("Fichier non trouvé")
```

Python 3 also supports using Unicode characters in identifiers:

```python
répertoire = "/tmp/records.log"
```

Escape sequences for Unicode:

```python
>>> "\N{GREEK CAPITAL LETTER DELTA}"  # Using the character name
'\u0394'
>>> "\u0394"                          # Using a 16-bit hex value
'\u0394'
>>> "\U00000394"                      # Using a 32-bit hex value
'\u0394'
```

### Converting to Bytes

`str.encode()` returns a `bytes` representation of the Unicode string:

```python
>>> u = chr(40960) + 'abcd' + chr(1972)
>>> u.encode('utf-8')
b'\xea\x80\x80abcd\xde\xb4'
>>> u.encode('ascii', 'ignore')
b'abcd'
>>> u.encode('ascii', 'replace')
b'?abcd?'
>>> u.encode('ascii', 'xmlcharrefreplace')
b'&#40960;abcd&#1972;'
```

### Unicode Literals in Python Source Code

Specific Unicode code points can be written using `\u` (4 hex digits) or `\U` (8 hex digits) escape sequences:

```python
>>> s = "a\xac\u1234\u20ac\U00008000"
>>> [ord(c) for c in s]
[97, 172, 4660, 8364, 32768]
```

### Unicode Properties

The `unicodedata` module provides access to Unicode character properties:

```python
import unicodedata

u = chr(233) + chr(0x0bf2) + chr(3972) + chr(6000) + chr(13231)

for i, c in enumerate(u):
    print(i, '%04x' % ord(c), unicodedata.category(c), end=" ")
    print(unicodedata.name(c))
```

### Comparing Strings

The same set of characters can be represented by different sequences of code points. For example, 'ê' can be U+00EA or U+0065 U+0302.

Use `unicodedata.normalize()` for string comparisons:

```python
import unicodedata

def compare_strs(s1, s2):
    def NFD(s):
        return unicodedata.normalize('NFD', s)
    return NFD(s1) == NFD(s2)
```

Normalization forms: 'NFC', 'NFKC', 'NFD', and 'NFKD'.

For caseless comparisons:

```python
def compare_caseless(s1, s2):
    def NFD(s):
        return unicodedata.normalize('NFD', s)
    return NFD(NFD(s1).casefold()) == NFD(NFD(s2).casefold())
```

### Unicode Regular Expressions

The `re` module's `\w`, `\W`, `\b`, `\B`, `\d`, `\D`, `\s`, and `\S` handle Unicode characters by default.

### Unicode filenames

Most modern operating systems support arbitrary Unicode in filenames. Use `os.fsencode()` and `os.fsdecode()` for conversions.

### Tips for Writing Unicode-aware Programs

- Software should only work with Unicode strings internally, decoding the input data as soon as possible and encoding the output only at the end.
- If you need to output data in a specific encoding, use `str.encode()`.
- Default encoding for `open()` depends on the locale; specify encoding explicitly when opening files: `open(filename, encoding='utf-8')`.
