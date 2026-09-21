import re
import base64

def get_b64(path):
    with open(path, 'rb') as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode('utf-8')

bridge_logo = get_b64('/Users/emekaabraham/.gemini/antigravity/brain/aea9b06c-bb03-4295-88f5-0d6a397d1d0f/.user_uploaded/media_1789997232842.png')
liady_sig = get_b64('/Users/emekaabraham/.gemini/antigravity/brain/aea9b06c-bb03-4295-88f5-0d6a397d1d0f/.user_uploaded/media_1789997262637.png')
nba_seal = get_b64('/Users/emekaabraham/.gemini/antigravity/brain/aea9b06c-bb03-4295-88f5-0d6a397d1d0f/.user_uploaded/media_1789997636285.png')

with open('src/components/pdf/CertificateTemplate.tsx', 'r') as f:
    cert = f.read()

getlands_logo_match = re.search(r'src="([^"]+)" style=\{styles\.logo\}', cert)
getlands_logo = getlands_logo_match.group(1) if getlands_logo_match else ''

getlands_sig_match = re.search(r'src="([^"]+)" style=\{styles\.signatureImage\}', cert)
getlands_sig = getlands_sig_match.group(1) if getlands_sig_match else ''

if not getlands_logo or not getlands_sig:
    print("STILL FAILED TO FIND LOGOS")

with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

header_regex = r'<View style=\{styles\.header\}>[\s\S]*?</View>\s*</View>'

header_new = f"""
        <View style={{styles.header}}>
          <Image src="{bridge_logo}" style={{ width: 80 }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image src="{getlands_logo}" style={{styles.logo}} />
          </View>
          <View>
            <Text style={{styles.headerText}}>3rd Floor, Okedara Building, Beside Jendol Superstores, Alakuko, Lagos State.</Text>
            <Text style={{styles.headerText}}>+234 913 348 5636 | www.getlands.shop</Text>
          </View>
        </View>
"""
content = re.sub(header_regex, header_new.strip(), content)

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
              <Image src="{nba_seal}" style={{{{ width: 70, height: 'auto', alignSelf: 'center', marginTop: 10 }}}} />
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
content = re.sub(sig_regex, sig_new.strip(), content)

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(content)
