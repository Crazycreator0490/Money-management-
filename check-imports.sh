#!/bin/bash
echo "Checking for problematic imports..."
grep -r "@/lib/auth-system" app/ components/ lib/ 2>/dev/null || echo "✅ No auth-system imports found"
grep -r "@/lib/data-operations" app/ components/ lib/ 2>/dev/null || echo "✅ No data-operations imports found"
echo "Import check complete!"
