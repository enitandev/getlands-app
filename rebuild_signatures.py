import re

with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

# 1. Fix the stylesheet - replace signatureBox, signatureImage, signatureLine
old_styles = """signatureBox: {
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
  },"""

new_styles = """signatureBox: {
    width: '30%',
  },
  signatureImage: {
    width: 100,
    height: 50,
    marginBottom: -5,
  },
  signatureLine: {
    borderTop: '1px solid #333',
    paddingTop: 5,
    marginTop: 5,
  },"""

content = content.replace(old_styles, new_styles)

# 2. Fix the JSX structure
# Extract the 3 image base64 strings
pm_sig_match = re.search(r'<Image src="([^"]+)" style=\{styles\.signatureImage\} />\s*<View style=\{styles\.signatureLine\}>\s*<Text style=\{styles\.bold\}>For: GETLANDS', content)
pm_sig = pm_sig_match.group(1) if pm_sig_match else ''

lawyer_sig_match = re.search(r'<Image src="([^"]+)" style=\{styles\.signatureImage\} />\s*<View style=\{styles\.signatureLine\}>\s*<Text style=\{styles\.bold\}>LEGAL COUNSEL', content)
lawyer_sig = lawyer_sig_match.group(1) if lawyer_sig_match else ''

nba_seal_match = re.search(r'<Image src="([^"]+)" style=\{\{ width: 60', content)
nba_seal = nba_seal_match.group(1) if nba_seal_match else ''

if not pm_sig or not lawyer_sig or not nba_seal:
    print(f"MISSING: pm_sig={'yes' if pm_sig else 'NO'}, lawyer_sig={'yes' if lawyer_sig else 'NO'}, nba_seal={'yes' if nba_seal else 'NO'}")
    exit(1)

# Replace the entire signature section
sig_regex = r'<View style=\{styles\.signatureSection\}>[\s\S]*?</View>\s*</View>\s*</View>'

# The key insight: 
# - PM signature: Image sits ABOVE the line, then the line with text below
# - Lawyer signature: Image sits ABOVE the line, then the line with text below, then NBA seal AFTER the signatureLine view
# - Subscriber: just the line with text
sig_new = f'''        <View style={{styles.signatureSection}}>
          <View style={{styles.signatureBox}}>
            <Image src="{pm_sig}" style={{styles.signatureImage}} />
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>For: GETLANDS</Text>
              <Text>Programme Manager</Text>
            </View>
          </View>

          <View style={{styles.signatureBox}}>
            <Image src="{lawyer_sig}" style={{styles.signatureImage}} />
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>LEGAL COUNSEL</Text>
              <Text>Chief Wakeel Olawale Liady</Text>
              <Text style={{{{fontSize: 8, color: '#666'}}}}>Principal Partner, The Bridge Chambers</Text>
            </View>
            <Image src="{nba_seal}" style={{{{ width: 60, height: 60, alignSelf: 'center', marginTop: 8 }}}} />
          </View>
          
          <View style={{styles.signatureBox}}>
            <View style={{{{ marginTop: 55 }}}}></View>
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>For: THE SUBSCRIBER</Text>
              <Text>{{user.firstName}} {{user.lastName}}</Text>
            </View>
          </View>
        </View>'''

content = re.sub(sig_regex, sig_new, content)

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(content)

print("SUCCESS: All images found and layout rebuilt")
