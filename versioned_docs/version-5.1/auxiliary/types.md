---
sidebar_position: 1
---

Here we list all types from the auxiliary library
in alphabetical order.

## `luaL_Buffer`

```c
typedef struct luaL_Buffer luaL_Buffer;
```

Type for a _string buffer_.

A string buffer allows C code to build Lua strings piecemeal.
Its pattern of use is as follows:

- First you declare a variable `b` of type `luaL_Buffer`.

- Then you initialize it with a call `luaL_buffinit(L, &b)`.

- Then you add string pieces to the buffer calling any of
  the `luaL_add*` functions.

- You finish by calling `luaL_pushresult(&b)`.
  This call leaves the final string on the top of the stack.

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
After calling `luaL_pushresult` the stack is back to its
level when the buffer was initialized,
plus the final string on its top.

## `luaL_Reg`

```c
typedef struct luaL_Reg {
  const char *name;
  lua_CFunction func;
} luaL_Reg;
```

Type for arrays of functions to be registered by
`luaL_register`.
`name` is the function name and `func` is a pointer to
the function.
Any array of `luaL_Reg` must end with an sentinel entry
in which both `name` and `func` are `NULL`.
