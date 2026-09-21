import re

with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

styles_old = """
  signatureBox: {
    width: '30%',
    position: 'relative',
  },
  signatureImage: {
    position: 'absolute',
    bottom: '100%',
    left: '5%',
    width: '90%',
    height: 'auto',
  },
  signatureLine: {
    borderTop: '1px solid #333',
    paddingTop: 5,
    marginTop: 80,
  },
"""
styles_new = """
  signatureBox: {
    width: '30%',
    position: 'relative',
  },
  signatureImage: {
    position: 'absolute',
    top: 15,
    left: '5%',
    width: '90%',
    height: 60,
    objectFit: 'contain',
  },
  signatureLine: {
    borderTop: '1px solid #333',
    paddingTop: 5,
    marginTop: 80,
  },
"""

style_block_regex = r'  signatureBox: \{[\s\S]*?marginTop: 80,\s*\},'
content = re.sub(style_block_regex, styles_new.strip() + ',', content)


# Move the signatures OUT of signatureLine, into signatureBox
sig_regex = r'<View style=\{styles\.signatureSection\}>[\s\S]*?</View>\s*</View>\s*</View>'

# Extract the existing base64 strings so we don't lose them
get_sig_match = re.search(r'<Image src="([^"]+)" style=\{styles\.signatureImage\} />\s*<Text style=\{styles\.bold\}>For: GETLANDS', content)
getlands_sig = get_sig_match.group(1) if get_sig_match else ''

liady_sig_match = re.search(r'<Image src="([^"]+)" style=\{styles\.signatureImage\} />\s*<Text style=\{styles\.bold\}>LEGAL COUNSEL', content)
liady_sig = liady_sig_match.group(1) if liady_sig_match else ''

nba_seal_match = re.search(r'<Image src="([^"]+)" style=\{\{ width: 60, height: \'auto\', alignSelf: \'center\', marginTop: 10 \}\} />', content)
nba_seal = nba_seal_match.group(1) if nba_seal_match else ''


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
              <Image src="{nba_seal}" style={{{{ width: 60, height: 60, alignSelf: 'center', marginTop: 10 }}}} />
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
