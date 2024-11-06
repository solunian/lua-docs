---
sidebar_position: 3
---

Lua has no built-in debugging facilities.
Instead, it offers a special interface
by means of functions and _hooks_.
This interface allows the construction of different
kinds of debuggers, profilers, and other tools
that need "inside information" from the interpreter.

## `lua_gethook`

`[-0, +0, -]`

```c
lua_Hook lua_gethook (lua_State *L);
```

Returns the current hook function.

## `lua_gethookcount`

`[-0, +0, -]`

```c
int lua_gethookcount (lua_State *L);
```

Returns the current hook count.

## `lua_gethookmask`

`[-0, +0, -]`

```c
int lua_gethookmask (lua_State *L);
```

Returns the current hook mask.

## `lua_getinfo`

`[-(0|1), +(0|1|2), m]`

```c
int lua_getinfo (lua_State *L, const char *what, lua_Debug *ar);
```

Gets information about a specific function or function invocation.

To get information about a function invocation,
the parameter `ar` must be a valid activation record that was
filled by a previous call to `lua_getstack` or
given as argument to a hook (see `lua_Hook`).

To get information about a function, you push it onto the stack
and start the `what` string with the character '`>`'.
(In that case,
`lua_getinfo` pops the function from the top of the stack.)
For instance, to know in which line a function `f` was defined,
you can write the following code:

```c
lua_Debug ar;
lua_getglobal(L, "f");  /* get global 'f' */
lua_getinfo(L, ">S", &ar);
printf("%d\n", ar.linedefined);
```

Each character in the string `what`
selects some fields of the structure `ar` to be filled or
a value to be pushed on the stack.
(These characters are also documented in the declaration of
the structure `lua_Debug`,
between parentheses in the comments following each field.)

- **'`f`':**
  pushes onto the stack the function that is
  running at the given level;

- **'`l`':** fills in the field `currentline`;

- **'`n`':** fills in the fields `name` and `namewhat`;

- **'`r`':** fills in the fields `ftransfer` and `ntransfer`;

- **'`S`':**
  fills in the fields `source`, `short_src`,
  `linedefined`, `lastlinedefined`, and `what`;

- **'`t`':** fills in the field `istailcall`;

- **'`u`':** fills in the fields
  `nups`, `nparams`, and `isvararg`;

- **'`L`':**
  pushes onto the stack a table whose indices are
  the lines on the function with some associated code,
  that is, the lines where you can put a break point.
  (Lines with no code include empty lines and comments.)
  If this option is given together with option '`f`',
  its table is pushed after the function.
  This is the only option that can raise a memory error.

This function returns 0 to signal an invalid option in `what`;
even then the valid options are handled correctly.

## `lua_getlocal`

`[-0, +(0|1), -]`

```c
const char *lua_getlocal (lua_State *L, const lua_Debug *ar, int n);
```

Gets information about a local variable or a temporary value
of a given activation record or a given function.

In the first case,
the parameter `ar` must be a valid activation record that was
filled by a previous call to `lua_getstack` or
given as argument to a hook (see `lua_Hook`).
The index `n` selects which local variable to inspect;
see `debug.getlocal` for details about variable indices
and names.

`lua_getlocal` pushes the variable's value onto the stack
and returns its name.

In the second case, `ar` must be `NULL` and the function
to be inspected must be on the top of the stack.
In this case, only parameters of Lua functions are visible
(as there is no information about what variables are active)
and no values are pushed onto the stack.

Returns `NULL` (and pushes nothing)
when the index is greater than
the number of active local variables.

## `lua_getstack`

`[-0, +0, -]`

```c
int lua_getstack (lua_State *L, int level, lua_Debug *ar);
```

Gets information about the interpreter runtime stack.

This function fills parts of a `lua_Debug` structure with
an identification of the _activation record_
of the function executing at a given level.
Level 0 is the current running function,
whereas level _n+1_ is the function that has called level _n_
(except for tail calls, which do not count in the stack).
When called with a level greater than the stack depth,
`lua_getstack` returns 0;
otherwise it returns 1.

## `lua_getupvalue`

`[-0, +(0|1), -]`

```c
const char *lua_getupvalue (lua_State *L, int funcindex, int n);
```

Gets information about the `n`-th upvalue
of the closure at index `funcindex`.
It pushes the upvalue's value onto the stack
and returns its name.
Returns `NULL` (and pushes nothing)
when the index `n` is greater than the number of upvalues.

See `debug.getupvalue` for more information about upvalues.

## `lua_sethook`

`[-0, +0, -]`

```c
void lua_sethook (lua_State *L, lua_Hook f, int mask, int count);
```

Sets the debugging hook function.

Argument `f` is the hook function.
`mask` specifies on which events the hook will be called:
it is formed by a bitwise OR of the constants
`LUA_MASKCALL`,
`LUA_MASKRET`,
`LUA_MASKLINE`,
and `LUA_MASKCOUNT`.
The `count` argument is only meaningful when the mask
includes `LUA_MASKCOUNT`.
For each event, the hook is called as explained below:

- **The call hook:** is called when the interpreter calls a function.
  The hook is called just after Lua enters the new function.

- **The return hook:** is called when the interpreter returns from a function.
  The hook is called just before Lua leaves the function.

- **The line hook:** is called when the interpreter is about to
  start the execution of a new line of code,
  or when it jumps back in the code (even to the same line).
  This event only happens while Lua is executing a Lua function.

- **The count hook:** is called after the interpreter executes every
  `count` instructions.
  This event only happens while Lua is executing a Lua function.

Hooks are disabled by setting `mask` to zero.

## `lua_setlocal`

`[-(0|1), +0, -]`

```c
const char *lua_setlocal (lua_State *L, const lua_Debug *ar, int n);
```

Sets the value of a local variable of a given activation record.
It assigns the value on the top of the stack
to the variable and returns its name.
It also pops the value from the stack.

Returns `NULL` (and pops nothing)
when the index is greater than
the number of active local variables.

Parameters `ar` and `n` are as in the function `lua_getlocal`.

## `lua_setupvalue`

`[-(0|1), +0, -]`

```c
const char *lua_setupvalue (lua_State *L, int funcindex, int n);
```

Sets the value of a closure's upvalue.
It assigns the value on the top of the stack
to the upvalue and returns its name.
It also pops the value from the stack.

Returns `NULL` (and pops nothing)
when the index `n` is greater than the number of upvalues.

Parameters `funcindex` and `n` are as in
the function `lua_getupvalue`.

## `lua_upvalueid`

`[-0, +0, -]`

```c
void *lua_upvalueid (lua_State *L, int funcindex, int n);
```

Returns a unique identifier for the upvalue numbered `n`
from the closure at index `funcindex`.

These unique identifiers allow a program to check whether different
closures share upvalues.
Lua closures that share an upvalue
(that is, that access a same external local variable)
will return identical ids for those upvalue indices.

Parameters `funcindex` and `n` are as in
the function `lua_getupvalue`,
but `n` cannot be greater than the number of upvalues.

## `lua_upvaluejoin`

`[-0, +0, -]`

```c
void lua_upvaluejoin (lua_State *L, int funcindex1, int n1,
                                    int funcindex2, int n2);
```

Make the `n1`-th upvalue of the Lua closure at index `funcindex1`
refer to the `n2`-th upvalue of the Lua closure at index `funcindex2`.
