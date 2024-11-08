---
sidebar_position: 5
---

This library provides basic support for UTF-8 encoding.
It provides all its functions inside the table `utf8`.
This library does not provide any support for Unicode other
than the handling of the encoding.
Any operation that needs the meaning of a character,
such as character classification, is outside its scope.

Unless stated otherwise,
all functions that expect a byte position as a parameter
assume that the given position is either the start of a byte sequence
or one plus the length of the subject string.
As in the string library,
negative indices count from the end of the string.

Functions that create byte sequences
accept all values up to `0x7FFFFFFF`,
as defined in the original UTF-8 specification;
that implies byte sequences of up to six bytes.

Functions that interpret byte sequences only accept
valid sequences (well formed and not overlong).
By default, they only accept byte sequences
that result in valid Unicode code points,
rejecting values greater than `10FFFF` and surrogates.
A boolean argument `lax`, when available,
lifts these checks,
so that all values up to `0x7FFFFFFF` are accepted.
(Not well formed and overlong sequences are still rejected.)

## `utf8.char (...)`

Receives zero or more integers,
converts each one to its corresponding UTF-8 byte sequence
and returns a string with the concatenation of all these sequences.

## `utf8.charpattern`

The pattern (a string, not a function) "`[\0-\x7F\xC2-\xFD][\x80-\xBF]*`",
which matches exactly one UTF-8 byte sequence,
assuming that the subject is a valid UTF-8 string.

## `utf8.codes (s [, lax])`

Returns values so that the construction

```lua
for p, c in utf8.codes(s) do <body> end
```

will iterate over all UTF-8 characters in string `s`,
with `p` being the position (in bytes) and `c` the code point
of each character.
It raises an error if it meets any invalid byte sequence.

## `utf8.codepoint (s [, i [, j [, lax]]])`

Returns the code points (as integers) from all characters in `s`
that start between byte position `i` and `j` (both included).
The default for `i` is 1 and for `j` is `i`.
It raises an error if it meets any invalid byte sequence.

## `utf8.len (s [, i [, j [, lax]]])`

Returns the number of UTF-8 characters in string `s`
that start between positions `i` and `j` (both inclusive).
The default for `i` is 1 and for `j` is -1.
If it finds any invalid byte sequence,
returns **fail** plus the position of the first invalid byte.

## `utf8.offset (s, n [, i])`

Returns the position (in bytes) where the encoding of the
`n`-th character of `s`
(counting from position `i`) starts.
A negative `n` gets characters before position `i`.
The default for `i` is 1 when `n` is non-negative
and `#s + 1` otherwise,
so that `utf8.offset(s, -n)` gets the offset of the
`n`-th character from the end of the string.
If the specified character is neither in the subject
nor right after its end,
the function returns **fail**.

As a special case,
when `n` is 0 the function returns the start of the encoding
of the character that contains the `i`-th byte of `s`.

This function assumes that `s` is a valid UTF-8 string.
