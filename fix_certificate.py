import re

with open('src/components/pdf/CertificateTemplate.tsx', 'r') as f:
    cert = f.read()

cert = cert.replace('₦{holding.totalAmount.toLocaleString()}', 'NGN {holding.totalAmount.toLocaleString()}')

maturity_logic = """
  const dateObj = new Date(holding.dateAcquired || holding.createdAt || Date.now());
  
  let durationMonths = 0;
  if (opportunity.duration) {
    const match = opportunity.duration.match(/(\\d+)\\s*(MONTH|YEAR)/i);
    if (match) {
      durationMonths = parseInt(match[1]);
      if (match[2].toUpperCase().startsWith('YEAR')) durationMonths *= 12;
    }
  }
  durationMonths = durationMonths || 6;
  const maturityDate = new Date(dateObj);
  maturityDate.setMonth(maturityDate.getMonth() + durationMonths);
"""

cert = cert.replace(
    '  const dateObj = new Date(holding.dateAcquired || holding.createdAt || Date.now());',
    maturity_logic.strip()
)

cert = cert.replace(
    "On or before {cohort?.closesAt ? new Date(cohort.closesAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Maturity'}",
    "On or before {maturityDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}"
)

sig_removal = r"""              <View style=\{styles\.signatureBox\}>\s*<View style=\{styles\.signatureLine\}>\s*<Text style=\{styles\.signatureTitle\}>AUTHORIZED SIGNATORY</Text>\s*<Text style=\{styles\.signatureCompany\}>GETLANDS</Text>\s*</View>\s*</View>"""
cert = re.sub(sig_removal, '', cert)

with open('src/components/pdf/CertificateTemplate.tsx', 'w') as f:
    f.write(cert)

with open('src/components/pdf/ReceiptTemplate.tsx', 'r') as f:
    receipt = f.read()
receipt = receipt.replace('<Text style={styles.currencySymbol}>₦</Text>', '<Text style={styles.currencySymbol}>NGN</Text>')
with open('src/components/pdf/ReceiptTemplate.tsx', 'w') as f:
    f.write(receipt)
