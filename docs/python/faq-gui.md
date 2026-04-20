---
sourceUrl: https://docs.python.org/3/faq/gui.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: faq
---

# Graphic User Interface FAQ

## General GUI Questions

## What GUI toolkits exist for Python?

Standard builds of Python include an object-oriented interface to the Tcl/Tk widget set, called **tkinter**. This is probably the easiest to install (since it comes included with most binary distributions of Python) and use. For more info about Tk, see the Tcl/Tk home page at https://www.tcl.tk. Tcl/Tk is fully portable to macOS, Windows, and Unix platforms.

Depending on what platform(s) you are aiming at, there are also several alternatives. A list of cross-platform and platform-specific GUI frameworks can be found on the Python wiki at https://wiki.python.org/moin/GuiProgramming.

Popular cross-platform GUI toolkits include:
- **tkinter** (standard library, based on Tcl/Tk)
- **PyQt** / **PySide** (based on Qt)
- **wxPython** (based on wxWidgets)
- **Kivy** (for touch applications)
- **Dear PyGui** (GPU accelerated)

## Tkinter questions

### How do I freeze Tkinter applications?

Freeze is a tool to create stand-alone applications. When freezing Tkinter applications, the applications will not be truly stand-alone, as they still need the Tcl and Tk libraries.

One solution is to ship the application with the Tcl and Tk libraries, and point to them at run-time using the `TCL_LIBRARY` and `TK_LIBRARY` environment variables.

Various third-party freeze libraries such as py2exe and cx_Freeze have handling for Tkinter applications built-in.

### Can I have Tk events handled while waiting for I/O?

On platforms other than Windows, yes, and you don't even need threads! But you'll have to restructure your I/O code a bit. Tk has the equivalent of Xt's `XtAddInput()` call, which allows you to register a callback function which will be called from the Tk mainloop when I/O is possible on a file descriptor. See File Handlers in the tkinter documentation.

### I can't get key bindings to work in Tkinter: why?

The most common cause is that the widget to which the binding applies doesn't have "keyboard focus". Check out the Tk documentation for the focus command. Usually a widget is given the keyboard focus by clicking in it (but not for labels; see the takefocus option).
