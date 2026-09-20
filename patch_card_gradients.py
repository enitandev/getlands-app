import re

# 1. Fix FarmCard
with open('src/components/ui/FarmCard.tsx', 'r') as f:
    content = f.read()

# Replace the gradient overlay
old_gradient = '<div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(4,13,8,0.05)] via-[40%] to-[#09160e] to-[69%]" />'
new_gradient = '<div className="absolute inset-0 bg-gradient-to-t from-[#09160e] from-[55%] via-[#09160e]/80 via-[75%] to-transparent" />'

content = content.replace(old_gradient, new_gradient)

# Reduce the image height to give more room to the dark area
content = content.replace(
    'inset-[0_0_42%_0]',
    'inset-[0_0_50%_0]'
)

with open('src/components/ui/FarmCard.tsx', 'w') as f:
    f.write(content)

