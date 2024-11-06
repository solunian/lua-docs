---
sidebar_position: 6
---

This library is an interface to the standard C math library.
It provides all its functions inside the table `math`.

## `math.abs (x)`

Returns the absolute value of `x`.

## `math.acos (x)`

Returns the arc cosine of `x` (in radians).

## `math.asin (x)`

Returns the arc sine of `x` (in radians).

## `math.atan (x)`

Returns the arc tangent of `x` (in radians).

## `math.atan2 (y, x)`

Returns the arc tangent of `y/x` (in radians),
but uses the signs of both parameters to find the
quadrant of the result.
(It also handles correctly the case of `x` being zero.)

## `math.ceil (x)`

Returns the smallest integer larger than or equal to `x`.

## `math.cos (x)`

Returns the cosine of `x` (assumed to be in radians).

## `math.cosh (x)`

Returns the hyperbolic cosine of `x`.

## `math.deg (x)`

Returns the angle `x` (given in radians) in degrees.

## `math.exp (x)`

Returns the value _e<sup>x</sup>_.

## `math.floor (x)`

Returns the largest integer smaller than or equal to `x`.

## `math.fmod (x, y)`

Returns the remainder of the division of `x` by `y`
that rounds the quotient towards zero.

## `math.frexp (x)`

Returns `m` and `e` such that _x = m2<sup>e</sup>_,
`e` is an integer and the absolute value of `m` is
in the range _[0.5, 1)_
(or zero when `x` is zero).

## `math.huge`

The value `HUGE_VAL`,
a value larger than or equal to any other numerical value.

## `math.ldexp (m, e)`

Returns _m2<sup>e</sup>_ (`e` should be an integer).

## `math.log (x)`

Returns the natural logarithm of `x`.

## `math.log10 (x)`

Returns the base-10 logarithm of `x`.

## `math.max (x, ...)`

Returns the maximum value among its arguments.

## `math.min (x, ...)`

Returns the minimum value among its arguments.

## `math.modf (x)`

Returns two numbers,
the integral part of `x` and the fractional part of `x`.

## `math.pi`

The value of _pi_.

## `math.pow (x, y)`

Returns _x<sup>y</sup>_.
(You can also use the expression `x^y` to compute this value.)

## `math.rad (x)`

Returns the angle `x` (given in degrees) in radians.

## `math.random ([m [, n]])`

This function is an interface to the simple
pseudo-random generator function `rand` provided by ANSI C.
(No guarantees can be given for its statistical properties.)

When called without arguments,
returns a uniform pseudo-random real number
in the range _[0,1)_.  
When called with an integer number `m`,
`math.random` returns
a uniform pseudo-random integer in the range _[1, m]_.
When called with two integer numbers `m` and `n`,
`math.random` returns a uniform pseudo-random
integer in the range _[m, n]_.

## `math.randomseed (x)`

Sets `x` as the "seed"
for the pseudo-random generator:
equal seeds produce equal sequences of numbers.

## `math.sin (x)`

Returns the sine of `x` (assumed to be in radians).

## `math.sinh (x)`

Returns the hyperbolic sine of `x`.

## `math.sqrt (x)`

Returns the square root of `x`.
(You can also use the expression `x^0.5` to compute this value.)

## `math.tan (x)`

Returns the tangent of `x` (assumed to be in radians).

## `math.tanh (x)`

Returns the hyperbolic tangent of `x`.
