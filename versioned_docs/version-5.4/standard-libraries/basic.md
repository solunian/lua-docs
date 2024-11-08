---
sidebar_position: 1
---

The basic library provides core functions to Lua.
If you do not include this library in your application,
you should check carefully whether you need to provide
implementations for some of its facilities.

## `assert (v [, message])`

Raises an error if
the value of its argument `v` is false (i.e., **nil** or **false**);
otherwise, returns all its arguments.
In case of error,
`message` is the error object;
when absent, it defaults to "`assertion failed!`"

## `collectgarbage ([opt [, arg]])`

This function is a generic interface to the garbage collector.
It performs different functions according to its first argument, `opt`:

- **"`collect`":**
  Performs a full garbage-collection cycle.
  This is the default option.

- **"`stop`":**
  Stops automatic execution of the garbage collector.
  The collector will run only when explicitly invoked,
  until a call to restart it.

- **"`restart`":**
  Restarts automatic execution of the garbage collector.

- **"`count`":**
  Returns the total memory in use by Lua in Kbytes.
  The value has a fractional part,
  so that it multiplied by 1024
  gives the exact number of bytes in use by Lua.

- **"`step`":**
  Performs a garbage-collection step.
  The step "size" is controlled by `arg`.
  With a zero value,
  the collector will perform one basic (indivisible) step.
  For non-zero values,
  the collector will perform as if that amount of memory
  (in Kbytes) had been allocated by Lua.
  Returns **true** if the step finished a collection cycle.

- **"`isrunning`":**
  Returns a boolean that tells whether the collector is running
  (i.e., not stopped).

- **"`incremental`":**
  Change the collector mode to incremental.
  This option can be followed by three numbers:
  the garbage-collector pause,
  the step multiplier,
  and the step size.
  A zero means to not change that value.

- **"`generational`":**
  Change the collector mode to generational.
  This option can be followed by two numbers:
  the garbage-collector minor multiplier
  and the major multiplier.
  A zero means to not change that value.

This function should not be called by a finalizer.

## `dofile ([filename])`

Opens the named file and executes its content as a Lua chunk.
When called without arguments,
`dofile` executes the content of the standard input (`stdin`).
Returns all values returned by the chunk.
In case of errors, `dofile` propagates the error
to its caller.
(That is, `dofile` does not run in protected mode.)

## `error (message [, level])`

Raises an error with `message` as the error object.
This function never returns.

Usually, `error` adds some information about the error position
at the beginning of the message, if the message is a string.
The `level` argument specifies how to get the error position.
With level 1 (the default), the error position is where the
`error` function was called.
Level 2 points the error to where the function
that called `error` was called; and so on.
Passing a level 0 avoids the addition of error position information
to the message.

## `_G`

A global variable (not a function) that
holds the global environment.
Lua itself does not use this variable;
changing its value does not affect any environment,
nor vice versa.

## `getmetatable (object)`

If `object` does not have a metatable, returns **nil**.
Otherwise,
if the object's metatable has a `__metatable` field,
returns the associated value.
Otherwise, returns the metatable of the given object.

## `ipairs (t)`

Returns three values (an iterator function, the table `t`, and 0)
so that the construction

```lua
for i,v in ipairs(t) do <body> end
```

will iterate over the key-value pairs
(`1,t[1]`), (`2,t[2]`), ...,
up to the first absent index.

## `load (chunk [, chunkname [, mode [, env]]])`

Loads a chunk.

If `chunk` is a string, the chunk is this string.
If `chunk` is a function,
`load` calls it repeatedly to get the chunk pieces.
Each call to `chunk` must return a string that concatenates
with previous results.
A return of an empty string, **nil**, or no value signals the end of the chunk.

If there are no syntactic errors,
`load` returns the compiled chunk as a function;
otherwise, it returns **fail** plus the error message.

When you load a main chunk,
the resulting function will always have exactly one upvalue,
the `_ENV` variable.
However,
when you load a binary chunk created from a function (see `string.dump`),
the resulting function can have an arbitrary number of upvalues,
and there is no guarantee that its first upvalue will be
the `_ENV` variable.
(A non-main function may not even have an `_ENV` upvalue.)

Regardless, if the resulting function has any upvalues,
its first upvalue is set to the value of `env`,
if that parameter is given,
or to the value of the global environment.
Other upvalues are initialized with **nil**.
All upvalues are fresh, that is,
they are not shared with any other function.

`chunkname` is used as the name of the chunk for error messages
and debug information.
When absent,
it defaults to `chunk`, if `chunk` is a string,
or to "`=(load)`" otherwise.

The string `mode` controls whether the chunk can be text or binary
(that is, a precompiled chunk).
It may be the string "`b`" (only binary chunks),
"`t`" (only text chunks),
or "`bt`" (both binary and text).
The default is "`bt`".

It is safe to load malformed binary chunks;
`load` signals an appropriate error.
However,
Lua does not check the consistency of the code inside binary chunks;
running maliciously crafted bytecode can crash the interpreter.

## `loadfile ([filename [, mode [, env]]])`

Similar to `load`,
but gets the chunk from file `filename`
or from the standard input,
if no file name is given.

