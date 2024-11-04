---
sidebar_position: 1
---

The basic library provides some core functions to Lua.
If you do not include this library in your application,
you should check carefully whether you need to provide
implementations for some of its facilities.

## `assert (v [, message])`

Issues an error when
the value of its argument `v` is false (i.e., **nil** or **false**);
otherwise, returns all its arguments.
`message` is an error message;
when absent, it defaults to "assertion failed!"

## `collectgarbage ([opt [, arg]])`

This function is a generic interface to the garbage collector.
It performs different functions according to its first argument, `opt`:

- **"collect":**
  performs a full garbage-collection cycle.
  This is the default option.

- **"stop":**
  stops the garbage collector.

- **"restart":**
  restarts the garbage collector.

- **"count":**
  returns the total memory in use by Lua (in Kbytes).

- **"step":**
  performs a garbage-collection step.
  The step "size" is controlled by `arg`
  (larger values mean more steps) in a non-specified way.
  If you want to control the step size
  you must experimentally tune the value of `arg`.
  Returns **true** if the step finished a collection cycle.

- **"setpause":**
  sets `arg` as the new value for the _pause_ of
  the collector.
  Returns the previous value for _pause_.

- **"setstepmul":**
  sets `arg` as the new value for the _step multiplier_ of
  the collector.
  Returns the previous value for _step_.

## `dofile ([filename])`

Opens the named file and executes its contents as a Lua chunk.
When called without arguments,
`dofile` executes the contents of the standard input (`stdin`).
Returns all values returned by the chunk.
In case of errors, `dofile` propagates the error
to its caller (that is, `dofile` does not run in protected mode).

## `error (message [, level])`

Terminates the last protected function called
and returns `message` as the error message.
Function `error` never returns.

Usually, `error` adds some information about the error position
at the beginning of the message.
The `level` argument specifies how to get the error position.
With level 1 (the default), the error position is where the
`error` function was called.
Level 2 points the error to where the function
that called `error` was called; and so on.
Passing a level 0 avoids the addition of error position information
to the message.

## `_G`

A global variable (not a function) that
holds the global environment (that is, `_G._G = _G`).
Lua itself does not use this variable;
changing its value does not affect any environment,
nor vice-versa.
(Use `setfenv` to change environments.)

## `getfenv ([f])`

Returns the current environment in use by the function.
`f` can be a Lua function or a number
that specifies the function at that stack level:
Level 1 is the function calling `getfenv`.
If the given function is not a Lua function,
or if `f` is 0,
`getfenv` returns the global environment.
The default for `f` is 1.

## `getmetatable (object)`

If `object` does not have a metatable, returns **nil**.
Otherwise,
if the object's metatable has a `"__metatable"` field,
returns the associated value.
Otherwise, returns the metatable of the given object.

## `ipairs (t)`

Returns three values: an iterator function, the table `t`, and 0,
so that the construction

```lua
for i,v in ipairs(t) do <body> end
```

will iterate over the pairs (`1,t[1]`), (`2,t[2]`), ...,
up to the first integer key absent from the table.

## `load (func [, chunkname])`

Loads a chunk using function `func` to get its pieces.
Each call to `func` must return a string that concatenates
with previous results.
A return of an empty string, **nil**, or no value signals the end of the chunk.

If there are no errors,
returns the compiled chunk as a function;
otherwise, returns **nil** plus the error message.
The environment of the returned function is the global environment.

`chunkname` is used as the chunk name for error messages
and debug information.
When absent,
it defaults to "`=(load)`".

## `loadfile ([filename])`

Similar to `load`,
but gets the chunk from file `filename`
or from the standard input,
if no file name is given.

## `loadstring (string [, chunkname])`

Similar to `load`,
but gets the chunk from the given string.

To load and run a given string, use the idiom

```lua
assert(loadstring(s))()
```

When absent,
`chunkname` defaults to the given string.

## `next (table [, index])`

Allows a program to traverse all fields of a table.
Its first argument is a table and its second argument
is an index in this table.
`next` returns the next index of the table
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
(To traverse a table in numeric order,
use a numerical **for ** or the `ipairs` function.)

