import re

with open('src/components/pdf/ReceiptTemplate.tsx', 'r') as f:
    receipt_content = f.read()

logo_match = re.search(r'src=\{`([^`]+)`\} style=\{styles\.logo\}', receipt_content)
logo_b64 = logo_match.group(1) if logo_match else ''

sig_match = re.search(r'src=\{"([^"]+)"\} style=\{styles\.signatureImage\}', receipt_content)
sig_b64 = sig_match.group(1) if sig_match else ''

with open('src/components/pdf/CertificateTemplate.tsx', 'r') as f:
    cert_content = f.read()

cert_content = cert_content.replace('LOGO_BASE64_PLACEHOLDER', logo_b64)
cert_content = cert_content.replace('SIGNATURE_BASE64_PLACEHOLDER', sig_b64)

with open('src/components/pdf/CertificateTemplate.tsx', 'w') as f:
    f.write(cert_content)
