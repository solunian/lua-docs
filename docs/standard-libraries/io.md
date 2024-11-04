---
sidebar_position: 7
---

The I/O library provides two different styles for file manipulation.
The first one uses implicit file descriptors;
that is, there are operations to set a default input file and a
default output file,
and all input/output operations are over these default files.
The second style uses explicit file descriptors.

When using implicit file descriptors,
all operations are supplied by table `io`.
When using explicit file descriptors,
the operation `io.open` returns a file descriptor
and then all operations are supplied as methods of the file descriptor.

The table `io` also provides
three predefined file descriptors with their usual meanings from C:
`io.stdin`, `io.stdout`, and `io.stderr`.
The I/O library never closes these files.

Unless otherwise stated,
all I/O functions return **nil** on failure
(plus an error message as a second result and
a system-dependent error code as a third result)
and some value different from **nil** on success.

## `io.close ([file])`

Equivalent to `file:close()`.
Without a `file`, closes the default output file.

## `io.flush ()`

Equivalent to `file:flush` over the default output file.

## `io.input ([file])`

When called with a file name, it opens the named file (in text mode),
and sets its handle as the default input file.
When called with a file handle,
it simply sets this file handle as the default input file.
When called without parameters,
it returns the current default input file.

In case of errors this function raises the error,
instead of returning an error code.

## `io.lines ([filename])`

Opens the given file name in read mode
and returns an iterator function that,
each time it is called,
returns a new line from the file.
Therefore, the construction

```lua
for line in io.lines(filename) do <body> end
```

will iterate over all lines of the file.
When the iterator function detects the end of file,
it returns **nil** (to finish the loop) and automatically closes the file.

The call `io.lines()` (with no file name) is equivalent
to `io.input():lines()`;
that is, it iterates over the lines of the default input file.
In this case it does not close the file when the loop ends.

## `io.open (filename [, mode])`

This function opens a file,
in the mode specified in the string `mode`.
It returns a new file handle,
or, in case of errors, **nil** plus an error message.

The `mode` string can be any of the following:

- **"r":** read mode (the default);
- **"w":** write mode;
- **"a":** append mode;
- **"r+":** update mode, all previous data is preserved;
- **"w+":** update mode, all previous data is erased;
- **"a+":** append update mode, previous data is preserved,
  writing is only allowed at the end of file.

The `mode` string can also have a '`b`' at the end,
which is needed in some systems to open the file in binary mode.
This string is exactly what is used in the
standard C function `fopen`.

## `io.output ([file])`

Similar to `io.input`, but operates over the default output file.

## `io.popen (prog [, mode])`

Starts program `prog` in a separated process and returns
a file handle that you can use to read data from this program
(if `mode` is `"r"`, the default)
or to write data to this program
(if `mode` is `"w"`).

This function is system dependent and is not available
on all platforms.

## `io.read (...)`

Equivalent to `io.input():read`.

## `io.tmpfile ()`

Returns a handle for a temporary file.
This file is opened in update mode
and it is automatically removed when the program ends.

## `io.type (obj)`

Checks whether `obj` is a valid file handle.
Returns the string `"file"` if `obj` is an open file handle,
`"closed file"` if `obj` is a closed file handle,
or **nil** if `obj` is not a file handle.

## `io.write (...)`

Equivalent to `io.output():write`.

## `file:close ()`

Closes `file`.
Note that files are automatically closed when
their handles are garbage collected,
but that takes an unpredictable amount of time to happen.

## `file:flush ()`

Saves any written data to `file`.

## `file:lines ()`

Returns an iterator function that,
each time it is called,
returns a new line from the file.
Therefore, the construction

```lua
for line in file:lines() do <body> end
```

will iterate over all lines of the file.
(Unlike `io.lines`, this function does not close the file
when the loop ends.)

## `file:read (...)`

Reads the file `file`,
according to the given formats, which specify what to read.
For each format,
the function returns a string (or a number) with the characters read,
or **nil** if it cannot read data with the specified format.
When called without formats,
it uses a default format that reads the entire next line
(see below).

The available formats are

- **"\*n":**
  reads a number;
  this is the only format that returns a number instead of a string.

- **"\*a":**
  reads the whole file, starting at the current position.
  On end of file, it returns the empty string.

- **"\*l":**
  reads the next line (skipping the end of line),
  returning **nil** on end of file.
  This is the default format.

- **_number_:**
  reads a string with up to this number of characters,
  returning **nil** on end of file.
  If number is zero,
  it reads nothing and returns an empty string,
  or **nil** on end of file.

## `file:seek ([whence] [, offset])`

Sets and gets the file position,
measured from the beginning of the file,
to the position given by `offset` plus a base
specified by the string `whence`, as follows:

- **"set":** base is position 0 (beginning of the file);
- **"cur":** base is current position;
- **"end":** base is end of file;

In case of success, function `seek` returns the final file position,
measured in bytes from the beginning of the file.
If this function fails, it returns **nil**,
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

Sets the buffering mode for an output file.
There are three available modes:

- **"no":**
  no buffering; the result of any output operation appears immediately.

- **"full":**
  full buffering; output operation is performed only
  when the buffer is full (or when you explicitly `flush` the file
  (see `io.flush`)).

- **"line":**
  line buffering; output is buffered until a newline is output
  or there is any input from some special files
  (such as a terminal device).

For the last two cases, `size`
specifies the size of the buffer, in bytes.
The default is an appropriate size.

## `file:write (...)`

Writes the value of each of its arguments to
the `file`.
The arguments must be strings or numbers.
To write other values,
use `tostring` or `string.format` before `write`.
