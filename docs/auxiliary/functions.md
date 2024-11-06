---
sidebar_position: 2
---

Here we list all functions from the auxiliary library
in alphabetical order.

## `luaL_addchar`

`[-?, +?, m]`

```c
void luaL_addchar (luaL_Buffer *B, char c);
```

Adds the byte `c` to the buffer `B`
(see `luaL_Buffer`).

## `luaL_addgsub`

`[-?, +?, m]`

```c
const void luaL_addgsub (luaL_Buffer *B, const char *s,
                         const char *p, const char *r);
```

Adds a copy of the string `s` to the buffer `B` (see `luaL_Buffer`),
replacing any occurrence of the string `p`
with the string `r`.

## `luaL_addlstring`

`[-?, +?, m]`

```c
void luaL_addlstring (luaL_Buffer *B, const char *s, size_t l);
```

Adds the string pointed to by `s` with length `l` to
the buffer `B`
(see `luaL_Buffer`).
The string can contain embedded zeros.

## `luaL_addsize`

`[-?, +?, -]`

```c
void luaL_addsize (luaL_Buffer *B, size_t n);
```

Adds to the buffer `B`
a string of length `n` previously copied to the
buffer area (see `luaL_prepbuffer`).

## `luaL_addstring`

`[-?, +?, m]`

```c
void luaL_addstring (luaL_Buffer *B, const char *s);
```

Adds the zero-terminated string pointed to by `s`
to the buffer `B`
(see `luaL_Buffer`).

## `luaL_addvalue`

`[-?, +?, m]`

```c
void luaL_addvalue (luaL_Buffer *B);
```

Adds the value on the top of the stack
to the buffer `B`
(see `luaL_Buffer`).
Pops the value.

This is the only function on string buffers that can (and must)
be called with an extra element on the stack,
which is the value to be added to the buffer.

## `luaL_argcheck`

`[-0, +0, v]`

```c
void luaL_argcheck (lua_State *L,
                    int cond,
                    int arg,
                    const char *extramsg);
```

Checks whether `cond` is true.
If it is not, raises an error with a standard message (see `luaL_argerror`).

## `luaL_argerror`

`[-0, +0, v]`

```c
int luaL_argerror (lua_State *L, int arg, const char *extramsg);
```

Raises an error reporting a problem with argument `arg`
of the C function that called it,
using a standard message
that includes `extramsg` as a comment:

```c
bad argument #<arg> to '<funcname>' (<extramsg>)
```

This function never returns.

## `luaL_argexpected`

`[-0, +0, v]`

```c
void luaL_argexpected (lua_State *L,
                       int cond,
                       int arg,
                       const char *tname);
```

Checks whether `cond` is true.
If it is not, raises an error about the type of the argument `arg`
with a standard message (see `luaL_typeerror`).

## `luaL_buffaddr`

`[-0, +0, -]`

```c
char *luaL_buffaddr (luaL_Buffer *B);
```

Returns the address of the current content of buffer `B`
(see `luaL_Buffer`).
Note that any addition to the buffer may invalidate this address.

## `luaL_buffinit`

`[-0, +?, -]`

```c
void luaL_buffinit (lua_State *L, luaL_Buffer *B);
```

Initializes a buffer `B`
(see `luaL_Buffer`).
This function does not allocate any space;
the buffer must be declared as a variable.

## `luaL_bufflen`

`[-0, +0, -]`

```c
size_t luaL_bufflen (luaL_Buffer *B);
```

Returns the length of the current content of buffer `B`
(see `luaL_Buffer`).

## `luaL_buffinitsize`

`[-?, +?, m]`

```c
char *luaL_buffinitsize (lua_State *L, luaL_Buffer *B, size_t sz);
```

Equivalent to the sequence
`luaL_buffinit`, `luaL_prepbuffsize`.

## `luaL_buffsub`

`[-?, +?, -]`

```c
void luaL_buffsub (luaL_Buffer *B, int n);
```

Removes `n` bytes from the buffer `B`
(see `luaL_Buffer`).
The buffer must have at least that many bytes.

## `luaL_callmeta`

`[-0, +(0|1), e]`

```c
int luaL_callmeta (lua_State *L, int obj, const char *e);
```

Calls a metamethod.

If the object at index `obj` has a metatable and this
metatable has a field `e`,
this function calls this field passing the object as its only argument.
In this case this function returns true and pushes onto the
stack the value returned by the call.
If there is no metatable or no metamethod,
this function returns false without pushing any value on the stack.

