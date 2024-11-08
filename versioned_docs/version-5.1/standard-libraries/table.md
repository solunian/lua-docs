---
sidebar_position: 5
---

This library provides generic functions for table manipulation.
It provides all its functions inside the table `table`.

Most functions in the table library assume that the table
represents an array or a list.
For these functions, when we talk about the "length" of a table
we mean the result of the length operator.

## `table.concat (table [, sep [, i [, j]]])`

Given an array where all elements are strings or numbers,
returns `table[i]..sep..table[i+1] ... sep..table[j]`.
The default value for `sep` is the empty string,
the default for `i` is 1,
and the default for `j` is the length of the table.
If `i` is greater than `j`, returns the empty string.

## `table.insert (table, [pos,] value)`

Inserts element `value` at position `pos` in `table`,
shifting up other elements to open space, if necessary.
The default value for `pos` is `n+1`,
where `n` is the length of the table,
so that a call `table.insert(t,x)` inserts `x` at the end
of table `t`.

## `table.maxn (table)`

Returns the largest positive numerical index of the given table,
or zero if the table has no positive numerical indices.
(To do its job this function does a linear traversal of
the whole table.)

## `table.remove (table [, pos])`

Removes from `table` the element at position `pos`,
shifting down other elements to close the space, if necessary.
Returns the value of the removed element.
The default value for `pos` is `n`,
where `n` is the length of the table,
so that a call `table.remove(t)` removes the last element
of table `t`.

## `table.sort (table [, comp])`

Sorts table elements in a given order, _in-place_,
from `table[1]` to `table[n]`,
where `n` is the length of the table.
If `comp` is given,
then it must be a function that receives two table elements,
and returns true
when the first is less than the second
(so that `not comp(a[i+1],a[i])` will be true after the sort).
If `comp` is not given,
then the standard Lua operator `&lt;` is used instead.

The sort algorithm is not stable;
that is, elements considered equal by the given order
may have their relative positions changed by the sort.
