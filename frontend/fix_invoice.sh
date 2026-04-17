#!/bin/bash
file="src/routes/customer/payments/\$invoiceId.tsx"

sed -i 's/border border-2/border-2/g' "$file"
sed -i 's/className="sm:max-w-md"/className="sm:max-w-md border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-2xl"/g' "$file"
sed -i 's/<SelectContent>/<SelectContent className="border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-xl">/g' "$file"

