---
sourceUrl: https://docs.python.org/3/library/random.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

**Source code:** [Lib/random.py](https://github.com/python/cpython/tree/3.14/Lib/random.py)

* * *

This module implements pseudo-random number generators for various distributions.

For integers, there is uniform selection from a range. For sequences, there is uniform selection of a random element, a function to generate a random permutation of a list in-place, and a function for random sampling without replacement.

Almost all module functions depend on the basic function `random()`, which generates a random float uniformly in the half-open range `0.0 <= X < 1.0`. Python uses the Mersenne Twister as the core generator. It produces 53-bit precision floats and has a period of 2**19937-1.

Warning: The pseudo-random generators of this module should not be used for security purposes. For security or cryptographic uses, see the `secrets` module.

## Bookkeeping Functions

- **random.seed(a=None, version=2)** - Initialize the random number generator. If *a* is omitted or `None`, the current system time is used.
- **random.getstate()** - Return an object capturing the current internal state of the generator.
- **random.setstate(state)** - Restore the internal state of the generator.

## Functions for Bytes

- **random.randbytes(n)** - Generate *n* random bytes. (Added 3.9) Not for security tokens — use `secrets.token_bytes()` instead.

## Functions for Integers

- **random.randrange(stop)** / **random.randrange(start, stop[, step])** - Return a randomly selected element from `range(start, stop, step)`.
- **random.randint(a, b)** - Return a random integer *N* such that `a <= N <= b`. Alias for `randrange(a, b+1)`.
- **random.getrandbits(k)** - Returns a non-negative Python integer with *k* random bits.

## Functions for Sequences

- **random.choice(seq)** - Return a random element from the non-empty sequence *seq*.
- **random.choices(population, weights=None, *, cum_weights=None, k=1)** - Return a *k* sized list of elements chosen from the *population* with replacement. (Added 3.6)
- **random.shuffle(x)** - Shuffle the sequence *x* in place.
- **random.sample(population, k, *, counts=None)** - Return a *k* length list of unique elements chosen from the population. Used for random sampling without replacement.

```python
>>> import random
>>> random.choice(['apple', 'banana', 'cherry'])
'banana'
>>> random.sample(range(100), 10)
[30, 83, 16, 4, 8, 81, 41, 50, 18, 33]
>>> random.shuffle([1, 2, 3, 4, 5])
>>> random.choices(['red', 'green', 'blue'], weights=[10, 1, 1], k=5)
['red', 'red', 'green', 'red', 'red']
```

## Discrete Distributions

- **random.binomialvariate(n=1, p=0.5)** - Binomial distribution. Return the number of successes for *n* independent trials. (Added 3.12)

## Real-Valued Distributions

- **random.random()** - Return the next random floating-point number in the range `0.0 <= X < 1.0`.
- **random.uniform(a, b)** - Return a random floating-point number *N* such that `a <= N <= b`.
- **random.triangular(low, high, mode)** - Return a random floating-point number *N* such that `low <= N <= high` with the specified *mode*.
- **random.betavariate(alpha, beta)** - Beta distribution. `alpha > 0` and `beta > 0`. Returned values range between 0 and 1.
- **random.expovariate(lambd=1.0)** - Exponential distribution. *lambd* is 1.0 divided by the desired mean.
- **random.gammavariate(alpha, beta)** - Gamma distribution. Both *alpha* and *beta* must have positive values.
- **random.gauss(mu=0.0, sigma=1.0)** - Normal (Gaussian) distribution. *mu* is the mean, *sigma* is the standard deviation. Slightly faster than `normalvariate()`.
- **random.lognormvariate(mu, sigma)** - Log normal distribution. *sigma* must be greater than zero.
- **random.normalvariate(mu=0.0, sigma=1.0)** - Normal distribution. Thread-safe version.
- **random.vonmisesvariate(mu, kappa)** - Von Mises distribution. *mu* is the mean angle in radians.
- **random.paretovariate(alpha)** - Pareto distribution. *alpha* is the shape parameter.
- **random.weibullvariate(alpha, beta)** - Weibull distribution. *alpha* is the scale, *beta* is the shape.

## Alternative Generators

### class random.Random([seed])

Class that implements the default pseudo-random number generator. Can be subclassed for custom generators.

### class random.SystemRandom([seed])

Class that uses `os.urandom()` for generating random numbers from OS-provided sources. Not reproducible. `seed()` has no effect, `getstate()` and `setstate()` raise `NotImplementedError`.

## Notes on Reproducibility

By reusing a seed value, the same sequence should be reproducible from run to run as long as multiple threads are not running.

Two aspects are guaranteed not to change:
- If a new seeding method is added, a backward compatible seeder will be offered.
- The generator's `random()` method will continue to produce the same sequence when the compatible seeder is given the same seed.

## Examples

```python
>>> random.random()
0.37444887175646646

>>> random.uniform(2.5, 10.0)
3.1800146073117523

>>> random.randrange(10)
7

>>> random.randint(0, 9)
5

>>> random.choice('abcdefghij')
'c'

>>> items = [1, 2, 3, 4, 5, 6, 7]
>>> random.shuffle(items)
>>> items
[7, 3, 2, 5, 6, 4, 1]

>>> random.sample([1, 2, 3, 4, 5], 3)
[4, 1, 5]
```
