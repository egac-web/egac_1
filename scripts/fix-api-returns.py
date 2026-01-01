#!/usr/bin/env python3
"""
Fix old-style Astro return statements to use new Response objects.
Converts: return { status: 400, body: { ok: false } }
To: return new Response(JSON.stringify({ ok: false }), { status: 400, headers: { 'Content-Type': 'application/json' } })
"""

import re
import sys
from pathlib import Path

def fix_return_statement(match):
    """Convert old-style return to new Response format"""
    indent = match.group(1)
    status = match.group(2)
    body = match.group(3)
    
    # Clean up body - remove outer braces if present
    body = body.strip()
    
    return f'''{indent}return new Response(JSON.stringify({body}), {{
{indent}  status: {status},
{indent}  headers: {{ 'Content-Type': 'application/json' }}
{indent}}});'''

def process_file(filepath):
    """Process a single file"""
    print(f"Processing {filepath}")
    
    content = filepath.read_text()
    original = content
    
    # Pattern to match: return { status: XXX, body: { ... } };
    # This handles multi-line bodies
    pattern = r'^(\s*)return\s*{\s*status:\s*(\d+),\s*body:\s*(\{[^}]*(?:\{[^}]*\}[^}]*)*\})\s*};'
    
    content = re.sub(pattern, fix_return_statement, content, flags=re.MULTILINE)
    
    if content != original:
        filepath.write_text(content)
        print(f"  ✓ Updated {filepath}")
        return True
    else:
        print(f"  - No changes needed for {filepath}")
        return False

def main():
    # Find all API JS files
    api_dir = Path('src/pages/api')
    
    if not api_dir.exists():
        print("Error: src/pages/api directory not found")
        sys.exit(1)
    
    js_files = list(api_dir.rglob('*.js'))
    updated = 0
    
    for js_file in js_files:
        if js_file.name == 'test-post.js':
            continue
        if process_file(js_file):
            updated += 1
    
    print(f"\n✓ Updated {updated} files")

if __name__ == '__main__':
    main()
