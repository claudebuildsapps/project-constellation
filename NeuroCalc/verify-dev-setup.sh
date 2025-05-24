#!/bin/bash

# NeuroCalc Development Environment Verification Script
echo "🧪 NeuroCalc Development Environment Check"
echo "=========================================="

# Check Node.js version
echo "📦 Checking Node.js version..."
node_version=$(node --version)
echo "   Node.js: $node_version"

# Check npm version  
npm_version=$(npm --version)
echo "   npm: $npm_version"

# Check if dependencies are installed
echo ""
echo "📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules exists"
else
    echo "   ❌ node_modules missing - run 'npm install'"
    exit 1
fi

# Check TypeScript compilation
echo ""
echo "🔍 Checking TypeScript compilation..."
if npm run typecheck > /dev/null 2>&1; then
    echo "   ✅ TypeScript compiles successfully"
else
    echo "   ❌ TypeScript compilation errors detected"
    echo "   Run 'npm run typecheck' to see details"
fi

# Check if build works
echo ""
echo "🏗️ Checking build system..."
if npm run build > /dev/null 2>&1; then
    echo "   ✅ Build system works"
else
    echo "   ⚠️ Build has issues - check 'npm run build' for details"
fi

# Check critical files exist
echo ""
echo "📁 Checking critical files..."
critical_files=(
    "src/main.ts"
    "src/renderer/index.tsx"
    "src/renderer/App.tsx"
    "src/renderer/styles/theme.ts"
    "src/renderer/store/useAppStore.ts"
    "package.json"
    "webpack.config.js"
    "tsconfig.json"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file missing"
    fi
done

# Check component files
echo ""
echo "🧩 Checking component files..."
component_files=(
    "src/renderer/components/Header.tsx"
    "src/renderer/components/Navigation.tsx"
    "src/renderer/components/SubstanceSelector.tsx"
    "src/renderer/components/DosageControls.tsx"
    "src/renderer/components/EffectDisplay.tsx"
)

for file in "${component_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file missing"
    fi
done

# Summary
echo ""
echo "📊 Development Environment Status"
echo "================================="

if npm run typecheck > /dev/null 2>&1 && npm run build > /dev/null 2>&1; then
    echo "🎉 Environment is ready for development!"
    echo ""
    echo "Next steps:"
    echo "  1. Run 'npm run dev' to start development server"
    echo "  2. Check MULTI_DEV_SETUP.md for your development track"
    echo "  3. See docs/IMPLEMENTATION.md for current task status"
else
    echo "⚠️ Environment needs fixes before development"
    echo ""
    echo "Required fixes:"
    echo "  1. Run 'npm run typecheck' and fix TypeScript errors"
    echo "  2. Run 'npm run build' and fix build issues"
    echo "  3. Verify all critical files exist"
fi

echo ""
echo "For help, see MULTI_DEV_SETUP.md"