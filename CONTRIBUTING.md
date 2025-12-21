# Contributing Guidelines

Thank you for contributing to this portfolio project!

## Scripting Standards

### ✅ Python Scripts Only

**All automation scripts MUST be written in Python** for cross-platform compatibility.

#### Why Python?
- ✅ Works on Windows, Linux, and macOS
- ✅ No execution policy or permission issues
- ✅ Already a project dependency (required for demos)
- ✅ Better error handling and user feedback
- ✅ More maintainable and readable

#### Prohibited Script Types
- ❌ Shell scripts (`.sh`) - Not compatible with Windows
- ❌ PowerShell (`.ps1`) - Not compatible with Linux/macOS
- ❌ Batch files (`.bat`) - Limited functionality, Windows-only

### Script Template

When creating new automation scripts in `scripts/`:

```python
#!/usr/bin/env python3
"""
Brief description of what this script does
"""

import sys
from pathlib import Path


def main():
    """Main function"""
    try:
        # Your code here
        print("✅ Success!")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
```

### Best Practices

1. **Use `pathlib.Path`** instead of string concatenation for paths
   ```python
   # Good
   path = Path("apps") / "homepage" / "src"
   
   # Bad
   path = "apps/homepage/src"  # Won't work on Windows
   ```

2. **Handle platform differences**
   ```python
   import sys
   
   if sys.platform == "win32":
       # Windows-specific code
       pass
   else:
       # Linux/macOS code
       pass
   ```

3. **Use subprocess for external commands**
   ```python
   import subprocess
   
   result = subprocess.run(
       ["npm", "install"],
       capture_output=True,
       text=True,
       check=True
   )
   ```

4. **Provide colored output**
   ```python
   def print_color(message, color="green"):
       colors = {
           "green": "\033[92m",
           "red": "\033[91m",
           "reset": "\033[0m"
       }
       print(f"{colors[color]}{message}{colors['reset']}")
   ```

5. **Add proper error handling**
   ```python
   try:
       # Risky operation
       result = do_something()
   except FileNotFoundError:
       print("❌ File not found")
       sys.exit(1)
   except Exception as e:
       print(f"❌ Unexpected error: {e}")
       sys.exit(1)
   ```

## Code Review Checklist

Before submitting a PR with new scripts:

- [ ] Script is written in Python (`.py`)
- [ ] No shell scripts (`.sh`) or PowerShell (`.ps1`) added
- [ ] Uses `pathlib.Path` for file paths
- [ ] Has proper error handling
- [ ] Includes user-friendly output messages
- [ ] Tested on at least one platform (Windows, Linux, or macOS)
- [ ] Has docstrings and comments
- [ ] Follows PEP 8 style guidelines

## Other Contributions

For non-scripting contributions (code, documentation, etc.), please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Questions?

Open an issue or start a discussion if you have questions about contributing!
