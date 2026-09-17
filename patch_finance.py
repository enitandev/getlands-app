with open('src/app/admin/finance/ClientAdminFinance.tsx', 'r') as f:
    content = f.read()

# The original file has hardcoded divs for pending and history
# I will use a regex or string replacement to completely replace the <div className="divide-y divide-black/5"> blocks.

# This is a bit risky with string replace on large blocks. 
# Better to completely overwrite the file.
