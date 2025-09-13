#!/usr/bin/env python3

def validate_seed():
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql', 'r') as f:
        lines = f.readlines()
    
    # Find the INSERT INTO products statement
    in_insert = False
    columns = []
    
    for i, line in enumerate(lines):
        if 'INSERT INTO products (' in line:
            in_insert = True
            print(f"Found INSERT at line {i+1}")
            continue
        
        if in_insert and ') VALUES' in line:
            print(f"Found end of columns at line {i+1}")
            break
            
        if in_insert:
            # Extract column names
            cols = [c.strip() for c in line.strip().split(',') if c.strip()]
            columns.extend(cols)
    
    print(f"\nTotal columns: {len(columns)}")
    print("Columns:", columns[:5], "...", columns[-5:])
    
    # Now find first product values
    in_values = False
    values = []
    
    for i, line in enumerate(lines):
        if '    700, NULL,' in line or '    700,' in line:
            in_values = True
            print(f"\nFound product 700 at line {i+1}")
            # First line has ID and brand_id
            if 'NULL' in line:
                values.extend(['700', 'NULL'])
            else:
                values.append('700')
            continue
            
        if in_values:
            if line.strip().startswith(');'):
                print(f"Found end of values at line {i+1}")
                break
            
            # Count commas to determine values
            # Each line typically has one value
            val = line.strip().rstrip(',')
            if val:
                values.append(val)
    
    print(f"\nTotal values: {len(values)}")
    print("First 5 values:", values[:5])
    print("Last 5 values:", values[-5:] if len(values) > 5 else values)
    
    if len(columns) != len(values):
        print(f"\n❌ MISMATCH: {len(columns)} columns vs {len(values)} values")
        print(f"Difference: {abs(len(columns) - len(values))}")
    else:
        print(f"\n✅ Match: {len(columns)} columns and values")

if __name__ == '__main__':
    validate_seed()