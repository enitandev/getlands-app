import re

with open('src/components/pdf/CertificateTemplate.tsx', 'r') as f:
    cert = f.read()

sig_match = re.search(r'src=\{"(data:image[^"]+)"\} style=\{styles\.signatureImage\}', cert)
if not sig_match:
    sig_match = re.search(r'src=\{`(data:image[^`]+)`\} style=\{styles\.signatureImage\}', cert)
sig_b64 = sig_match.group(1) if sig_match else ''

with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    agreement = f.read()

agreement = re.sub(
    r'<Image src=\{``\} style=\{styles\.signatureImage\} />',
    f'<Image src={{`{sig_b64}`}} style={{styles.signatureImage}} />',
    agreement
)

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(agreement)
