import re

with open('src/components/pdf/CertificateTemplate.tsx', 'r') as f:
    cert = f.read()

logo_match = re.search(r'src=\{"(data:image/png;base64,[^"]+)"\} style=\{styles\.logo\}', cert)
if not logo_match:
    logo_match = re.search(r'src=\{`(data:image/png;base64,[^`]+)`\} style=\{styles\.logo\}', cert)
logo_b64 = logo_match.group(1) if logo_match else ''

sig_match = re.search(r'src=\{"(data:image/png;base64,[^"]+)"\} style=\{styles\.signatureImage\}', cert)
if not sig_match:
    sig_match = re.search(r'src=\{`(data:image/png;base64,[^`]+)`\} style=\{styles\.signatureImage\}', cert)
sig_b64 = sig_match.group(1) if sig_match else ''

agreement_content = f"""import React from 'react';
import {{ Document, Page, Text, View, StyleSheet, Image }} from '@react-pdf/renderer';

const styles = StyleSheet.create({{
  page: {{
    padding: 50,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    fontSize: 11,
    lineHeight: 1.6,
    color: '#333333',
  }},
  header: {{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #008b45',
    paddingBottom: 20,
    marginBottom: 30,
  }},
  logo: {{
    width: 140,
  }},
  headerText: {{
    fontSize: 9,
    color: '#68736d',
    textAlign: 'right',
  }},
  title: {{
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Times-Roman',
    textDecoration: 'underline',
  }},
  sectionTitle: {{
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#102218',
  }},
  paragraph: {{
    marginBottom: 10,
    textAlign: 'justify',
  }},
  bold: {{
    fontWeight: 'bold',
  }},
  signatureSection: {{
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }},
  signatureBox: {{
    width: '40%',
    position: 'relative',
  }},
  signatureImage: {{
    position: 'absolute',
    top: -40,
    left: 0,
    width: 100,
    height: 'auto',
  }},
  signatureLine: {{
    borderTop: '1px solid #333',
    paddingTop: 5,
    marginTop: 40,
  }},
  footer: {{
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 8,
    color: '#999999',
    borderTop: '1px solid #eeeeee',
    paddingTop: 10,
  }}
}});

export const AgreementTemplate = ({{ holding }}: {{ holding: any }}) => {{
  const {{ opportunity, user, cohort }} = holding;
  
  const dateObj = new Date(holding.dateAcquired || holding.createdAt || Date.now());
  
  let durationMonths = 0;
  if (opportunity.duration) {{
    const match = opportunity.duration.match(/(\\d+)\\s*(MONTH|YEAR)/i);
    if (match) {{
      durationMonths = parseInt(match[1]);
      if (match[2].toUpperCase().startsWith('YEAR')) durationMonths *= 12;
    }}
  }}
  durationMonths = durationMonths || 6;
  const maturityDate = new Date(dateObj);
  maturityDate.setMonth(maturityDate.getMonth() + durationMonths);

  const formattedDate = dateObj.toLocaleDateString('en-GB', {{ day: 'numeric', month: 'long', year: 'numeric' }});
  const formattedMaturity = maturityDate.toLocaleDateString('en-GB', {{ day: 'numeric', month: 'long', year: 'numeric' }});
  
  return (
    <Document>
      <Page size="A4" style={{styles.page}}>
        
        <View style={{styles.header}}>
          <Image src={{`{logo_b64}`}} style={{styles.logo}} />
          <View>
            <Text style={{styles.headerText}}>1B Unity Road, Sango Ota, Ogun State</Text>
            <Text style={{styles.headerText}}>+234 913 348 5636 | www.getlands.shop</Text>
          </View>
        </View>

        <Text style={{styles.title}}>SUBSCRIPTION AGREEMENT</Text>

        <Text style={{styles.paragraph}}>
          This Subscription Agreement (the "Agreement") is entered into as of <Text style={{styles.bold}}>{{formattedDate}}</Text> (the "Effective Date") by and between:
        </Text>

        <Text style={{styles.paragraph}}>
          <Text style={{styles.bold}}>GETLANDS</Text>, a commodity management and trading company having its principal place of business at 1B Unity Road, Sango Ota, Ogun State (hereinafter referred to as the "Company", which expression shall where the context so admits include its successors-in-title and assigns) of the FIRST PART;
        </Text>

        <Text style={{styles.paragraph}}>
          AND
        </Text>

        <Text style={{styles.paragraph}}>
          <Text style={{styles.bold}}>{{user.firstName}} {{user.lastName}}</Text>, residing at <Text style={{styles.bold}}>{{user.address || '___________________________'}}</Text> and reachable at <Text style={{styles.bold}}>{{user.phoneNumber || '___________________________'}}</Text> (hereinafter referred to as the "Subscriber", which expression shall where the context so admits include their legal representatives and assigns) of the SECOND PART.
        </Text>

        <Text style={{styles.sectionTitle}}>1. PURPOSE OF AGREEMENT</Text>
        <Text style={{styles.paragraph}}>
          The Subscriber hereby agrees to subscribe to the <Text style={{styles.bold}}>{{opportunity.title}}</Text> (Batch: {{cohort ? cohort.name : 'Standard'}}) programme offered by the Company. The Company agrees to manage the funds in accordance with the strategic objectives of the designated commodity programme.
        </Text>

        <Text style={{styles.sectionTitle}}>2. INVESTMENT DETAILS</Text>
        <Text style={{styles.paragraph}}>
          <Text style={{styles.bold}}>2.1 Subscription Units:</Text> The Subscriber has purchased {{holding.units || 1}} slot(s).{'\n'}
          <Text style={{styles.bold}}>2.2 Total Principal Amount:</Text> NGN {{holding.totalAmount.toLocaleString()}} (the "Principal").{'\n'}
          <Text style={{styles.bold}}>2.3 Projected Return:</Text> {{opportunity.projectedReturn || 'As stipulated in the programme details'}}{'\n'}
          <Text style={{styles.bold}}>2.4 Maturity Date:</Text> The investment lifecycle spans {{opportunity.duration || 'the designated period'}} and shall mature on or before <Text style={{styles.bold}}>{{formattedMaturity}}</Text>.
        </Text>

        <Text style={{styles.sectionTitle}}>3. TERMS AND CONDITIONS</Text>
        <Text style={{styles.paragraph}}>
          <Text style={{styles.bold}}>3.1 Lock-in Period:</Text> The Principal is subject to a strict lock-in period for the duration of the programme. Premature withdrawals are not permitted unless expressly authorized in writing by the Company, which may incur administrative penalties.
        </Text>
        <Text style={{styles.paragraph}}>
          <Text style={{styles.bold}}>3.2 Payouts & Rollovers:</Text> Upon the Maturity Date, the Subscriber reserves the right to request a full payout of the Principal alongside the accrued returns, or elect to roll over the Principal into a new available cohort.
        </Text>
        <Text style={{styles.paragraph}}>
          <Text style={{styles.bold}}>3.3 Risks & Disclosures:</Text> While the Company utilizes stringent risk management frameworks and insurance policies to protect the physical commodities, the Subscriber acknowledges that commodity trading carries inherent market risks.
        </Text>

        <Text style={{styles.sectionTitle}}>4. FORCE MAJEURE</Text>
        <Text style={{styles.paragraph}}>
          Neither party shall be held liable for any failure to perform their obligations under this Agreement where such failure results from events beyond their reasonable control, including but not limited to acts of God, governmental actions, natural disasters, or severe economic disruptions.
        </Text>

        <View style={{styles.signatureSection}}>
          <View style={{styles.signatureBox}}>
            <Image src={{`{sig_b64}`}} style={{styles.signatureImage}} />
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>For: GETLANDS</Text>
              <Text>Programme Manager</Text>
            </View>
          </View>
          
          <View style={{styles.signatureBox}}>
            <View style={{styles.signatureLine}}>
              <Text style={{styles.bold}}>For: THE SUBSCRIBER</Text>
              <Text>{{user.firstName}} {{user.lastName}}</Text>
            </View>
          </View>
        </View>

        <Text style={{styles.footer}}>
          Generated automatically by the Getlands Platform on {{new Date().toLocaleDateString()}}
        </Text>

      </Page>
    </Document>
  );
}};
"""

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(agreement_content)
