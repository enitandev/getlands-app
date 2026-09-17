with open('src/app/checkout/ClientCheckout.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith('export default function CheckoutPage() {'):
        break
    new_lines.append(line)

with open('src/app/checkout/ClientCheckout.tsx', 'w') as f:
    f.writelines(new_lines)
