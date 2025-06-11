#!/bin/bash
echo "🧹 Cleaning up theme-related files..."

# Remove any potential theme provider files
rm -f components/theme-provider.tsx
rm -f components/theme-toggle.tsx
rm -f components/mode-toggle.tsx
rm -f lib/theme.ts
rm -f lib/themes.ts

# Search and report any remaining theme references
echo "🔍 Checking for remaining theme references..."
grep -r "next-themes" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git 2>/dev/null || echo "✅ No next-themes references found"
grep -r "ThemeProvider" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git 2>/dev/null || echo "✅ No ThemeProvider references found"
grep -r "useTheme" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git 2>/dev/null || echo "✅ No useTheme references found"

echo "🎯 Cleanup complete!"
