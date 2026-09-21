import base64
import re

with open('public/assets/getlands-logo.png', 'rb') as f:
    logo_data = f.read()

logo_b64 = "data:image/png;base64," + base64.b64encode(logo_data).decode('utf-8')

with open('src/components/pdf/ReceiptTemplate.tsx', 'r') as f:
    content = f.read()

# Replace both occurrences of the image src
content = content.replace("src={`${baseUrl}/assets/getlands-logo.png`}", f"src={{`{logo_b64}`}}")

with open('src/components/pdf/ReceiptTemplate.tsx', 'w') as f:
    f.write(content)
