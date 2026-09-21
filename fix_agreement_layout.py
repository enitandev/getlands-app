import re

with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

# 1. Update Address in Header and Body
content = content.replace(
    "1B Unity Road, Sango Ota, Ogun State",
    "3rd Floor, Okedara Building, Beside Jendol Superstores, Alakuko, Lagos State."
)

# 2. Fix Investment Details formatting
old_investment = """
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>2.1 Subscription Units:</Text> The Subscriber has purchased {holding.units || 1} slot(s).{'\n'}
          <Text style={styles.bold}}>2.2 Total Principal Amount:</Text> NGN {holding.totalAmount.toLocaleString()} (the "Principal").{'\n'}
          <Text style={styles.bold}}>2.3 Projected Return:</Text> {opportunity.projectedReturn || 'As stipulated in the programme details'}{'\n'}
          <Text style={styles.bold}}>2.4 Maturity Date:</Text> The investment lifecycle spans {opportunity.duration || 'the designated period'} and shall mature on or before <Text style={styles.bold}>{formattedMaturity}</Text>.
        </Text>
"""

new_investment = """
        <View style={{ marginBottom: 15 }}>
          <Text style={{ marginBottom: 5 }}><Text style={styles.bold}>2.1 Subscription Units:</Text> The Subscriber has purchased {holding.units || 1} slot(s).</Text>
          <Text style={{ marginBottom: 5 }}><Text style={styles.bold}>2.2 Total Principal Amount:</Text> NGN {holding.totalAmount.toLocaleString()} (the "Principal").</Text>
          <Text style={{ marginBottom: 5 }}><Text style={styles.bold}>2.3 Projected Return:</Text> {opportunity.projectedReturn || 'As stipulated in the programme details'}.</Text>
          <Text style={{ marginBottom: 5 }}><Text style={styles.bold}>2.4 Maturity Date:</Text> The investment lifecycle spans {opportunity.duration || 'the designated period'} and shall mature on or before <Text style={styles.bold}>{formattedMaturity}</Text>.</Text>
        </View>
"""

# Try to find and replace the block
investment_regex = r'<Text style=\{styles\.paragraph\}>\s*<Text style=\{styles\.bold\}>2\.1 Subscription Units:</Text>[\s\S]*?\{formattedMaturity\}</Text>\.\s*</Text>'
content = re.sub(investment_regex, new_investment.strip(), content)


# 3. Fix Signatures and NBA Seal
# First, fix signatureImage styles to sit perfectly on the line
content = content.replace(
    "top: -40,",
    "bottom: 35," # Since the line text takes up space, 35 pushes it up precisely to rest on the borderTop
)

content = content.replace(
    "signatureLine: {\n    borderTop: '1px solid #333',\n    paddingTop: 5,\n    marginTop: 40,\n  }",
    "signatureLine: {\n    borderTop: '1px solid #333',\n    paddingTop: 5,\n    marginTop: 70,\n  }"
)

# Move NBA Seal below the text and remove stretching
seal_old = r'<Image src=\{`data:image/png;base64,[^`]+`\} style=\{\{\s*position: \'absolute\',\s*top: -70,\s*right: -10,\s*width: 70,\s*height: 70,\s*opacity: 0\.9\s*\}\}\s*/>'
seal_match = re.search(seal_old, content)

if seal_match:
    seal_element = seal_match.group(0)
    # Remove from its current position
    content = content.replace(seal_element, '')
    
    # Fix the seal element styles for normal flow
    new_seal_element = seal_element.replace(
        "style={{ position: 'absolute', top: -70, right: -10, width: 70, height: 70, opacity: 0.9 }}",
        "style={{ width: 70, height: 'auto', alignSelf: 'center', marginTop: 10 }}"
    )
    
    # Inject it after the text "Principal Partner, The Bridge Chambers"
    target_text = "<Text style={{fontSize: 8, color: '#666'}}>Principal Partner, The Bridge Chambers</Text>"
    content = content.replace(
        target_text,
        target_text + '\n              ' + new_seal_element
    )

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(content)
