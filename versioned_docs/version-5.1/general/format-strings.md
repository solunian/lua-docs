---
sidebar_position: 3
---

The first argument to `string.pack`,
`string.packsize`, and `string.unpack`
is a format string,
which describes the layout of the structure being created or read.

A format string is a sequence of conversion options.
The conversion options are as follows:

- **`<`:** sets little endian
- **`>`:** sets big endian
- **`=`:** sets native endian
- **`![n]`:** sets maximum alignment to `n`
  (default is native alignment)
- **`b`:** a signed byte (`char`)
- **`B`:** an unsigned byte (`char`)
- **`h`:** a signed `short` (native size)
- **`H`:** an unsigned `short` (native size)
- **`l`:** a signed `long` (native size)
- **`L`:** an unsigned `long` (native size)
- **`j`:** a `lua_Integer`
- **`J`:** a `lua_Unsigned`
- **`T`:** a `size_t` (native size)
- **`i[n]`:** a signed `int` with `n` bytes
  (default is native size)
- **`I[n]`:** an unsigned `int` with `n` bytes
  (default is native size)
- **`f`:** a `float` (native size)
- **`d`:** a `double` (native size)
- **`n`:** a `lua_Number`
- **`cn`:** a fixed-sized string with `n` bytes
- **`z`:** a zero-terminated string
- **`s[n]`:** a string preceded by its length
  coded as an unsigned integer with `n` bytes
  (default is a `size_t`)
- **`x`:** one byte of padding
- **`Xop`:** an empty item that aligns
  according to option `op`
  (which is otherwise ignored)
- **'` `':** (space) ignored

(A "`[n]`" means an optional integral numeral.)
Except for padding, spaces, and configurations
(options "`xX <=>!`"),
each option corresponds to an argument in `string.pack`
or a result in `string.unpack`.

For options "`!n`", "`sn`", "`in`", and "`In`",
`n` can be any integer between 1 and 16.
All integral options check overflows;
`string.pack` checks whether the given value fits in the given size;
`string.unpack` checks whether the read value fits in a Lua integer.
For the unsigned options,
Lua integers are treated as unsigned values too.

Any format string starts as if prefixed by "`!1=`",
that is,
with maximum alignment of 1 (no alignment)
and native endianness.

Native endianness assumes that the whole system is
either big or little endian.
The packing functions will not emulate correctly the behavior
of mixed-endian formats.

Alignment works as follows:
For each option,
the format gets extra padding until the data starts
at an offset that is a multiple of the minimum between the
option size and the maximum alignment;
this minimum must be a power of 2.
Options "`c`" and "`z`" are not aligned;
option "`s`" follows the alignment of its starting integer.

All padding is filled with zeros by `string.pack`
and ignored by `string.unpack`.