## `luaL_checkany`

`[-0, +0, v]`

```c
void luaL_checkany (lua_State *L, int arg);
```

Checks whether the function has an argument
of any type (including **nil**) at position `arg`.

## `luaL_checkinteger`

`[-0, +0, v]`

```c
lua_Integer luaL_checkinteger (lua_State *L, int arg);
```

Checks whether the function argument `arg` is an integer
(or can be converted to an integer)
and returns this integer.

## `luaL_checklstring`

`[-0, +0, v]`

```c
const char *luaL_checklstring (lua_State *L, int arg, size_t *l);
```

Checks whether the function argument `arg` is a string
and returns this string;
if `l` is not `NULL` fills its referent
with the string's length.

This function uses `lua_tolstring` to get its result,
so all conversions and caveats of that function apply here.

## `luaL_checknumber`

`[-0, +0, v]`

```c
lua_Number luaL_checknumber (lua_State *L, int arg);
```

Checks whether the function argument `arg` is a number
and returns this number converted to a `lua_Number`.

## `luaL_checkoption`

`[-0, +0, v]`

```c
int luaL_checkoption (lua_State *L,
                      int arg,
                      const char *def,
                      const char *const lst[]);
```

Checks whether the function argument `arg` is a string and
searches for this string in the array `lst`
(which must be NULL-terminated).
Returns the index in the array where the string was found.
Raises an error if the argument is not a string or
if the string cannot be found.

If `def` is not `NULL`,
the function uses `def` as a default value when
there is no argument `arg` or when this argument is **nil**.

This is a useful function for mapping strings to C enums.
(The usual convention in Lua libraries is
to use strings instead of numbers to select options.)

## `luaL_checkstack`

`[-0, +0, v]`

```c
void luaL_checkstack (lua_State *L, int sz, const char *msg);
```

Grows the stack size to `top + sz` elements,
raising an error if the stack cannot grow to that size.
`msg` is an additional text to go into the error message
(or `NULL` for no additional text).

## `luaL_checkstring`

`[-0, +0, v]`

```c
const char *luaL_checkstring (lua_State *L, int arg);
```

Checks whether the function argument `arg` is a string
and returns this string.

This function uses `lua_tolstring` to get its result,
so all conversions and caveats of that function apply here.

## `luaL_checktype`

`[-0, +0, v]`

```c
void luaL_checktype (lua_State *L, int arg, int t);
```

Checks whether the function argument `arg` has type `t`.
See `lua_type` for the encoding of types for `t`.

## `luaL_checkudata`

`[-0, +0, v]`

```c
void *luaL_checkudata (lua_State *L, int arg, const char *tname);
```

Checks whether the function argument `arg` is a userdata
of the type `tname` (see `luaL_newmetatable`) and
returns the userdata's memory-block address (see `lua_touserdata`).

## `luaL_checkversion`

`[-0, +0, v]`

```c
void luaL_checkversion (lua_State *L);
```

Checks whether the code making the call and the Lua library being called
are using the same version of Lua and the same numeric types.

## `luaL_dofile`

`[-0, +?, m]`

```c
int luaL_dofile (lua_State *L, const char *filename);
```

Loads and runs the given file.
It is defined as the following macro:

```c
(luaL_loadfile(L, filename) || lua_pcall(L, 0, LUA_MULTRET, 0))
```

It returns 0 (`LUA_OK`) if there are no errors,
or 1 in case of errors.

## `luaL_dostring`

`[-0, +?, -]`

```c
int luaL_dostring (lua_State *L, const char *str);
```

Loads and runs the given string.
It is defined as the following macro:

```c
(luaL_loadstring(L, str) || lua_pcall(L, 0, LUA_MULTRET, 0))
```

It returns 0 (`LUA_OK`) if there are no errors,
or 1 in case of errors.

## `luaL_error`

`[-0, +0, v]`

```c
int luaL_error (lua_State *L, const char *fmt, ...);
```

Raises an error.
The error message format is given by `fmt`
plus any extra arguments,
following the same rules of `lua_pushfstring`.
It also adds at the beginning of the message the file name and
the line number where the error occurred,
if this information is available.

This function never returns,
but it is an idiom to use it in C functions
as `return luaL_error(args)`.

## `luaL_execresult`

`[-0, +3, m]`

```c
int luaL_execresult (lua_State *L, int stat);
```

