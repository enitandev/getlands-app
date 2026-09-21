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

# 1. Update the Header to include The Bridge Chambers logo
header_regex = r'<View style=\{styles\.header\}>\s*<Image src=\{`[^`]+`\} style=\{styles\.logo\} />\s*<View>\s*<Text style=\{styles\.headerText\}>1B Unity Road, Sango Ota, Ogun State</Text>\s*<Text style=\{styles\.headerText\}>\+234 913 348 5636 \| www\.getlands\.shop</Text>\s*</View>\s*</View>'

new_header = f"""
        <View style={{styles.header}}>
          <Image src={{`{bridge_logo}`}} style={{ width: 80 }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image src={{`{{logo_b64}}`}} style={{styles.logo}} />
          </View>
          <View>
            <Text style={{styles.headerText}}>1B Unity Road, Sango Ota, Ogun State</Text>
            <Text style={{styles.headerText}}>+234 913 348 5636 | www.getlands.shop</Text>
          </View>
        </View>
"""

# Wait, `logo_b64` is an embedded string literal in the file, so I need to preserve the original logo.
# Let's extract the original logo_b64 from the file first.
logo_match = re.search(r'src=\{`(data:image/png;base64,[^`]+)`\} style=\{styles\.logo\}', content)
if logo_match:
    original_logo = logo_match.group(1)
    new_header = new_header.replace('{{logo_b64}}', original_logo)

content = re.sub(header_regex, new_header.strip(), content)

# 2. Update the signatures section to add the Legal Counsel block
sig_section_regex = r'<View style=\{styles\.signatureSection\}>[\s\S]*?</View>\s*</View>'

new_sig_section = f"""
        <View style={{styles.signatureSection}}>
          <View style={{styles.signatureBox}}>
            <Image src={{`{{sig_b64}}`}} style={{styles.signatureImage}} />
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>For: GETLANDS</Text>
              <Text>Programme Manager</Text>
            </View>
          </View>

          <View style={{styles.signatureBox}}>
            <Image src={{`{liady_sig}`}} style={{styles.signatureImage}} />
            <Image src={{`{nba_seal}`}} style={{ position: 'absolute', top: -70, right: 0, width: 80, height: 80, opacity: 0.9 }} />
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>LEGAL COUNSEL</Text>
              <Text>Chief Wakeel Olawale Liady</Text>
              <Text style={{fontSize: 8, color: '#666'}}>Principal Partner, The Bridge Chambers</Text>
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

# Extract the original signature
sig_match = re.search(r'src=\{`(data:image/png;base64,[^`]+)`\} style=\{styles\.signatureImage\}', content)
if sig_match:
    original_sig = sig_match.group(1)
    new_sig_section = new_sig_section.replace('{{sig_b64}}', original_sig)

content = re.sub(sig_section_regex, new_sig_section.strip(), content)

# Also update the stylesheet to support a 3-column signature layout
content = content.replace("width: '40%',", "width: '30%',")

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(content)
