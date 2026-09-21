import re
import os

with open('src/components/pdf/ReceiptTemplate.tsx', 'r') as f:
    receipt_content = f.read()

# Extract logo and signature base64 strings
logo_match = re.search(r'src=\{`([^`]+)`\} style=\{styles\.logo\}', receipt_content)
logo_b64 = logo_match.group(1) if logo_match else ''

sig_match = re.search(r'src=\{"([^"]+)"\} style=\{styles\.signatureImage\}', receipt_content)
sig_b64 = sig_match.group(1) if sig_match else ''

certificate_content = f"""import React from 'react';
import {{ Document, Page, Text, View, StyleSheet, Image, Svg, Path, Circle }} from '@react-pdf/renderer';

const styles = StyleSheet.create({{
  page: {{
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  }},
  borderOuter: {{
    border: '2px solid #d4af37',
    height: '100%',
    padding: 4,
  }},
  borderInner: {{
    border: '1px solid #d4af37',
    height: '100%',
    padding: 40,
    position: 'relative',
    alignItems: 'center',
  }},
  topDecoration: {{
    position: 'absolute',
    top: -4,
    left: '50%',
    transform: 'translateX(-50)',
    width: 100,
    height: 10,
    backgroundColor: '#ffffff',
  }},
  logo: {{
    width: 130,
    marginBottom: 30,
  }},
  title: {{
    fontSize: 32,
    color: '#003319',
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 10,
    fontFamily: 'Times-Roman',
  }},
  subtitle: {{
    fontSize: 14,
    color: '#d4af37',
    letterSpacing: 4,
    marginBottom: 30,
    fontFamily: 'Times-Roman',
  }},
  certifyText: {{
    fontSize: 12,
    color: '#4a554f',
    marginBottom: 15,
  }},
  customerName: {{
    fontSize: 28,
    fontWeight: 'bold',
    color: '#102218',
    textTransform: 'uppercase',
    marginBottom: 20,
    fontFamily: 'Times-Roman',
    borderBottom: '1px solid #d4af37',
    paddingBottom: 5,
    width: '80%',
    textAlign: 'center',
  }},
  subscribedText: {{
    fontSize: 12,
    color: '#4a554f',
    marginBottom: 10,
  }},
  programmeText: {{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#102218',
    marginBottom: 10,
    fontFamily: 'Times-Roman',
  }},
  batchBadge: {{
    backgroundColor: '#d4af37',
    padding: '4 20',
    borderRadius: 2,
    marginBottom: 40,
  }},
  batchBadgeText: {{
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  }},
  statsRow: {{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTop: '1px solid #eef3ef',
    borderBottom: '1px solid #eef3ef',
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 30,
  }},
  statBox: {{
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  }},
  statLabel: {{
    fontSize: 8,
    color: '#68736d',
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  }},
  statValue: {{
    fontSize: 10,
    color: '#102218',
    fontWeight: 'bold',
    textAlign: 'center',
  }},
  statDivider: {{
    width: 1,
    backgroundColor: '#eef3ef',
    height: '100%',
  }},
  disclaimer: {{
    fontSize: 9,
    color: '#68736d',
    textAlign: 'center',
    width: '70%',
    lineHeight: 1.5,
  }},
  signaturesRow: {{
    position: 'absolute',
    bottom: 50,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  }},
  signatureBox: {{
    width: 180,
    alignItems: 'center',
    position: 'relative',
  }},
  signatureImage: {{
    position: 'absolute',
    top: -40,
    width: 100,
    height: 'auto',
    zIndex: 10,
  }},
  signatureLine: {{
    width: '100%',
    borderTop: '1px solid #102218',
    paddingTop: 8,
    alignItems: 'center',
  }},
  signatureTitle: {{
    fontSize: 9,
    fontWeight: 'bold',
    color: '#102218',
  }},
  signatureCompany: {{
    fontSize: 8,
    color: '#68736d',
    marginTop: 2,
  }},
  seal: {{
    width: 70,
    height: 70,
    borderRadius: 35,
    border: '2px solid #d4af37',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdfbf7',
  }},
  sealInner: {{
    width: 56,
    height: 56,
    borderRadius: 28,
    border: '1px dashed #d4af37',
    alignItems: 'center',
    justifyContent: 'center',
  }},
  bottomBar: {{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 25,
    backgroundColor: '#003319',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }},
  bottomBarText: {{
    color: '#d4af37',
    fontSize: 8,
    letterSpacing: 4,
  }}
}});

export const CertificateTemplate = ({{ holding }}: {{ holding: any }}) => {{
  const {{ opportunity, user, cohort }} = holding;
  const dateObj = new Date(holding.dateAcquired || holding.createdAt || Date.now());
  
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={{styles.page}}>
        <View style={{styles.borderOuter}}>
          <View style={{styles.borderInner}}>
            
            <Image src={{`{logo_b64}`}} style={{styles.logo}} />
            
            <Text style={{styles.title}}>CERTIFICATE</Text>
            <Text style={{styles.subtitle}}>OF SUBSCRIPTION</Text>
            
            <Text style={{styles.certifyText}}>This is to certify that</Text>
            <Text style={{styles.customerName}}>{{user.firstName}} {{user.lastName}}</Text>
            
            <Text style={{styles.subscribedText}}>has successfully subscribed to the</Text>
            <Text style={{styles.programmeText}}>{{opportunity.title.toUpperCase()}}</Text>
            
            <View style={{styles.batchBadge}}>
              <Text style={{styles.batchBadgeText}}>{{cohort ? cohort.name.toUpperCase() : 'STANDARD BATCH'}}</Text>
            </View>

            <View style={{styles.statsRow}}>
              <View style={{styles.statBox}}>
                <Text style={{styles.statLabel}}>SUBSCRIPTION</Text>
                <Text style={{styles.statValue}}>{{holding.units || 1}} Slot(s)</Text>
              </View>
              <View style={{styles.statDivider}} />
              <View style={{styles.statBox}}>
                <Text style={{styles.statLabel}}>SUBSCRIPTION AMOUNT</Text>
                <Text style={{styles.statValue}}>₦{{holding.totalAmount.toLocaleString()}}</Text>
              </View>
              <View style={{styles.statDivider}} />
              <View style={{styles.statBox}}>
                <Text style={{styles.statLabel}}>SUBSCRIPTION DATE</Text>
                <Text style={{styles.statValue}}>{{dateObj.toLocaleDateString('en-GB', {{ day: 'numeric', month: 'short', year: 'numeric' }})}}</Text>
              </View>
              <View style={{styles.statDivider}} />
              <View style={{styles.statBox}}>
                <Text style={{styles.statLabel}}>PROGRAMME PERIOD</Text>
                <Text style={{styles.statValue}}>
                  On or before {{cohort?.closesAt ? new Date(cohort.closesAt).toLocaleDateString('en-GB', {{ day: 'numeric', month: 'short', year: 'numeric' }}) : 'Maturity'}}
                </Text>
              </View>
            </View>

            <Text style={{styles.disclaimer}}>
              This subscription is subject to the terms and conditions of the GETLANDS {{opportunity.category.replace('_', ' ')}} Subscription Agreement.
            </Text>

            {/* Signatures Row */}
            <View style={{styles.signaturesRow}}>
              <View style={{styles.signatureBox}}>
                <Image src={{"{sig_b64}"}} style={{styles.signatureImage}} />
                <View style={{styles.signatureLine}}>
                  <Text style={{styles.signatureTitle}}>PROGRAMME MANAGER</Text>
                  <Text style={{styles.signatureCompany}}>GETLANDS</Text>
                </View>
              </View>
              
              <View style={{styles.seal}}>
                <View style={{styles.sealInner}}>
                  <Text style={{fontSize: 8, color: '#d4af37', fontWeight: 'bold'}}>GETLANDS</Text>
                  <Text style={{fontSize: 6, color: '#d4af37'}}>SEAL</Text>
                </View>
              </View>

              <View style={{styles.signatureBox}}>
                <View style={{styles.signatureLine}}>
                  <Text style={{styles.signatureTitle}}>AUTHORIZED SIGNATORY</Text>
                  <Text style={{styles.signatureCompany}}>GETLANDS</Text>
                </View>
              </View>
            </View>
            
          </View>
        </View>
        <View style={{styles.bottomBar}}>
          <Text style={{styles.bottomBarText}}>STRATEGIC . TRANSPARENT . TRUSTED</Text>
        </View>
      </Page>
    </Document>
  );
}};
"""

with open('src/components/pdf/CertificateTemplate.tsx', 'w') as f:
    f.write(certificate_content)
