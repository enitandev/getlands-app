with open('src/app/checkout/ClientCheckout.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_lines.append(line)
    if line.strip() == '}' and new_lines[-2].strip() == ');':
        break

with open('src/app/checkout/ClientCheckout.tsx', 'w') as f:
    f.writelines(new_lines)