This function produces the return values for
process-related functions in the standard library
(`os.execute` and `io.close`).

## `luaL_fileresult`

`[-0, +(1|3), m]`

```c
int luaL_fileresult (lua_State *L, int stat, const char *fname);
```

This function produces the return values for
file-related functions in the standard library
(`io.open`, `os.rename`, `file:seek`, etc.).

## `luaL_getmetafield`

`[-0, +(0|1), m]`

```c
int luaL_getmetafield (lua_State *L, int obj, const char *e);
```

Pushes onto the stack the field `e` from the metatable
of the object at index `obj` and returns the type of the pushed value.
If the object does not have a metatable,
or if the metatable does not have this field,
pushes nothing and returns `LUA_TNIL`.

## `luaL_getmetatable`

`[-0, +1, m]`

```c
int luaL_getmetatable (lua_State *L, const char *tname);
```

Pushes onto the stack the metatable associated with the name `tname`
in the registry (see `luaL_newmetatable`),
or **nil** if there is no metatable associated with that name.
Returns the type of the pushed value.

## `luaL_getsubtable`

`[-0, +1, e]`

```c
int luaL_getsubtable (lua_State *L, int idx, const char *fname);
```

Ensures that the value `t[fname]`,
where `t` is the value at index `idx`,
is a table,
and pushes that table onto the stack.
Returns true if it finds a previous table there
and false if it creates a new table.

## `luaL_gsub`

`[-0, +1, m]`

```c
const char *luaL_gsub (lua_State *L,
                       const char *s,
                       const char *p,
                       const char *r);
```

Creates a copy of string `s`,
replacing any occurrence of the string `p`
with the string `r`.
Pushes the resulting string on the stack and returns it.

## `luaL_len`

`[-0, +0, e]`

```c
lua_Integer luaL_len (lua_State *L, int index);
```

Returns the "length" of the value at the given index
as a number;
it is equivalent to the '`#`' operator in Lua.
Raises an error if the result of the operation is not an integer.
(This case can only happen through metamethods.)

## `luaL_loadbuffer`

`[-0, +1, -]`

```c
int luaL_loadbuffer (lua_State *L,
                     const char *buff,
                     size_t sz,
                     const char *name);
```

Equivalent to `luaL_loadbufferx` with `mode` equal to `NULL`.

## `luaL_loadbufferx`

`[-0, +1, -]`

```c
int luaL_loadbufferx (lua_State *L,
                      const char *buff,
                      size_t sz,
                      const char *name,
                      const char *mode);
```

Loads a buffer as a Lua chunk.
This function uses `lua_load` to load the chunk in the
buffer pointed to by `buff` with size `sz`.

This function returns the same results as `lua_load`.
`name` is the chunk name,
used for debug information and error messages.
The string `mode` works as in the function `lua_load`.

## `luaL_loadfile`

`[-0, +1, m]`

```c
int luaL_loadfile (lua_State *L, const char *filename);
```

Equivalent to `luaL_loadfilex` with `mode` equal to `NULL`.

## `luaL_loadfilex`

`[-0, +1, m]`

```c
int luaL_loadfilex (lua_State *L, const char *filename,
                                            const char *mode);
```

Loads a file as a Lua chunk.
This function uses `lua_load` to load the chunk in the file
named `filename`.
If `filename` is `NULL`,
then it loads from the standard input.
The first line in the file is ignored if it starts with a `#`.

The string `mode` works as in the function `lua_load`.

This function returns the same results as `lua_load`
or `LUA_ERRFILE` for file-related errors.

As `lua_load`, this function only loads the chunk;
it does not run it.

## `luaL_loadstring`

`[-0, +1, -]`

```c
int luaL_loadstring (lua_State *L, const char *s);
```

Loads a string as a Lua chunk.
This function uses `lua_load` to load the chunk in
the zero-terminated string `s`.

This function returns the same results as `lua_load`.

Also as `lua_load`, this function only loads the chunk;
it does not run it.

## `luaL_newlib`

`[-0, +1, m]`

```c
void luaL_newlib (lua_State *L, const luaL_Reg l[]);
```

Creates a new table and registers there
the functions in the list `l`.

It is implemented as the following macro:

```c
(luaL_newlibtable(L,l), luaL_setfuncs(L,l,0))
```

The array `l` must be the actual array,
not a pointer to it.

## `luaL_newlibtable`

`[-0, +1, m]`