The behavior of `next` is _undefined_ if,
during the traversal,
you assign any value to a non-existent field in the table.
You may however modify existing fields.
In particular, you may clear existing fields.

## `pairs (t)`

Returns three values: the `next` function, the table `t`, and **nil**,
so that the construction

```lua
for k,v in pairs(t) do <body> end
```

will iterate over all key-value pairs of table `t`.

See function `next` for the caveats of modifying
the table during its traversal.

## `pcall (f, arg1, ...)`

Calls function `f` with
the given arguments in _protected mode_.
This means that any error inside `f` is not propagated;
instead, `pcall` catches the error
and returns a status code.
Its first result is the status code (a boolean),
which is true if the call succeeds without errors.
In such case, `pcall` also returns all results from the call,
after this first result.
In case of any error, `pcall` returns **false** plus the error message.

## `print (...)`

Receives any number of arguments,
and prints their values to `stdout`,
using the `tostring` function to convert them to strings.
`print` is not intended for formatted output,
but only as a quick way to show a value,
typically for debugging.
For formatted output, use `string.format`.

## `rawequal (v1, v2)`

Checks whether `v1` is equal to `v2`,
without invoking any metamethod.
Returns a boolean.

## `rawget (table, index)`

Gets the real value of `table[index]`,
without invoking any metamethod.
`table` must be a table;
`index` may be any value.

## `rawset (table, index, value)`

Sets the real value of `table[index]` to `value`,
without invoking any metamethod.
`table` must be a table,
`index` any value different from **nil**,
and `value` any Lua value.

This function returns `table`.

## `select (index, ...)`

If `index` is a number,
returns all arguments after argument number `index`.
Otherwise, `index` must be the string `"#"`,
and `select` returns the total number of extra arguments it received.

## `setfenv (f, table)`

Sets the environment to be used by the given function.
`f` can be a Lua function or a number
that specifies the function at that stack level:
Level 1 is the function calling `setfenv`.
`setfenv` returns the given function.

As a special case, when `f` is 0 `setfenv` changes
the environment of the running thread.
In this case, `setfenv` returns no values.

## `setmetatable (table, metatable)`

Sets the metatable for the given table.
(You cannot change the metatable of other types from Lua, only from C.)
If `metatable` is **nil**,
removes the metatable of the given table.
If the original metatable has a `"__metatable"` field,
raises an error.

This function returns `table`.

## `tonumber (e [, base])`

Tries to convert its argument to a number.
If the argument is already a number or a string convertible
to a number, then `tonumber` returns this number;
otherwise, it returns **nil**.

An optional argument specifies the base to interpret the numeral.
The base may be any integer between 2 and 36, inclusive.
In bases above 10, the letter '`A`' (in either upper or lower case)
represents 10, '`B`' represents 11, and so forth,
with '`Z`' representing 35.
In base 10 (the default), the number can have a decimal part,
as well as an optional exponent part.
In other bases, only unsigned integers are accepted.

## `tostring (e)`

Receives an argument of any type and
converts it to a string in a reasonable format.
For complete control of how numbers are converted,
use `string.format`.

If the metatable of `e` has a `"__tostring"` field,
then `tostring` calls the corresponding value
with `e` as argument,
and uses the result of the call as its result.

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

## `unpack (list [, i [, j]])`

Returns the elements from the given table.
This function is equivalent to

```lua
return list[i], list[i+1], ..., list[j]
```

except that the above code can be written only for a fixed number
of elements.
By default, `i` is 1 and `j` is the length of the list,
as defined by the length operator.

## `_VERSION`

A global variable (not a function) that
holds a string containing the current interpreter version.
The current contents of this variable is "`Lua 5.1`".

## `xpcall (f, err)`

This function is similar to `pcall`,
except that you can set a new error handler.

`xpcall` calls function `f` in protected mode,
using `err` as the error handler.
Any error inside `f` is not propagated;
instead, `xpcall` catches the error,
calls the `err` function with the original error object,
and returns a status code.
Its first result is the status code (a boolean),
which is true if the call succeeds without errors.
In this case, `xpcall` also returns all results from the call,
after this first result.
In case of any error,
`xpcall` returns **false** plus the result from `err`.
