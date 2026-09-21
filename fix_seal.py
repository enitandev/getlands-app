import re

with open('src/components/pdf/CertificateTemplate.tsx', 'r') as f:
    cert = f.read()

# 1. Remove the seal from the signaturesRow
seal_regex = r'              <View style=\{styles\.seal\}>\s*<View style=\{styles\.sealInner\}>\s*<Text style=\{\{fontSize: 8, color: \'#d4af37\', fontWeight: \'bold\'\}\}>GETLANDS</Text>\s*<Text style=\{\{fontSize: 6, color: \'#d4af37\'\}\}>SEAL</Text>\s*</View>\s*</View>'
cert = re.sub(seal_regex, '', cert)

# 2. Extract the text block that we want to wrap
text_block = """
            <Text style={styles.subscribedText}>has successfully subscribed to the</Text>
            <Text style={styles.programmeText}>{opportunity.title.toUpperCase()}</Text>
            
            <View style={styles.batchBadge}>
              <Text style={styles.batchBadgeText}>{cohort ? cohort.name.toUpperCase() : 'STANDARD BATCH'}</Text>
            </View>
"""

new_text_block = """
            <View style={{ width: '100%', alignItems: 'center', position: 'relative' }}>
              <Text style={styles.subscribedText}>has successfully subscribed to the</Text>
              <Text style={styles.programmeText}>{opportunity.title.toUpperCase()}</Text>
              
              <View style={styles.batchBadge}>
                <Text style={styles.batchBadgeText}>{cohort ? cohort.name.toUpperCase() : 'STANDARD BATCH'}</Text>
              </View>

              <View style={[styles.seal, { position: 'absolute', right: 60, top: -10 }]}>
                <View style={styles.sealInner}>
                  <Text style={{fontSize: 8, color: '#d4af37', fontWeight: 'bold'}}>GETLANDS</Text>
                  <Text style={{fontSize: 6, color: '#d4af37'}}>SEAL</Text>
                </View>
              </View>
            </View>
"""

cert = cert.replace(text_block.strip(), new_text_block.strip())

with open('src/components/pdf/CertificateTemplate.tsx', 'w') as f:
    f.write(cert)
