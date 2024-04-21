---
title: Basic syntax
description: This is a collection of basic syntax elements with examples
---

## Variables

```golang
nambala yambili = 2;
mawu dzina = "Maliko";
```

## Comments

We have both single-line and multi-line comments

Single line comments start with // and continue to the end of the line.

```c#
// Ndemanga ya mzere modzi
```

Block comments are enclosed within /_ ... _/ and can span as many lines as necessary.

```c#
/*
Ndemanga ya mizere yambiri
*/
```

## Conditional expressions

### if statement

```c#
ngati(yoyamba > yachiwiri) {
    // panga zinthu
}
```

If you want to provide an else statement

```c#
ngati(yoyamba > yachiwiri) {
    // panga zinthu
} kapena {
    // panga zinthu
}
```

## Loops

### While loop

```csharp
pamene(yoyamba > 2) {
    // panga zinthu
    yoyamba++
}
```

### For loop

```csharp
za(nambala x = 0; x > 5; x++) {
    // panga zinthu
}
```

## Structs

```golang
mtundu Buku {
    wolemba    mawu
    dzina      mawu
    version    nambala
}
```
