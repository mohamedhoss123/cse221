#!/bin/bash

# Array of files
FILES=(
  "src/routes/customer/payments/\$invoiceId.tsx"
  "src/routes/customer/rooms/\$id.tsx"
  "src/routes/customer/bookings.tsx"
  "src/routes/customer/bookings.\$id.tsx"
  "src/routes/customer/complaints.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file"
    
    # Replace explicit hex text colors
    sed -i 's/text-\[#000\]/text-\[var(--expressive-text)\]/g' "$file"
    
    # Replace slate colors
    sed -i 's/text-slate-600/text-\[var(--expressive-text)\]/g' "$file"
    sed -i 's/text-slate-500/text-\[var(--expressive-text)\]/g' "$file"
    sed -i 's/border-slate-200/border-2 border-\[var(--expressive-secondary)\] shadow-\[4px_4px_0_0_var(--expressive-secondary)\]/g' "$file"
    sed -i 's/border-slate-300/border-2 border-\[var(--expressive-secondary)\] shadow-\[4px_4px_0_0_var(--expressive-secondary)\]/g' "$file"
    
    # Replace background colors
    sed -i 's/bg-white/bg-\[var(--expressive-surface)\]/g' "$file"
    sed -i 's/bg-slate-50/bg-\[var(--expressive-background)\]/g' "$file"
    
    # Rounded corners
    sed -i 's/rounded-lg/rounded-xl/g' "$file"
    sed -i 's/rounded-md/rounded-xl/g' "$file"

    # Some complex replacement for borders on interactive elements
    sed -i 's/className="border-slate-300"/className="border-2 border-\[var(--expressive-secondary)\] shadow-\[4px_4px_0_0_var(--expressive-secondary)\] rounded-xl"/g' "$file"

  fi
done

echo "Done"