```c
void luaL_newlibtable (lua_State *L, const luaL_Reg l[]);
```

Creates a new table with a size optimized
to store all entries in the array `l`
(but does not actually store them).
It is intended to be used in conjunction with `luaL_setfuncs`
(see `luaL_newlib`).

It is implemented as a macro.
The array `l` must be the actual array,
not a pointer to it.

## `luaL_newmetatable`

`[-0, +1, m]`

```c
int luaL_newmetatable (lua_State *L, const char *tname);
```

If the registry already has the key `tname`,
returns 0.
Otherwise,
creates a new table to be used as a metatable for userdata,
adds to this new table the pair `__name = tname`,
adds to the registry the pair `[tname] = new table`,
and returns 1.

In both cases,
the function pushes onto the stack the final value associated
with `tname` in the registry.

## `luaL_newstate`

`[-0, +0, -]`

```c
lua_State *luaL_newstate (void);
```

Creates a new Lua state.
It calls `lua_newstate` with an
allocator based on the ISO C allocation functions
and then sets a warning function and a panic function
that print messages to the standard error output.

Returns the new state,
or `NULL` if there is a memory allocation error.

## `luaL_openlibs`

`[-0, +0, e]`

```c
void luaL_openlibs (lua_State *L);
```

Opens all standard Lua libraries into the given state.

## `luaL_opt`

`[-0, +0, -]`

```c
T luaL_opt (L, func, arg, dflt);
```

This macro is defined as follows:

```c
(lua_isnoneornil(L,(arg)) ? (dflt) : func(L,(arg)))

```

In words, if the argument `arg` is nil or absent,
the macro results in the default `dflt`.
Otherwise, it results in the result of calling `func`
with the state `L` and the argument index `arg` as
arguments.
Note that it evaluates the expression `dflt` only if needed.

## `luaL_optinteger`

`[-0, +0, v]`

```c
lua_Integer luaL_optinteger (lua_State *L,
                             int arg,
                             lua_Integer d);
```

If the function argument `arg` is an integer
(or it is convertible to an integer),
returns this integer.
If this argument is absent or is **nil**,
returns `d`.
Otherwise, raises an error.

## `luaL_optlstring`

`[-0, +0, v]`

```c
const char *luaL_optlstring (lua_State *L,
                             int arg,
                             const char *d,
                             size_t *l);
```

If the function argument `arg` is a string,
returns this string.
If this argument is absent or is **nil**,
returns `d`.
Otherwise, raises an error.

If `l` is not `NULL`,
fills its referent with the result's length.
If the result is `NULL`
(only possible when returning `d` and `d == NULL`),
its length is considered zero.

This function uses `lua_tolstring` to get its result,
so all conversions and caveats of that function apply here.

## `luaL_optnumber`

`[-0, +0, v]`

```c
lua_Number luaL_optnumber (lua_State *L, int arg, lua_Number d);
```

If the function argument `arg` is a number,
returns this number as a `lua_Number`.
If this argument is absent or is **nil**,
returns `d`.
Otherwise, raises an error.

## `luaL_optstring`

`[-0, +0, v]`

```c
const char *luaL_optstring (lua_State *L,
                            int arg,
                            const char *d);
```

If the function argument `arg` is a string,
returns this string.
If this argument is absent or is **nil**,
returns `d`.
Otherwise, raises an error.

## `luaL_prepbuffer`

`[-?, +?, m]`

```c
char *luaL_prepbuffer (luaL_Buffer *B);
```

Equivalent to `luaL_prepbuffsize`
with the predefined size `LUAL_BUFFERSIZE`.

## `luaL_prepbuffsize`

`[-?, +?, m]`

```c
char *luaL_prepbuffsize (luaL_Buffer *B, size_t sz);
```

Returns an address to a space of size `sz`
where you can copy a string to be added to buffer `B`
(see `luaL_Buffer`).
After copying the string into this space you must call
`luaL_addsize` with the size of the string to actually add
it to the buffer.

## `luaL_pushfail`

`[-0, +1, -]`

```c
void luaL_pushfail (lua_State *L);
```

Pushes the **fail** value onto the stack.

## `luaL_pushresult`

`[-?, +1, m]`

```c
void luaL_pushresult (luaL_Buffer *B);
```

Finishes the use of buffer `B` leaving the final string on
the top of the stack.

## `luaL_pushresultsize`

`[-?, +1, m]`

```c
void luaL_pushresultsize (luaL_Buffer *B, size_t sz);
```

