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

Returns information about a specific function or function invocation.

To get information about a function invocation,
the parameter `ar` must be a valid activation record that was
filled by a previous call to `lua_getstack` or
given as argument to a hook (see `lua_Hook`).

To get information about a function you push it onto the stack
and start the `what` string with the character '`>`'.
(In that case,
`lua_getinfo` pops the function in the top of the stack.)
For instance, to know in which line a function `f` was defined,
you can write the following code:

```c
lua_Debug ar;
lua_getfield(L, LUA_GLOBALSINDEX, "f");  /* get global 'f' */
lua_getinfo(L, ">S", &ar);
printf("%d\n", ar.linedefined);
```

Each character in the string `what`
selects some fields of the structure `ar` to be filled or
a value to be pushed on the stack:

- **'`n`':** fills in the field `name` and `namewhat`;

- **'`S`':**
  fills in the fields `source`, `short_src`,
  `linedefined`, `lastlinedefined`, and `what`;

- **'`l`':** fills in the field `currentline`;

- **'`u`':** fills in the field `nups`;

- **'`f`':**
  pushes onto the stack the function that is
  running at the given level;

- **'`L`':**
  pushes onto the stack a table whose indices are the
  numbers of the lines that are valid on the function.
  (A _valid line_ is a line with some associated code,
  that is, a line where you can put a break point.
  Non-valid lines include empty lines and comments.)

This function returns 0 on error
(for instance, an invalid option in `what`).

## `lua_getlocal`

`[-0, +(0|1), -]`

```c
const char *lua_getlocal (lua_State *L, lua_Debug *ar, int n);
```

Gets information about a local variable of a given activation record.
The parameter `ar` must be a valid activation record that was
filled by a previous call to `lua_getstack` or
given as argument to a hook (see `lua_Hook`).
The index `n` selects which local variable to inspect
(1 is the first parameter or active local variable, and so on,
until the last active local variable).
`lua_getlocal` pushes the variable's value onto the stack
and returns its name.

Variable names starting with '`(`' (open parentheses)
represent internal variables
(loop control variables, temporaries, and C function locals).

Returns `NULL` (and pushes nothing)
when the index is greater than
the number of active local variables.

## `lua_getstack`

`[-0, +0, -]`

```c
int lua_getstack (lua_State *L, int level, lua_Debug *ar);
```

Get information about the interpreter runtime stack.

This function fills parts of a `lua_Debug` structure with
an identification of the _activation record_
of the function executing at a given level.
Level 0 is the current running function,
whereas level _n+1_ is the function that has called level _n_.
When there are no errors, `lua_getstack` returns 1;
when called with a level greater than the stack depth,
it returns 0.

## `lua_getupvalue`

`[-0, +(0|1), -]`

```c
const char *lua_getupvalue (lua_State *L, int funcindex, int n);
```

Gets information about a closure's upvalue.
(For Lua functions,
upvalues are the external local variables that the function uses,
and that are consequently included in its closure.)
`lua_getupvalue` gets the index `n` of an upvalue,
pushes the upvalue's value onto the stack,
and returns its name.
`funcindex` points to the closure in the stack.
(Upvalues have no particular order,
as they are active through the whole function.
So, they are numbered in an arbitrary order.)

Returns `NULL` (and pushes nothing)
when the index is greater than the number of upvalues.
For C functions, this function uses the empty string `""`
as a name for all upvalues.

## `lua_sethook`

`[-0, +0, -]`

```c
int lua_sethook (lua_State *L, lua_Hook f, int mask, int count);
```

Sets the debugging hook function.

Argument `f` is the hook function.
`mask` specifies on which events the hook will be called:
it is formed by a bitwise or of the constants
`LUA_MASKCALL`,
`LUA_MASKRET`,
`LUA_MASKLINE`,
and `LUA_MASKCOUNT`.
The `count` argument is only meaningful when the mask
includes `LUA_MASKCOUNT`.
For each event, the hook is called as explained below:

- **The call hook:** is called when the interpreter calls a function.
  The hook is called just after Lua enters the new function,
  before the function gets its arguments.

- **The return hook:** is called when the interpreter returns from a function.
  The hook is called just before Lua leaves the function.
  You have no access to the values to be returned by the function.

- **The line hook:** is called when the interpreter is about to
  start the execution of a new line of code,
  or when it jumps back in the code (even to the same line).
  (This event only happens while Lua is executing a Lua function.)

- **The count hook:** is called after the interpreter executes every
  `count` instructions.
  (This event only happens while Lua is executing a Lua function.)

A hook is disabled by setting `mask` to zero.

## `lua_setlocal`

`[-(0|1), +0, -]`

```c
const char *lua_setlocal (lua_State *L, lua_Debug *ar, int n);
```

Sets the value of a local variable of a given activation record.
Parameters `ar` and `n` are as in `lua_getlocal`
(see `lua_getlocal`).
`lua_setlocal` assigns the value at the top of the stack
to the variable and returns its name.
It also pops the value from the stack.

Returns `NULL` (and pops nothing)
when the index is greater than
the number of active local variables.

## `lua_setupvalue`

`[-(0|1), +0, -]`

```c
const char *lua_setupvalue (lua_State *L, int funcindex, int n);
```

Sets the value of a closure's upvalue.
It assigns the value at the top of the stack
to the upvalue and returns its name.
It also pops the value from the stack.
Parameters `funcindex` and `n` are as in the `lua_getupvalue`
(see `lua_getupvalue`).

Returns `NULL` (and pops nothing)
when the index is greater than the number of upvalues.
