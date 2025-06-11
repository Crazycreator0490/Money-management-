#!/bin/bash
echo "🔍 Searching for next-themes references..."
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs grep -l "next-themes" 2>/dev/null || echo "No files found with next-themes"
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs grep -l "ThemeProvider" 2>/dev/null || echo "No files found with ThemeProvider"
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs grep -l "useTheme" 2>/dev/null || echo "No files found with useTheme"
echo "Search complete!"
