---
sidebar_position: 1
---

Here we list all functions from the auxiliary library
in alphabetical order.

## `luaL_Buffer`

```c
typedef struct luaL_Buffer luaL_Buffer;
```

Type for a _string buffer_.

A string buffer allows C code to build Lua strings piecemeal.
Its pattern of use is as follows:

- First declare a variable `b` of type `luaL_Buffer`.

- Then initialize it with a call `luaL_buffinit(L, &b)`.

- Then add string pieces to the buffer calling any of
  the `luaL_add*` functions.

- Finish by calling `luaL_pushresult(&b)`.
  This call leaves the final string on the top of the stack.

If you know beforehand the maximum size of the resulting string,
you can use the buffer like this:

- First declare a variable `b` of type `luaL_Buffer`.

- Then initialize it and preallocate a space of
  size `sz` with a call `luaL_buffinitsize(L, &b, sz)`.

- Then produce the string into that space.

- Finish by calling `luaL_pushresultsize(&b, sz)`,
  where `sz` is the total size of the resulting string
  copied into that space (which may be less than or
  equal to the preallocated size).

During its normal operation,
a string buffer uses a variable number of stack slots.
So, while using a buffer, you cannot assume that you know where
the top of the stack is.
You can use the stack between successive calls to buffer operations
as long as that use is balanced;
that is,
when you call a buffer operation,
the stack is at the same level
it was immediately after the previous buffer operation.
(The only exception to this rule is `luaL_addvalue`.)
After calling `luaL_pushresult`,
the stack is back to its level when the buffer was initialized,
plus the final string on its top.

## `luaL_Reg`

```c
typedef struct luaL_Reg {
  const char *name;
  lua_CFunction func;
} luaL_Reg;
```

Type for arrays of functions to be registered by
`luaL_setfuncs`.
`name` is the function name and `func` is a pointer to
the function.
Any array of `luaL_Reg` must end with a sentinel entry
in which both `name` and `func` are `NULL`.

## `luaL_Stream`

```c
typedef struct luaL_Stream {
  FILE *f;
  lua_CFunction closef;
} luaL_Stream;
```

The standard representation for file handles
used by the standard I/O library.

A file handle is implemented as a full userdata,
with a metatable called `LUA_FILEHANDLE`
(where `LUA_FILEHANDLE` is a macro with the actual metatable's name).
The metatable is created by the I/O library
(see `luaL_newmetatable`).

This userdata must start with the structure `luaL_Stream`;
it can contain other data after this initial structure.
The field `f` points to the corresponding C stream
(or it can be `NULL` to indicate an incompletely created handle).
The field `closef` points to a Lua function
that will be called to close the stream
when the handle is closed or collected;
this function receives the file handle as its sole argument and
must return either a true value, in case of success,
or a false value plus an error message, in case of error.
Once Lua calls this field,
it changes the field value to `NULL`
to signal that the handle is closed.
