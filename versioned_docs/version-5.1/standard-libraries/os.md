---
sidebar_position: 8
---

This library is implemented through table `os`.

## `os.clock ()`

Returns an approximation of the amount in seconds of CPU time
used by the program.

## `os.date ([format [, time]])`

Returns a string or a table containing date and time,
formatted according to the given string `format`.

If the `time` argument is present,
this is the time to be formatted
(see the `os.time` function for a description of this value).
Otherwise, `date` formats the current time.

If `format` starts with '`!`',
then the date is formatted in Coordinated Universal Time.
After this optional character,
if `format` is the string "`*t`",
then `date` returns a table with the following fields:
`year` (four digits), `month` (1--12), `day` (1--31),
`hour` (0--23), `min` (0--59), `sec` (0--61),
`wday` (weekday, Sunday is 1),
`yday` (day of the year),
and `isdst` (daylight saving flag, a boolean).

If `format` is not "`*t`",
then `date` returns the date as a string,
formatted according to the same rules as the C function `strftime`.

When called without arguments,
`date` returns a reasonable date and time representation that depends on
the host system and on the current locale
(that is, `os.date()` is equivalent to `os.date("%c")`).

## `os.difftime (t2, t1)`

Returns the number of seconds from time `t1` to time `t2`.
In POSIX, Windows, and some other systems,
this value is exactly `t2`_-_`t1`.

## `os.execute ([command])`

This function is equivalent to the C function `system`.
It passes `command` to be executed by an operating system shell.
It returns a status code, which is system-dependent.
If `command` is absent, then it returns nonzero if a shell is available
and zero otherwise.

## `os.exit ([code])`

Calls the C function `exit`,
with an optional `code`,
to terminate the host program.
The default value for `code` is the success code.

## `os.getenv (varname)`

Returns the value of the process environment variable `varname`,
or **nil** if the variable is not defined.

## `os.remove (filename)`

Deletes the file or directory with the given name.
Directories must be empty to be removed.
If this function fails, it returns **nil**,
plus a string describing the error.

## `os.rename (oldname, newname)`

Renames file or directory named `oldname` to `newname`.
If this function fails, it returns **nil**,
plus a string describing the error.

## `os.setlocale (locale [, category])`

Sets the current locale of the program.
`locale` is a string specifying a locale;
`category` is an optional string describing which category to change:
`"all"`, `"collate"`, `"ctype"`,
`"monetary"`, `"numeric"`, or `"time"`;
the default category is `"all"`.
The function returns the name of the new locale,
or **nil** if the request cannot be honored.

If `locale` is the empty string,
the current locale is set to an implementation-defined native locale.
If `locale` is the string "`C`",
the current locale is set to the standard C locale.

When called with **nil** as the first argument,
this function only returns the name of the current locale
for the given category.

## `os.time ([table])`

Returns the current time when called without arguments,
or a time representing the date and time specified by the given table.
This table must have fields `year`, `month`, and `day`,
and may have fields `hour`, `min`, `sec`, and `isdst`
(for a description of these fields, see the `os.date` function).

The returned value is a number, whose meaning depends on your system.
In POSIX, Windows, and some other systems, this number counts the number
of seconds since some given start time (the "epoch").
In other systems, the meaning is not specified,
and the number returned by `time` can be used only as an argument to
`date` and `difftime`.

## `os.tmpname ()`

Returns a string with a file name that can
be used for a temporary file.
The file must be explicitly opened before its use
and explicitly removed when no longer needed.

On some systems (POSIX),
this function also creates a file with that name,
to avoid security risks.
(Someone else might create the file with wrong permissions
in the time between getting the name and creating the file.)
You still have to open the file to use it
and to remove it (even if you do not use it).

When possible,
you may prefer to use `io.tmpfile`,
which automatically removes the file when the program ends.
