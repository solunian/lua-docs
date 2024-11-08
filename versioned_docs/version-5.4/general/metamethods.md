---
sidebar_position: 2
---

Every value in Lua can have a _metatable_.
This _metatable_ is an ordinary Lua table
that defines the behavior of the original value
under certain events.
You can change several aspects of the behavior
of a value by setting specific fields in its metatable.
For instance, when a non-numeric value is the operand of an addition,
Lua checks for a function in the field `__add` of the value's metatable.
If it finds one,
Lua calls this function to perform the addition.

The key for each event in a metatable is a string
with the event name prefixed by two underscores;
the corresponding value is called a _metavalue_.
For most events, the metavalue must be a function,
which is then called a _metamethod_.
In the previous example, the key is the string "`__add`"
and the metamethod is the function that performs the addition.
Unless stated otherwise,
a metamethod can in fact be any callable value,
which is either a function or a value with a `__call` metamethod.

You can query the metatable of any value
using the `getmetatable` function.
Lua queries metamethods in metatables using a raw access (see `rawget`).

You can replace the metatable of tables
using the `setmetatable` function.
You cannot change the metatable of other types from Lua code,
except by using the debug library.

Tables and full userdata have individual metatables,
although multiple tables and userdata can share their metatables.
Values of all other types share one single metatable per type;
that is, there is one single metatable for all numbers,
one for all strings, etc.
By default, a value has no metatable,
but the string library sets a metatable for the string type.

A detailed list of operations controlled by metatables is given next.
Each event is identified by its corresponding key.
By convention, all metatable keys used by Lua are composed by
two underscores followed by lowercase Latin letters.

## **`__add`**

the addition (`+`) operation.
If any operand for an addition is not a number,
Lua will try to call a metamethod.
It starts by checking the first operand (even if it is a number);
if that operand does not define a metamethod for `__add`,
then Lua will check the second operand.
If Lua can find a metamethod,
it calls the metamethod with the two operands as arguments,
and the result of the call
(adjusted to one value)
is the result of the operation.
Otherwise, if no metamethod is found,
Lua raises an error.

## **`__sub`**

the subtraction (`-`) operation.
Behavior similar to the addition operation.

## **`__mul`**

the multiplication (`*`) operation.
Behavior similar to the addition operation.

## **`__div`**

the division (`/`) operation.
Behavior similar to the addition operation.

## **`__mod`**

the modulo (`%`) operation.
Behavior similar to the addition operation.

## **`__pow`**

the exponentiation (`^`) operation.
Behavior similar to the addition operation.

## **`__unm`**

the negation (unary `-`) operation.
Behavior similar to the addition operation.

## **`__idiv`**

the floor division (`//`) operation.
Behavior similar to the addition operation.

## **`__band`**

the bitwise AND (`&`) operation.
Behavior similar to the addition operation,
except that Lua will try a metamethod
if any operand is neither an integer
nor a float coercible to an integer.

## **`__bor`**

the bitwise OR (`|`) operation.
Behavior similar to the bitwise AND operation.

## **`__bxor`**

the bitwise exclusive OR (binary `~`) operation.
Behavior similar to the bitwise AND operation.

## **`__bnot`**

the bitwise NOT (unary `~`) operation.
Behavior similar to the bitwise AND operation.

## **`__shl`**

the bitwise left shift (`<<`) operation.
Behavior similar to the bitwise AND operation.

## **`__shr`**

the bitwise right shift (`>>`) operation.
Behavior similar to the bitwise AND operation.

## **`__concat`**

the concatenation (`..`) operation.
Behavior similar to the addition operation,
except that Lua will try a metamethod
if any operand is neither a string nor a number
(which is always coercible to a string).

## **`__len`**

the length (`#`) operation.
If the object is not a string,
Lua will try its metamethod.
If there is a metamethod,
Lua calls it with the object as argument,
and the result of the call
(always adjusted to one value)
is the result of the operation.
If there is no metamethod but the object is a table,
then Lua uses the table length operation.
Otherwise, Lua raises an error.

## **`__eq`**

the equal (`==`) operation.
Behavior similar to the addition operation,
except that Lua will try a metamethod only when the values
being compared are either both tables or both full userdata
and they are not primitively equal.
The result of the call is always converted to a boolean.

## **`__lt`**

the less than (`<`) operation.
Behavior similar to the addition operation,
except that Lua will try a metamethod only when the values
being compared are neither both numbers nor both strings.
Moreover, the result of the call is always converted to a boolean.

## **`__le`**

the less equal (`<=`) operation.
Behavior similar to the less than operation.

## **`__index`**

The indexing access operation `table[key]`.
This event happens when `table` is not a table or
when `key` is not present in `table`.
The metavalue is looked up in the metatable of `table`.

The metavalue for this event can be either a function, a table,
or any value with an `__index` metavalue.
If it is a function,
it is called with `table` and `key` as arguments,
and the result of the call
(adjusted to one value)
is the result of the operation.
Otherwise,
the final result is the result of indexing this metavalue with `key`.
This indexing is regular, not raw,
and therefore can trigger another `__index` metavalue.

## **`__newindex`**

The indexing assignment `table[key] = value`.
Like the index event,
this event happens when `table` is not a table or
when `key` is not present in `table`.
The metavalue is looked up in the metatable of `table`.

Like with indexing,
the metavalue for this event can be either a function, a table,
or any value with an `__newindex` metavalue.
If it is a function,
it is called with `table`, `key`, and `value` as arguments.
Otherwise,
Lua repeats the indexing assignment over this metavalue
with the same key and value.
This assignment is regular, not raw,
and therefore can trigger another `__newindex` metavalue.

Whenever a `__newindex` metavalue is invoked,
Lua does not perform the primitive assignment.
If needed,
the metamethod itself can call `rawset`
to do the assignment.

## **`__call`**

The call operation `func(args)`.
This event happens when Lua tries to call a non-function value
(that is, `func` is not a function).
The metamethod is looked up in `func`.
If present,
the metamethod is called with `func` as its first argument,
followed by the arguments of the original call (`args`).
All results of the call
are the results of the operation.
This is the only metamethod that allows multiple results.

In addition to the previous list,
the interpreter also respects the following keys in metatables:
`__gc`,
`__close`,
`__mode`,
and `__name`.
(The entry `__name`,
when it contains a string,
may be used by `tostring` and in error messages.)

For the unary operators (negation, length, and bitwise NOT),
the metamethod is computed and called with a dummy second operand,
equal to the first one.
This extra operand is only to simplify Lua's internals
(by making these operators behave like a binary operation)
and may be removed in future versions.
For most uses this extra operand is irrelevant.

Because metatables are regular tables,
they can contain arbitrary fields,
not only the event names defined above.
Some functions in the standard library
(e.g., `tostring`)
use other fields in metatables for their own purposes.

It is a good practice to add all needed metamethods to a table
before setting it as a metatable of some object.
In particular, the `__gc` metamethod works only when this order
is followed.
It is also a good practice to set the metatable of an object
right after its creation.