## `next (table [, index])`

Allows a program to traverse all fields of a table.
Its first argument is a table and its second argument
is an index in this table.
A call to `next` returns the next index of the table
and its associated value.
When called with **nil** as its second argument,
`next` returns an initial index
and its associated value.
When called with the last index,
or with **nil** in an empty table,
`next` returns **nil**.
If the second argument is absent, then it is interpreted as **nil**.
In particular,
you can use `next(t)` to check whether a table is empty.

The order in which the indices are enumerated is not specified,
_even for numeric indices_.
(To traverse a table in numerical order,
use a numerical **for**.)

You should not assign any value to a non-existent field in a table
during its traversal.
You may however modify existing fields.
In particular, you may set existing fields to nil.

## `pairs (t)`

If `t` has a metamethod `__pairs`,
calls it with `t` as argument and returns the first three
results from the call.

Otherwise,
returns three values: the `next` function, the table `t`, and **nil**,
so that the construction

```lua
for k,v in pairs(t) do <body> end
```

will iterate over all key-value pairs of table `t`.

See function `next` for the caveats of modifying
the table during its traversal.

## `pcall (f [, arg1, ...])`

Calls the function `f` with
the given arguments in _protected mode_.
This means that any error inside `f` is not propagated;
instead, `pcall` catches the error
and returns a status code.
Its first result is the status code (a boolean),
which is **true** if the call succeeds without errors.
In such case, `pcall` also returns all results from the call,
after this first result.
In case of any error, `pcall` returns **false** plus the error object.
Note that errors caught by `pcall` do not call a message handler.

## `print (...)`

Receives any number of arguments
and prints their values to `stdout`,
converting each argument to a string
following the same rules of `tostring`.

The function `print` is not intended for formatted output,
but only as a quick way to show a value,
for instance for debugging.
For complete control over the output,
use `string.format` and `io.write`.

## `rawequal (v1, v2)`

Checks whether `v1` is equal to `v2`,
without invoking the `__eq` metamethod.
Returns a boolean.

## `rawget (table, index)`

Gets the real value of `table[index]`,
without using the `__index` metavalue.
`table` must be a table;
`index` may be any value.

## `rawlen (v)`

Returns the length of the object `v`,
which must be a table or a string,
without invoking the `__len` metamethod.
Returns an integer.

## `rawset (table, index, value)`

Sets the real value of `table[index]` to `value`,
without using the `__newindex` metavalue.
`table` must be a table,
`index` any value different from **nil** and NaN,
and `value` any Lua value.

This function returns `table`.

## `select (index, ...)`

If `index` is a number,
returns all arguments after argument number `index`;
a negative number indexes from the end (-1 is the last argument).
Otherwise, `index` must be the string `"#"`,
and `select` returns the total number of extra arguments it received.

## `setmetatable (table, metatable)`

Sets the metatable for the given table.
If `metatable` is **nil**,
removes the metatable of the given table.
If the original metatable has a `__metatable` field,
raises an error.

This function returns `table`.

To change the metatable of other types from Lua code,
you must use the debug library.

## `tonumber (e [, base])`

When called with no `base`,
`tonumber` tries to convert its argument to a number.
If the argument is already a number or
a string convertible to a number,
then `tonumber` returns this number;
otherwise, it returns **fail**.

The conversion of strings can result in integers or floats,
according to the lexical conventions of Lua.
The string may have leading and trailing spaces and a sign.

When called with `base`,
then `e` must be a string to be interpreted as
an integer numeral in that base.
The base may be any integer between 2 and 36, inclusive.
In bases above 10, the letter '`A`' (in either upper or lower case)
represents 10, '`B`' represents 11, and so forth,
with '`Z`' representing 35.
If the string `e` is not a valid numeral in the given base,
the function returns **fail**.

## `tostring (v)`

Receives a value of any type and
converts it to a string in a human-readable format.

If the metatable of `v` has a `__tostring` field,
then `tostring` calls the corresponding value
with `v` as argument,
and uses the result of the call as its result.
Otherwise, if the metatable of `v` has a `__name` field
with a string value,
`tostring` may use that string in its final result.

For complete control of how numbers are converted,
use `string.format`.

## `type (v)`

Returns the type of its only argument, coded as a string.
The possible results of this function are
"`nil`" (a string, not the value **nil**),
"`number`",
"`string`",
"`boolean`",
"`table`",
"`function`",
"`thread`",
and "`userdata`".

## `_VERSION`

A global variable (not a function) that
holds a string containing the running Lua version.
The current value of this variable is "`Lua 5.4`".

## `warn (msg1, ...)`

Emits a warning with a message composed by the concatenation
of all its arguments (which should be strings).

By convention,
a one-piece message starting with '`@`'
is intended to be a _control message_,
which is a message to the warning system itself.
In particular, the standard warning function in Lua
recognizes the control messages "`@off`",
to stop the emission of warnings,
and "`@on`", to (re)start the emission;
it ignores unknown control messages.

## `xpcall (f, msgh [, arg1, ...])`

This function is similar to `pcall`,
except that it sets a new message handler `msgh`.
