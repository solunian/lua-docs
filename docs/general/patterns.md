---
sidebar_position: 3
---

Patterns in Lua are described by regular strings,
which are interpreted as patterns by the pattern-matching functions
`string.find`,
`string.gmatch`,
`string.gsub`,
and `string.match`.
This section describes the syntax and the meaning
(that is, what they match) of these strings.

## Character Class

A _character class_ is used to represent a set of characters.
The following combinations are allowed in describing a character class:

- **`x`:**
  (where _x_ is not one of the _magic characters_
  `^$()%.[]*+-?`)
  represents the character _x_ itself.

- **`.`:** (a dot) represents all characters.

- **`%a`:** represents all letters.

- **`%c`:** represents all control characters.

- **`%d`:** represents all digits.

- **`%g`:** represents all printable characters except space.

- **`%l`:** represents all lowercase letters.

- **`%p`:** represents all punctuation characters.

- **`%s`:** represents all space characters.

- **`%u`:** represents all uppercase letters.

- **`%w`:** represents all alphanumeric characters.

- **`%x`:** represents all hexadecimal digits.

- **`%x`:** (where _x_ is any non-alphanumeric character)
  represents the character _x_.
  This is the standard way to escape the magic characters.
  Any non-alphanumeric character
  (including all punctuation characters, even the non-magical)
  can be preceded by a '`%`' to represent itself in a pattern.

- **`[set]`:**
  represents the class which is the union of all
  characters in _set_.
  A range of characters can be specified by
  separating the end characters of the range,
  in ascending order, with a '`-`'.
  All classes `%`_x_ described above can also be used as
  components in _set_.
  All other characters in _set_ represent themselves.
  For example, `[%w_]` (or `[_%w]`)
  represents all alphanumeric characters plus the underscore,
  `[0-7]` represents the octal digits,
  and `[0-7%l%-]` represents the octal digits plus
  the lowercase letters plus the '`-`' character.

You can put a closing square bracket in a set
by positioning it as the first character in the set.
You can put a hyphen in a set
by positioning it as the first or the last character in the set.
(You can also use an escape for both cases.)

The interaction between ranges and classes is not defined.
Therefore, patterns like `[%a-z]` or `[a-%%]`
have no meaning.

- **`[^set]`:**
  represents the complement of _set_,
  where _set_ is interpreted as above.

For all classes represented by single letters (`%a`, `%c`, etc.),
the corresponding uppercase letter represents the complement of the class.
For instance, `%S` represents all non-space characters.

The definitions of letter, space, and other character groups
depend on the current locale.
In particular, the class `[a-z]` may not be equivalent to `%l`.

## Pattern Item

A _pattern item_ can be

- a single character class,
  which matches any single character in the class;

- a single character class followed by '`*`',
  which matches sequences of zero or more characters in the class.
  These repetition items will always match the longest possible sequence;

- a single character class followed by '`+`',
  which matches sequences of one or more characters in the class.
  These repetition items will always match the longest possible sequence;

- a single character class followed by '`-`',
  which also matches sequences of zero or more characters in the class.
  Unlike '`*`',
  these repetition items will always match the shortest possible sequence;

- a single character class followed by '`?`',
  which matches zero or one occurrence of a character in the class.
  It always matches one occurrence if possible;

- `%n`, for _n_ between 1 and 9;
  such item matches a substring equal to the _n_-th captured string
  (see below);

- `%bxy`, where _x_ and _y_ are two distinct characters;
  such item matches strings that start with _x_, end with _y_,
  and where the _x_ and _y_ are _balanced_.
  This means that, if one reads the string from left to right,
  counting _+1_ for an _x_ and _-1_ for a _y_,
  the ending _y_ is the first _y_ where the count reaches 0.
  For instance, the item `%b()` matches expressions with
  balanced parentheses.

- `%f[set]`, a _frontier pattern_;
  such item matches an empty string at any position such that
  the next character belongs to _set_
  and the previous character does not belong to _set_.
  The set _set_ is interpreted as previously described.
  The beginning and the end of the subject are handled as if
  they were the character '`\0`'.

## Pattern

A _pattern_ is a sequence of pattern items.
A caret '`^`' at the beginning of a pattern anchors the match at the
beginning of the subject string.
A '`$`' at the end of a pattern anchors the match at the
end of the subject string.
At other positions,
'`^`' and '`$`' have no special meaning and represent themselves.

## Captures

A pattern can contain sub-patterns enclosed in parentheses;
they describe _captures_.
When a match succeeds, the substrings of the subject string
that match captures are stored (_captured_) for future use.
Captures are numbered according to their left parentheses.
For instance, in the pattern `"(a*(.)%w(%s*))"`,
the part of the string matching `"a*(.)%w(%s*)"` is
stored as the first capture, and therefore has number 1;
the character matching "`.`" is captured with number 2,
and the part matching "`%s*`" has number 3.

As a special case, the capture `()` captures
the current string position (a number).
For instance, if we apply the pattern `"()aa()"` on the
string `"flaaap"`, there will be two captures: 3 and 5.

## Multiple matches

The function `string.gsub` and the iterator `string.gmatch`
match multiple occurrences of the given pattern in the subject.
For these functions,
a new match is considered valid only
if it ends at least one byte after the end of the previous match.
In other words, the pattern machine never accepts the
empty string as a match immediately after another match.
As an example,
consider the results of the following code:

```lua
> string.gsub("abc", "()a*()", print);
--> 1   2
--> 3   3
--> 4   4
```

The second and third results come from Lua matching an empty
string after '`b`' and another one after '`c`'.
Lua does not match an empty string after '`a`',
because it would end at the same position of the previous match.
