#!/bin/bash
file="src/routes/customer/rooms/\$id.tsx"

# Let's see if there are missing borders
sed -i 's/border border-2/border-2/g' "$file"

file2="src/routes/customer/bookings.tsx"
sed -i 's/border border-2/border-2/g' "$file2"

file3="src/routes/customer/bookings.\$id.tsx"
sed -i 's/border border-2/border-2/g' "$file3"

file4="src/routes/customer/complaints.tsx"
sed -i 's/border border-2/border-2/g' "$file4"

