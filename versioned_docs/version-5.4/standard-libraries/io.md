---
sidebar_position: 8
---

The I/O library provides two different styles for file manipulation.
The first one uses implicit file handles;
that is, there are operations to set a default input file and a
default output file,
and all input/output operations are done over these default files.
The second style uses explicit file handles.

When using implicit file handles,
all operations are supplied by table `io`.
When using explicit file handles,
the operation `io.open` returns a file handle
and then all operations are supplied as methods of the file handle.

The metatable for file handles provides metamethods
for `__gc` and `__close` that try
to close the file when called.

The table `io` also provides
three predefined file handles with their usual meanings from C:
`io.stdin`, `io.stdout`, and `io.stderr`.
The I/O library never closes these files.

Unless otherwise stated,
all I/O functions return **fail** on failure,
plus an error message as a second result and
a system-dependent error code as a third result,
and some non-false value on success.
On non-POSIX systems,
the computation of the error message and error code
in case of errors
may be not thread safe,
because they rely on the global C variable `errno`.

## `io.close ([file])`

Equivalent to `file:close()`.
Without a `file`, closes the default output file.

## `io.flush ()`

Equivalent to `io.output():flush()`.

## `io.input ([file])`

When called with a file name, it opens the named file (in text mode),
and sets its handle as the default input file.
When called with a file handle,
it simply sets this file handle as the default input file.
When called without arguments,
it returns the current default input file.

In case of errors this function raises the error,
instead of returning an error code.

## `io.lines ([filename, ...])`

Opens the given file name in read mode
and returns an iterator function that
works like `file:lines(...)` over the opened file.
When the iterator function fails to read any value,
it automatically closes the file.
Besides the iterator function,
`io.lines` returns three other values:
two **nil** values as placeholders,
plus the created file handle.
Therefore, when used in a generic **for** loop,
the file is closed also if the loop is interrupted by an
error or a **break**.

The call `io.lines()` (with no file name) is equivalent
to `io.input():lines("l")`;
that is, it iterates over the lines of the default input file.
In this case, the iterator does not close the file when the loop ends.

In case of errors opening the file,
this function raises the error,
instead of returning an error code.

## `io.open (filename [, mode])`

This function opens a file,
in the mode specified in the string `mode`.
In case of success,
it returns a new file handle.

The `mode` string can be any of the following:

- **"`r`":** read mode (the default);
- **"`w`":** write mode;
- **"`a`":** append mode;
- **"`r+`":** update mode, all previous data is preserved;
- **"`w+`":** update mode, all previous data is erased;
- **"`a+`":** append update mode, previous data is preserved,
  writing is only allowed at the end of file.

The `mode` string can also have a '`b`' at the end,
which is needed in some systems to open the file in binary mode.

## `io.output ([file])`

Similar to `io.input`, but operates over the default output file.

## `io.popen (prog [, mode])`

This function is system dependent and is not available
on all platforms.

Starts the program `prog` in a separated process and returns
a file handle that you can use to read data from this program
(if `mode` is `"r"`, the default)
or to write data to this program
(if `mode` is `"w"`).

## `io.read (...)`

Equivalent to `io.input():read(...)`.

## `io.tmpfile ()`

In case of success,
returns a handle for a temporary file.
This file is opened in update mode
and it is automatically removed when the program ends.

## `io.type (obj)`

Checks whether `obj` is a valid file handle.
Returns the string `"file"` if `obj` is an open file handle,
`"closed file"` if `obj` is a closed file handle,
or **fail** if `obj` is not a file handle.

## `io.write (...)`

Equivalent to `io.output():write(...)`.

## `file:close ()`

Closes `file`.
Note that files are automatically closed when
their handles are garbage collected,
but that takes an unpredictable amount of time to happen.

When closing a file handle created with `io.popen`,
`file:close` returns the same values
returned by `os.execute`.

## `file:flush ()`

Saves any written data to `file`.

## `file:lines (...)`

Returns an iterator function that,
each time it is called,
reads the file according to the given formats.
When no format is given,
uses "`l`" as a default.
As an example, the construction

```lua
for c in file:lines(1) do <body> end
```

will iterate over all characters of the file,
starting at the current position.
Unlike `io.lines`, this function does not close the file
when the loop ends.

## `file:read (...)`

Reads the file `file`,
according to the given formats, which specify what to read.
For each format,
the function returns a string or a number with the characters read,
or **fail** if it cannot read data with the specified format.
(In this latter case,
the function does not read subsequent formats.)
When called without arguments,
it uses a default format that reads the next line
(see below).

The available formats are

- **"`n`":**
  reads a numeral and returns it as a float or an integer,
  following the lexical conventions of Lua.
  (The numeral may have leading whitespaces and a sign.)
  This format always reads the longest input sequence that
  is a valid prefix for a numeral;
  if that prefix does not form a valid numeral
  (e.g., an empty string, "`0x`", or "`3.4e-`")
  or it is too long (more than 200 characters),
  it is discarded and the format returns **fail**.

- **"`a`":**
  reads the whole file, starting at the current position.
  On end of file, it returns the empty string;
  this format never fails.

- **"`l`":**
  reads the next line skipping the end of line,
  returning **fail** on end of file.
  This is the default format.

- **"`L`":**
  reads the next line keeping the end-of-line character (if present),
  returning **fail** on end of file.

- **number:**
  reads a string with up to this number of bytes,
  returning **fail** on end of file.
  If `number` is zero,
  it reads nothing and returns an empty string,
  or **fail** on end of file.

The formats "`l`" and "`L`" should be used only for text files.

## `file:seek ([whence [, offset]])`

Sets and gets the file position,
measured from the beginning of the file,
to the position given by `offset` plus a base
specified by the string `whence`, as follows:

- **"`set`":** base is position 0 (beginning of the file);
- **"`cur`":** base is current position;
- **"`end`":** base is end of file;

In case of success, `seek` returns the final file position,
measured in bytes from the beginning of the file.
If `seek` fails, it returns **fail**,
plus a string describing the error.

The default value for `whence` is `"cur"`,
and for `offset` is 0.
Therefore, the call `file:seek()` returns the current
file position, without changing it;
the call `file:seek("set")` sets the position to the
beginning of the file (and returns 0);
and the call `file:seek("end")` sets the position to the
end of the file, and returns its size.

## `file:setvbuf (mode [, size])`

Sets the buffering mode for a file.
There are three available modes:

- **"`no`":** no buffering.
- **"`full`":** full buffering.
- **"`line`":** line buffering.

For the last two cases,
`size` is a hint for the size of the buffer, in bytes.
The default is an appropriate size.

The specific behavior of each mode is non portable;
check the underlying ISO C function `setvbuf` in your platform for
more details.

## `file:write (...)`

Writes the value of each of its arguments to `file`.
The arguments must be strings or numbers.

In case of success, this function returns `file`.
