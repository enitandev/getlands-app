import base64
import re

def get_b64(path):
    with open(path, 'rb') as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode('utf-8')

bridge_logo = get_b64('/Users/emekaabraham/.gemini/antigravity/brain/aea9b06c-bb03-4295-88f5-0d6a397d1d0f/.user_uploaded/media_1789997232842.png')
liady_sig = get_b64('/Users/emekaabraham/.gemini/antigravity/brain/aea9b06c-bb03-4295-88f5-0d6a397d1d0f/.user_uploaded/media_1789997262637.png')
nba_seal = get_b64('/Users/emekaabraham/.gemini/antigravity/brain/aea9b06c-bb03-4295-88f5-0d6a397d1d0f/.user_uploaded/media_1789997636285.png')

with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

# 1. Update Header
header_old = """
        <View style={styles.header}>
          <Image src={`{{logo_b64}}`} style={styles.logo} />
          <View>
            <Text style={styles.headerText}>1B Unity Road, Sango Ota, Ogun State</Text>
            <Text style={styles.headerText}>+234 913 348 5636 | www.getlands.shop</Text>
          </View>
        </View>
"""

# Extract the real logo_b64
logo_match = re.search(r'src=\{`(data:image/png;base64,[^`]+)`\} style=\{styles\.logo\}', content)
original_logo = logo_match.group(1) if logo_match else ''

header_new = f"""
        <View style={{styles.header}}>
          <Image src={{`{bridge_logo}`}} style={{ width: 80 }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image src={{`{original_logo}`}} style={{styles.logo}} />
          </View>
          <View>
            <Text style={{styles.headerText}}>1B Unity Road, Sango Ota, Ogun State</Text>
            <Text style={{styles.headerText}}>+234 913 348 5636 | www.getlands.shop</Text>
          </View>
        </View>
"""

# We just replace the header based on substring matching, but since logo_b64 is dynamic, we use regex.
header_regex = r'<View style=\{styles\.header\}>\s*<Image src=\{`[^`]+`\} style=\{styles\.logo\} />\s*<View>\s*<Text style=\{styles\.headerText\}>1B Unity Road, Sango Ota, Ogun State</Text>\s*<Text style=\{styles\.headerText\}>\+234 913 348 5636 \| www\.getlands\.shop</Text>\s*</View>\s*</View>'
content = re.sub(header_regex, header_new.strip(), content)


# 2. Update Signatures
sig_match = re.search(r'src=\{`(data:image/png;base64,[^`]+)`\} style=\{styles\.signatureImage\}', content)
original_sig = sig_match.group(1) if sig_match else ''

sig_old = """
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Image src={`{{sig_b64}}`} style={styles.signatureImage} />
            <View style={styles.signatureLine}>
              <Text style={styles.bold}>For: GETLANDS</Text>
              <Text>Programme Manager</Text>
            </View>
          </View>
          
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Text style={styles.bold}>For: THE SUBSCRIBER</Text>
              <Text>{user.firstName} {user.lastName}</Text>
            </View>
          </View>
        </View>
"""

sig_new = f"""
        <View style={{styles.signatureSection}}>
          <View style={{styles.signatureBox}}>
            <Image src={{`{original_sig}`}} style={{styles.signatureImage}} />
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>For: GETLANDS</Text>
              <Text>Programme Manager</Text>
            </View>
          </View>

          <View style={{styles.signatureBox}}>
            <Image src={{`{liady_sig}`}} style={{styles.signatureImage}} />
            <Image src={{`{nba_seal}`}} style={{ position: 'absolute', top: -70, right: -10, width: 70, height: 70, opacity: 0.9 }} />
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>LEGAL COUNSEL</Text>
              <Text>Chief Wakeel Olawale Liady</Text>
              <Text style={{{{fontSize: 8, color: '#666'}}}}>Principal Partner, The Bridge Chambers</Text>
            </View>
          </View>
          
          <View style={{styles.signatureBox}}>
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>For: THE SUBSCRIBER</Text>
              <Text>{{user.firstName}} {{user.lastName}}</Text>
            </View>
          </View>
        </View>
"""

# Find the start and end of signatureSection to replace it cleanly
sig_section_start = content.find('<View style={styles.signatureSection}>')
footer_start = content.find('<Text style={styles.footer}>')

if sig_section_start != -1 and footer_start != -1:
    content = content[:sig_section_start] + sig_new.strip() + '\n\n        ' + content[footer_start:]

# Change width to 30%
content = content.replace("width: '40%',", "width: '30%',")

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(content)
