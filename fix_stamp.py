import re

with open('src/components/pdf/ReceiptTemplate.tsx', 'r') as f:
    content = f.read()

# Replace SVG stamp with a pure View-based stamp
old_stamp = """
              {/* SVG Stamp */}
              <Svg viewBox="0 0 100 100" style={styles.stamp}>
                <Circle cx="50" cy="50" r="45" stroke="#008b45" strokeWidth="2" fill="none" />
                <Circle cx="50" cy="50" r="40" stroke="#008b45" strokeWidth="1" fill="none" strokeDasharray="4,4" />
                <Text x="16" y="55" fill="#008b45" style={{ fontSize: 14, fontWeight: 'bold' }}>APPROVED</Text>
                <Text x="32" y="32" fill="#008b45" style={{ fontSize: 8 }}>GETLANDS</Text>
                <Text x="32" y="75" fill="#008b45" style={{ fontSize: 8 }}>OFFICIAL</Text>
              </Svg>
"""

new_stamp = """
              {/* CSS Stamp */}
              <View style={{
                position: 'absolute',
                top: -30,
                left: 120,
                width: 100,
                height: 100,
                borderRadius: 50,
                border: '2px solid #008b45',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.6,
                transform: 'rotate(-15deg)',
              }}>
                <View style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  border: '1px dashed #008b45',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ color: '#008b45', fontSize: 10, marginBottom: 5 }}>GETLANDS</Text>
                  <Text style={{ color: '#008b45', fontSize: 16, fontWeight: 'bold' }}>APPROVED</Text>
                  <Text style={{ color: '#008b45', fontSize: 8, marginTop: 5 }}>OFFICIAL</Text>
                </View>
              </View>
"""

content = content.replace(old_stamp.strip(), new_stamp.strip())

with open('src/components/pdf/ReceiptTemplate.tsx', 'w') as f:
    f.write(content)
