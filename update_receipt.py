import base64
import re

# 1. Base64 encode the uploaded signature
signature_path = '/Users/emekaabraham/.gemini/antigravity/brain/aea9b06c-bb03-4295-88f5-0d6a397d1d0f/.user_uploaded/media_1789989341835.png'
with open(signature_path, 'rb') as f:
    sig_data = f.read()
sig_b64 = "data:image/png;base64," + base64.b64encode(sig_data).decode('utf-8')

# 2. Read the current template
with open('src/components/pdf/ReceiptTemplate.tsx', 'r') as f:
    content = f.read()

# 3. Remove taglines
content = re.sub(r'<Text style=\{styles\.tagline\}>BUILDING VALUE THROUGH</Text>', '', content)
content = re.sub(r'<Text style=\{styles\.tagline\}>STRATEGIC COMMODITY MANAGEMENT\.</Text>', '', content)
content = re.sub(r'<Text style=\{styles\.bottomBarText\}>STRATEGIC \. TRANSPARENT \. TRUSTED</Text>', '', content)

# 4. Replace signature text with Image
# First, add a style for the signature image
content = content.replace(
    'signatureText: {',
    "signatureImage: {\n    position: 'absolute',\n    top: -20,\n    left: 10,\n    width: 100,\n    height: 'auto',\n    zIndex: 10,\n  },\n  signatureText: {"
)

# Then replace the signatureText element with the Image
content = re.sub(
    r'<Text style=\{styles\.signatureText\}>E\. Bello</Text>',
    f'<Image src={{"{sig_b64}"}} style={{styles.signatureImage}} />',
    content
)

# 5. Fix Footer Positioning
# Move the footer outside of contentContainer so it anchors to the bottom of the Page correctly
content = content.replace(
    '          {/* Footer */}\n          <View style={styles.footer}>',
    '        </View>\n\n        {/* Footer */}\n        <View style={styles.footer}>'
)

# Remove the extra closing tag that was left behind
content = content.replace(
    '          </View>\n        </View>\n\n        <View style={styles.bottomBar}>',
    '          </View>\n\n        <View style={styles.bottomBar}>'
)

with open('src/components/pdf/ReceiptTemplate.tsx', 'w') as f:
    f.write(content)
