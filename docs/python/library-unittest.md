---
sourceUrl: https://docs.python.org/3/library/unittest.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

**Source code:** [Lib/unittest/__init__.py](https://github.com/python/cpython/tree/3.14/Lib/unittest/__init__.py)

* * *

The `unittest` unit testing framework was originally inspired by JUnit and has a similar flavor as major unit testing frameworks in other languages. It supports test automation, sharing of setup and shutdown code for tests, aggregation of tests into collections, and independence of the tests from the reporting framework.

## Key Concepts

- **test fixture** - The preparation needed to perform one or more tests, and any associated cleanup actions.
- **test case** - The individual unit of testing. It checks for a specific response to a particular set of inputs.
- **test suite** - A collection of test cases, test suites, or both.
- **test runner** - A component which orchestrates the execution of tests and provides the outcome to the user.

## Basic Example

```python
import unittest

class TestStringMethods(unittest.TestCase):

    def test_upper(self):
        self.assertEqual('foo'.upper(), 'FOO')

    def test_isupper(self):
        self.assertTrue('FOO'.isupper())
        self.assertFalse('Foo'.isupper())

    def test_split(self):
        s = 'hello world'
        self.assertEqual(s.split(), ['hello', 'world'])
        with self.assertRaises(TypeError):
            s.split(2)

if __name__ == '__main__':
    unittest.main()
```

## Command-Line Interface

```bash
python -m unittest test_module1 test_module2
python -m unittest test_module.TestClass
python -m unittest test_module.TestClass.test_method
python -m unittest tests/test_something.py
python -m unittest -v test_module  # verbose
python -m unittest  # test discovery
```

### Command-Line Options

- `-b, --buffer` - Buffer stdout and stderr during the test run
- `-c, --catch` - Control-C waits for current test to end
- `-f, --failfast` - Stop on the first error or failure
- `-k` - Only run test methods and classes that match the pattern or substring
- `--locals` - Show local variables in tracebacks
- `--durations N` - Show the N slowest test cases (N=0 for all, added 3.12)

## Test Discovery

```bash
python -m unittest discover
python -m unittest discover -s project_directory -p "*_test.py"
```

Options: `-v` (verbose), `-s` (start directory), `-p` (pattern), `-t` (top level directory).

## Organizing Test Code

```python
import unittest

class WidgetTestCase(unittest.TestCase):
    def setUp(self):
        self.widget = Widget('The widget')

    def tearDown(self):
        self.widget.dispose()

    def test_default_widget_size(self):
        self.assertEqual(self.widget.size(), (50, 50))

    def test_widget_resize(self):
        self.widget.resize(100, 150)
        self.assertEqual(self.widget.size(), (100, 150))
```

## TestCase Class

### class unittest.TestCase(methodName='runTest')

**Setup and Teardown:**

- **setUp()** - Method called to prepare the test fixture. Called before each test method.
- **tearDown()** - Method called after the test method has been called and the result recorded. Called even if the test method raised an exception.
- **setUpClass()** - A class method called before tests in an individual class are run.
- **tearDownClass()** - A class method called after tests in an individual class have run.

**Assert Methods:**

| Method | Checks that |
|--------|-------------|
| `assertEqual(a, b)` | `a == b` |
| `assertNotEqual(a, b)` | `a != b` |
| `assertTrue(x)` | `bool(x) is True` |
| `assertFalse(x)` | `bool(x) is False` |
| `assertIs(a, b)` | `a is b` |
| `assertIsNot(a, b)` | `a is not b` |
| `assertIsNone(x)` | `x is None` |
| `assertIsNotNone(x)` | `x is not None` |
| `assertIn(a, b)` | `a in b` |
| `assertNotIn(a, b)` | `a not in b` |
| `assertIsInstance(a, b)` | `isinstance(a, b)` |
| `assertNotIsInstance(a, b)` | `not isinstance(a, b)` |

**Exception/Warning Assert Methods:**

| Method | Checks that |
|--------|-------------|
| `assertRaises(exc, fun, *args, **kwds)` | `fun(*args, **kwds)` raises *exc* |
| `assertRaisesRegex(exc, r, fun, *args, **kwds)` | *exc* is raised and message matches regex *r* |
| `assertWarns(warn, fun, *args, **kwds)` | `fun(*args, **kwds)` raises *warn* |
| `assertWarnsRegex(warn, r, fun, *args, **kwds)` | *warn* is raised and message matches regex *r* |
| `assertLogs(logger, level)` | The `with` block logs on *logger* with minimum *level* |
| `assertNoLogs(logger, level)` | The `with` block does not log on *logger* with minimum *level* |

**Type-Specific Assert Methods:**

| Method | Used to compare |
|--------|----------------|
| `assertAlmostEqual(a, b)` | `round(a-b, 7) == 0` |
| `assertNotAlmostEqual(a, b)` | `round(a-b, 7) != 0` |
| `assertGreater(a, b)` | `a > b` |
| `assertGreaterEqual(a, b)` | `a >= b` |
| `assertLess(a, b)` | `a < b` |
| `assertLessEqual(a, b)` | `a <= b` |
| `assertRegex(s, r)` | `r.search(s)` |
| `assertNotRegex(s, r)` | `not r.search(s)` |
| `assertCountEqual(a, b)` | *a* and *b* have the same elements in the same number |
| `assertMultiLineEqual(a, b)` | strings |
| `assertSequenceEqual(a, b)` | sequences |
| `assertListEqual(a, b)` | lists |
| `assertTupleEqual(a, b)` | tuples |
| `assertSetEqual(a, b)` | sets or frozensets |
| `assertDictEqual(a, b)` | dicts |

**Other Methods:**

- **subTest(msg=None, **params)** - Context manager to distinguish test iterations inside the body of a test method.
- **skipTest(reason)** - Skip the current test.
- **fail(msg=None)** - Signals a test failure unconditionally.
- **countTestCases()** - Return the number of tests represented by this test object.
- **id()** - Return a string identifying the specific test case.
- **shortDescription()** - Returns a description of the test.
- **addCleanup(function, /, *args, **kwargs)** - Add a function to be called after `tearDown()`.
- **addClassCleanup(function, /, *args, **kwargs)** - Add a function to be called after `tearDownClass()`.
- **maxDiff** - Attribute that controls the maximum length of diffs output by assert methods (default 80*8 characters).

## Skipping Tests and Expected Failures

```python
class MyTestCase(unittest.TestCase):
    @unittest.skip("demonstrating skipping")
    def test_nothing(self):
        self.fail("shouldn't happen")

    @unittest.skipIf(mylib.__version__ < (1, 3), "not supported")
    def test_format(self):
        pass

    @unittest.skipUnless(sys.platform.startswith("win"), "requires Windows")
    def test_windows_support(self):
        pass

    @unittest.expectedFailure
    def test_fail(self):
        self.assertEqual(1, 0, "broken")
```

**Decorators:**
- `@unittest.skip(reason)` - Unconditionally skip the test
- `@unittest.skipIf(condition, reason)` - Skip the test if condition is true
- `@unittest.skipUnless(condition, reason)` - Skip unless condition is true
- `@unittest.expectedFailure` - Mark the test as an expected failure

## TestSuite Class

### class unittest.TestSuite(tests=())

- **addTest(test)** - Add a `TestCase` or `TestSuite` to the suite.
- **addTests(tests)** - Add all the tests from an iterable to this test suite.
- **run(result)** - Run the tests associated with this suite.
- **countTestCases()** - Return the number of tests represented.

## TestLoader Class

### class unittest.TestLoader

- **loadTestsFromTestCase(testCaseClass)** - Return a suite of all test cases contained in testCaseClass.
- **loadTestsFromModule(module, *, pattern=None)** - Return a suite of all test cases in the given module.
- **loadTestsFromName(name, module=None)** - Return a suite of all test cases given a string specifier.
- **loadTestsFromNames(names, module=None)** - Similar, but takes a sequence of names.
- **discover(start_dir, pattern='test*.py', top_level_dir=None)** - Find and return all test modules from the specified start directory.

## TextTestRunner Class

### class unittest.TextTestRunner(stream=None, descriptions=True, verbosity=1, failfast=False, buffer=False, resultclass=None, warnings=None, *, tb_locals=False, durations=None)

A basic test runner implementation that outputs results to a stream.

## unittest.main

```python
unittest.main(module='__main__', defaultTest=None, argv=None,
              testRunner=None, testLoader=unittest.defaultTestLoader,
              exit=True, verbosity=1, failfast=None, catchbreak=None,
              buffer=None, warnings=None)
```

A command-line program that loads a set of tests from module and runs them.
