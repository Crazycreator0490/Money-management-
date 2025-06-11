#!/bin/bash
echo "🔍 Searching for next-themes references..."
grep -r "next-themes" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git 2>/dev/null || echo "✅ No next-themes references found"
grep -r "ThemeProvider" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git 2>/dev/null || echo "✅ No ThemeProvider references found"
grep -r "useTheme" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git 2>/dev/null || echo "✅ No useTheme references found"
echo "🎯 Theme reference check complete!"
