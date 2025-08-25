#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run ESLint and get JSON output
console.log('Running ESLint to find unused imports...');
let eslintOutput;
try {
  eslintOutput = execSync('pnpm run lint --format=json', { 
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'] // Ignore stderr
  });
} catch (error) {
  // ESLint exits with error code when there are lint errors
  eslintOutput = error.stdout;
}

const results = JSON.parse(eslintOutput || '[]');
const filesToFix = new Map();

// Group errors by file
results.forEach(result => {
  if (result.messages && result.messages.length > 0) {
    const unusedVars = result.messages.filter(msg => 
      msg.ruleId === '@typescript-eslint/no-unused-vars' && 
      msg.message.includes('is defined but never used')
    );
    
    if (unusedVars.length > 0) {
      filesToFix.set(result.filePath, unusedVars);
    }
  }
});

// Fix each file
filesToFix.forEach((errors, filePath) => {
  console.log(`Fixing ${path.basename(filePath)}...`);
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Sort errors by line number in reverse to avoid offset issues
  errors.sort((a, b) => b.line - a.line);
  
  errors.forEach(error => {
    const lineIndex = error.line - 1;
    const line = lines[lineIndex];
    
    if (!line) return;
    
    // Extract the variable name from the error message
    const match = error.message.match(/'([^']+)'/);
    if (!match) return;
    
    const varName = match[1];
    
    // Handle import statements
    if (line.includes('import')) {
      // Check if it's a named import
      const namedImportRegex = new RegExp(`\\b${varName}\\b,?\\s*`, 'g');
      lines[lineIndex] = line.replace(namedImportRegex, '');
      
      // Clean up empty imports
      lines[lineIndex] = lines[lineIndex]
        .replace(/,\s*,/g, ',')
        .replace(/{\s*,/g, '{')
        .replace(/,\s*}/g, '}')
        .replace(/{\s*}/g, '{}')
        .replace(/import\s+{\s*}\s+from\s+['"][^'"]+['"]/g, '');
      
      // Remove line if it's now empty
      if (lines[lineIndex].trim() === '' || lines[lineIndex].trim() === ',') {
        lines.splice(lineIndex, 1);
      }
    }
  });
  
  // Write back the fixed content
  const fixedContent = lines.filter(line => line.trim() !== '').join('\n');
  fs.writeFileSync(filePath, fixedContent);
});

console.log('✅ Fixed unused imports in', filesToFix.size, 'files');