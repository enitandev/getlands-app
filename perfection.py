import re
import base64

def get_b64(path):
    with open(path, 'rb') as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode('utf-8')

# Grab the newly uploaded, pristine assets
bridge_logo = get_b64('/Users/emekaabraham/.gemini/antigravity/brain/aea9b06c-bb03-4295-88f5-0d6a397d1d0f/.user_uploaded/media_1789997232842.png')
liady_sig = get_b64('/Users/emekaabraham/.gemini/antigravity/brain/aea9b06c-bb03-4295-88f5-0d6a397d1d0f/.user_uploaded/media_1790001790878.png')
nba_seal = get_b64('/Users/emekaabraham/.gemini/antigravity/brain/aea9b06c-bb03-4295-88f5-0d6a397d1d0f/.user_uploaded/media_1790001776215.png')

# Extract Getlands assets
with open('src/components/pdf/CertificateTemplate.tsx', 'r') as f:
    cert = f.read()

get_logo_m = re.search(r'src="([^"]+)" style=\{styles\.logo\}', cert)
getlands_logo = get_logo_m.group(1) if get_logo_m else ''

get_sig_m = re.search(r'src="([^"]+)" style=\{styles\.signatureImage\}', cert)
getlands_sig = get_sig_m.group(1) if get_sig_m else ''

# Rewrite AgreementTemplate
with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

# 1. Update Stylesheet for robust positioning
styles_old = """
  signatureBox: {
    width: '30%',
    position: 'relative',
  },
  signatureImage: {
    position: 'absolute',
    bottom: 35,
    left: 0,
    width: 100,
    height: 'auto',
  },
  signatureLine: {
    borderTop: '1px solid #333',
    paddingTop: 5,
    marginTop: 70,
  },
"""
styles_new = """
  signatureBox: {
    width: '30%',
    position: 'relative',
    height: 120,
    justifyContent: 'flex-end',
  },
  signatureImage: {
    position: 'absolute',
    bottom: 45,
    left: '5%',
    width: '90%',
    height: 'auto',
  },
  signatureLine: {
    borderTop: '1px solid #333',
    paddingTop: 5,
  },
"""
# Since styling replacements can be flaky, we'll use regex for the whole block
style_block_regex = r'  signatureBox: \{[\s\S]*?marginTop: 70,\s*\},'
content = re.sub(style_block_regex, styles_new.strip() + ',', content)

# 2. Perfect Header
header_regex = r'<View style=\{styles\.header\}>[\s\S]*?</View>\s*</View>'
header_new = f"""
        <View style={{styles.header}}>
          <Image src="{bridge_logo}" style={{ width: 70, height: 'auto' }} />
          <Image src="{getlands_logo}" style={{ width: 130, height: 'auto' }} />
          <View style={{ width: '40%' }}>
            <Text style={{styles.headerText}}>3rd Floor, Okedara Building, Beside Jendol Superstores, Alakuko, Lagos State.</Text>
            <Text style={{styles.headerText}}>+234 913 348 5636 | www.getlands.shop</Text>
          </View>
        </View>
"""
content = re.sub(header_regex, header_new.strip(), content)

# 3. Perfect Signatures
sig_regex = r'<View style=\{styles\.signatureSection\}>[\s\S]*?</View>\s*</View>\s*</View>'
sig_new = f"""
        <View style={{styles.signatureSection}}>
          <View style={{styles.signatureBox}}>
            <Image src="{getlands_sig}" style={{styles.signatureImage}} />
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>For: GETLANDS</Text>
              <Text>Programme Manager</Text>
            </View>
          </View>

          <View style={{styles.signatureBox}}>
            <Image src="{liady_sig}" style={{styles.signatureImage}} />
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>LEGAL COUNSEL</Text>
              <Text>Chief Wakeel Olawale Liady</Text>
              <Text style={{{{fontSize: 8, color: '#666'}}}}>Principal Partner, The Bridge Chambers</Text>
            </View>
            <Image src="{nba_seal}" style={{{{ width: 60, height: 'auto', alignSelf: 'center', marginTop: 10 }}}} />
          </View>
          
          <View style={{styles.signatureBox}}>
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>For: THE SUBSCRIBER</Text>
              <Text>{{user.firstName}} {{user.lastName}}</Text>
            </View>
          </View>
        </View>
"""
content = re.sub(sig_regex, sig_new.strip(), content)

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(content)