Equivalent to the sequence `luaL_addsize`, `luaL_pushresult`.

## `luaL_ref`

`[-1, +0, m]`

```c
int luaL_ref (lua_State *L, int t);
```

Creates and returns a _reference_,
in the table at index `t`,
for the object on the top of the stack (and pops the object).

A reference is a unique integer key.
As long as you do not manually add integer keys into the table `t`,
`luaL_ref` ensures the uniqueness of the key it returns.
You can retrieve an object referred by the reference `r`
by calling `lua_rawgeti(L, t, r)`.
The function `luaL_unref` frees a reference.

If the object on the top of the stack is **nil**,
`luaL_ref` returns the constant `LUA_REFNIL`.
The constant `LUA_NOREF` is guaranteed to be different
from any reference returned by `luaL_ref`.

## `luaL_requiref`

`[-0, +1, e]`

```c
void luaL_requiref (lua_State *L, const char *modname,
                    lua_CFunction openf, int glb);
```

If `package.loaded[modname]` is not true,
calls the function `openf` with the string `modname` as an argument
and sets the call result to `package.loaded[modname]`,
as if that function has been called through `require`.

If `glb` is true,
also stores the module into the global `modname`.

Leaves a copy of the module on the stack.

## `luaL_setfuncs`

`[-nup, +0, m]`

```c
void luaL_setfuncs (lua_State *L, const luaL_Reg *l, int nup);
```

Registers all functions in the array `l`
(see `luaL_Reg`) into the table on the top of the stack
(below optional upvalues, see next).

When `nup` is not zero,
all functions are created with `nup` upvalues,
initialized with copies of the `nup` values
previously pushed on the stack
on top of the library table.
These values are popped from the stack after the registration.

A function with a `NULL` value represents a placeholder,
which is filled with **false**.

## `luaL_setmetatable`

`[-0, +0, -]`

```c
void luaL_setmetatable (lua_State *L, const char *tname);
```

Sets the metatable of the object on the top of the stack
as the metatable associated with name `tname`
in the registry (see `luaL_newmetatable`).

## `luaL_testudata`

`[-0, +0, m]`

```c
void *luaL_testudata (lua_State *L, int arg, const char *tname);
```

This function works like `luaL_checkudata`,
except that, when the test fails,
it returns `NULL` instead of raising an error.

## `luaL_tolstring`

`[-0, +1, e]`

```c
const char *luaL_tolstring (lua_State *L, int idx, size_t *len);
```

Converts any Lua value at the given index to a C string
in a reasonable format.
The resulting string is pushed onto the stack and also
returned by the function.
If `len` is not `NULL`,
the function also sets `*len` with the string length.

If the value has a metatable with a `__tostring` field,
then `luaL_tolstring` calls the corresponding metamethod
with the value as argument,
and uses the result of the call as its result.

## `luaL_traceback`

`[-0, +1, m]`

```c
void luaL_traceback (lua_State *L, lua_State *L1, const char *msg,
                     int level);
```

Creates and pushes a traceback of the stack `L1`.
If `msg` is not `NULL`, it is appended
at the beginning of the traceback.
The `level` parameter tells at which level
to start the traceback.

## `luaL_typeerror`

`[-0, +0, v]`

```c
int luaL_typeerror (lua_State *L, int arg, const char *tname);
```

Raises a type error for the argument `arg`
of the C function that called it,
using a standard message;
`tname` is a "name" for the expected type.
This function never returns.

## `luaL_typename`

`[-0, +0, -]`

```c
const char *luaL_typename (lua_State *L, int index);
```

Returns the name of the type of the value at the given index.

## `luaL_unref`

`[-0, +0, -]`

```c
void luaL_unref (lua_State *L, int t, int ref);
```

Releases the reference `ref` from the table at index `t`
(see `luaL_ref`).
The entry is removed from the table,
so that the referred object can be collected.
The reference `ref` is also freed to be used again.

If `ref` is `LUA_NOREF` or `LUA_REFNIL`,
`luaL_unref` does nothing.

## `luaL_where`

`[-0, +1, m]`

```c
void luaL_where (lua_State *L, int lvl);
```

Pushes onto the stack a string identifying the current position
of the control at level `lvl` in the call stack.
Typically this string has the following format:

```
<chunkname>:<currentline>:
```

Level 0 is the running function,
level 1 is the function that called the running function,
etc.

This function is used to build a prefix for error messages.
