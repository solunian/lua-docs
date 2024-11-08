---
sidebar_position: 7
---

This library provides basic mathematical functions.
It provides all its functions and constants inside the table `math`.
Functions with the annotation "`integer/float`" give
integer results for integer arguments
and float results for non-integer arguments.
The rounding functions
`math.ceil`, `math.floor`, and `math.modf`
return an integer when the result fits in the range of an integer,
or a float otherwise.

## `math.abs (x)`

Returns the maximum value between `x` and `-x`. (integer/float)

## `math.acos (x)`

Returns the arc cosine of `x` (in radians).

## `math.asin (x)`

Returns the arc sine of `x` (in radians).

## `math.atan (y [, x])`

Returns the arc tangent of `y/x` (in radians),
using the signs of both arguments to find the
quadrant of the result.
It also handles correctly the case of `x` being zero.

The default value for `x` is 1,
so that the call `math.atan(y)`
returns the arc tangent of `y`.

## `math.ceil (x)`

Returns the smallest integral value greater than or equal to `x`.

## `math.cos (x)`

Returns the cosine of `x` (assumed to be in radians).

## `math.deg (x)`

Converts the angle `x` from radians to degrees.

## `math.exp (x)`

Returns the value _e<sup>x</sup>_
(where `e` is the base of natural logarithms).

## `math.floor (x)`

Returns the largest integral value less than or equal to `x`.

## `math.fmod (x, y)`

Returns the remainder of the division of `x` by `y`
that rounds the quotient towards zero. (integer/float)

## `math.huge`

The float value `HUGE_VAL`,
a value greater than any other numeric value.

## `math.log (x [, base])`

Returns the logarithm of `x` in the given base.
The default for `base` is _e_
(so that the function returns the natural logarithm of `x`).

## `math.max (x, ...)`

Returns the argument with the maximum value,
according to the Lua operator `<`.

## `math.maxinteger`

An integer with the maximum value for an integer.

## `math.min (x, ...)`

Returns the argument with the minimum value,
according to the Lua operator `<`.

## `math.mininteger`

An integer with the minimum value for an integer.

## `math.modf (x)`

Returns the integral part of `x` and the fractional part of `x`.
Its second result is always a float.

## `math.pi`

The value of _π_.

## `math.rad (x)`

Converts the angle `x` from degrees to radians.

## `math.random ([m [, n]])`

When called without arguments,
returns a pseudo-random float with uniform distribution
in the range _[0,1)_.  
When called with two integers `m` and `n`,
`math.random` returns a pseudo-random integer
with uniform distribution in the range _[m, n]_.
The call `math.random(n)`, for a positive `n`,
is equivalent to `math.random(1,n)`.
The call `math.random(0)` produces an integer with
all bits (pseudo)random.

This function uses the `xoshiro256**` algorithm to produce
pseudo-random 64-bit integers,
which are the results of calls with argument 0.
Other results (ranges and floats)
are unbiased extracted from these integers.

Lua initializes its pseudo-random generator with the equivalent of
a call to `math.randomseed` with no arguments,
so that `math.random` should generate
different sequences of results each time the program runs.

## `math.randomseed ([x [, y]])`

When called with at least one argument,
the integer parameters `x` and `y` are
joined into a 128-bit _seed_ that
is used to reinitialize the pseudo-random generator;
equal seeds produce equal sequences of numbers.
The default for `y` is zero.

When called with no arguments,
Lua generates a seed with
a weak attempt for randomness.

This function returns the two seed components
that were effectively used,
so that setting them again repeats the sequence.

To ensure a required level of randomness to the initial state
(or contrarily, to have a deterministic sequence,
for instance when debugging a program),
you should call `math.randomseed` with explicit arguments.

## `math.sin (x)`

Returns the sine of `x` (assumed to be in radians).

## `math.sqrt (x)`

Returns the square root of `x`.
(You can also use the expression `x^0.5` to compute this value.)

## `math.tan (x)`

Returns the tangent of `x` (assumed to be in radians).

## `math.tointeger (x)`

If the value `x` is convertible to an integer,
returns that integer.
Otherwise, returns **fail**.

## `math.type (x)`

Returns "`integer`" if `x` is an integer,
"`float`" if it is a float,
or **fail** if `x` is not a number.

## `math.ult (m, n)`

Returns a boolean,
**true** if and only if integer `m` is below integer `n` when
they are compared as unsigned integers.
