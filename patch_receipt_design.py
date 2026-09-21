import re

new_content = """import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, Svg, Path, Circle, Rect, G } from '@react-pdf/renderer';

// Register fonts for a more premium look
Font.register({
  family: 'Playfair',
  src: 'https://fonts.gstatic.com/s/playfairdisplay/v21/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.ttf'
});
Font.register({
  family: 'DancingScript',
  src: 'https://fonts.gstatic.com/s/dancingscript/v24/IfsqT0O56149Z0qI4pzINZkPqFw.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  watermark: {
    position: 'absolute',
    top: 300,
    left: 100,
    opacity: 0.03,
    width: 400,
    transform: 'rotate(-45deg)',
  },
  topBar: {
    height: 12,
    backgroundColor: '#008b45',
    width: '100%',
  },
  contentContainer: {
    padding: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottom: '2px solid #008b45',
    paddingBottom: 20,
  },
  logo: {
    width: 140,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 8,
    color: '#68736d',
    letterSpacing: 1,
  },
  headerRight: {
    textAlign: 'right',
  },
  title: {
    fontSize: 28,
    color: '#102218',
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 2,
  },
  receiptInfo: {
    fontSize: 10,
    color: '#68736d',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  highlightText: {
    color: '#008b45',
  },
  receivedFrom: {
    fontSize: 14,
    color: '#d4af37',
    fontFamily: 'Playfair',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 22,
    fontWeight: 'heavy',
    color: '#102218',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  sumText: {
    fontSize: 11,
    color: '#68736d',
    marginBottom: 35,
  },
  amountBox: {
    backgroundColor: '#f8fdfa',
    borderLeft: '4px solid #008b45',
    borderTop: '1px solid #eef3ef',
    borderRight: '1px solid #eef3ef',
    borderBottom: '1px solid #eef3ef',
    padding: 25,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 45,
    position: 'relative',
  },
  amountLabel: {
    fontSize: 11,
    color: '#d4af37',
    fontWeight: 'heavy',
    marginBottom: 8,
    letterSpacing: 1,
  },
  amountValue: {
    fontSize: 36,
    color: '#102218',
    fontWeight: 'heavy',
  },
  currencySymbol: {
    backgroundColor: '#008b45',
    color: '#ffffff',
    fontSize: 24,
    padding: '8 12',
    borderRadius: 50,
    marginRight: 15,
    fontWeight: 'bold',
  },
  detailsTable: {
    borderTop: '1px solid #eef3ef',
    paddingTop: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 18,
    borderBottom: '1px dashed #eef3ef',
    paddingBottom: 12,
  },
  detailLabel: {
    width: '35%',
    fontSize: 11,
    fontWeight: 'heavy',
    color: '#102218',
    letterSpacing: 1,
  },
  detailValue: {
    width: '65%',
    fontSize: 11,
    color: '#4a554f',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureBox: {
    width: '40%',
    position: 'relative',
  },
  signatureLine: {
    borderTop: '1px solid #102218',
    marginTop: 60,
    paddingTop: 8,
    fontSize: 10,
    fontWeight: 'heavy',
    color: '#102218',
  },
  signatureText: {
    position: 'absolute',
    top: 10,
    left: 20,
    fontFamily: 'DancingScript',
    fontSize: 36,
    color: '#003319',
    transform: 'rotate(-5deg)',
  },
  stamp: {
    position: 'absolute',
    top: -20,
    left: 140,
    width: 80,
    height: 80,
    opacity: 0.8,
  },
  contactBox: {
    width: '40%',
    fontSize: 10,
    color: '#68736d',
    textAlign: 'right',
  },
  contactItem: {
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    height: 25,
    backgroundColor: '#09160e',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarText: {
    color: '#d4af37',
    fontSize: 8,
    letterSpacing: 4,
  }
});

export const ReceiptTemplate = ({ holding, baseUrl }: { holding: any, baseUrl: string }) => {
  const { opportunity, user, cohort } = holding;
  
  // FIX: Use dateAcquired instead of createdAt
  const dateObj = new Date(holding.dateAcquired || holding.createdAt || Date.now());
  const receiptNo = `GL-RCPT-${dateObj.getFullYear()}-${holding.id.substring(0,6).toUpperCase()}`;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.topBar} />
        
        {/* Fake Watermark Logo */}
        <Image src={`${baseUrl}/assets/getlands-logo.png`} style={styles.watermark} />

        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Image src={`${baseUrl}/assets/getlands-logo.png`} style={styles.logo} />
              <Text style={styles.tagline}>BUILDING VALUE THROUGH</Text>
              <Text style={styles.tagline}>STRATEGIC COMMODITY MANAGEMENT.</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.title}>OFFICIAL RECEIPT</Text>
              <Text style={styles.receiptInfo}>RECEIPT NO.: <Text style={styles.highlightText}>{receiptNo}</Text></Text>
              <Text style={styles.receiptInfo}>DATE: <Text style={styles.highlightText}>{dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Text></Text>
            </View>
          </View>

          {/* Received From */}
          <View>
            <Text style={styles.receivedFrom}>Received From</Text>
            <Text style={styles.customerName}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.sumText}>the sum of {holding.totalAmount.toLocaleString()} Naira Only.</Text>
          </View>

          {/* Amount Box */}
          <View style={styles.amountBox}>
            <Text style={styles.currencySymbol}>₦</Text>
            <View>
              <Text style={styles.amountLabel}>AMOUNT RECEIVED</Text>
              <Text style={styles.amountValue}>{holding.totalAmount.toLocaleString()}</Text>
            </View>
          </View>

          {/* Details Table */}
          <View style={styles.detailsTable}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>PROGRAMME:</Text>
              <Text style={styles.detailValue}>{opportunity.title}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>BATCH:</Text>
              <Text style={styles.detailValue}>{cohort ? cohort.name : 'Standard'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>SUBSCRIPTION:</Text>
              <Text style={styles.detailValue}>{holding.units || 1} Slot(s)</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>PAYMENT DATE:</Text>
              <Text style={styles.detailValue}>{dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>PAYMENT METHOD:</Text>
              <Text style={styles.detailValue}>Platform Transfer</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureText}>E. Bello</Text>
              
              {/* SVG Stamp */}
              <Svg viewBox="0 0 100 100" style={styles.stamp}>
                <Circle cx="50" cy="50" r="45" stroke="#008b45" strokeWidth="2" fill="none" />
                <Circle cx="50" cy="50" r="40" stroke="#008b45" strokeWidth="1" fill="none" strokeDasharray="4,4" />
                <Text x="16" y="55" fill="#008b45" fontSize="14" style={{ fontWeight: 'bold' }}>APPROVED</Text>
                <Text x="32" y="32" fill="#008b45" fontSize="8">GETLANDS</Text>
                <Text x="32" y="75" fill="#008b45" fontSize="8">OFFICIAL</Text>
              </Svg>

              <Text style={styles.signatureLine}>Programme Manager{'\n'}GETLANDS</Text>
            </View>
            <View style={styles.contactBox}>
              <Text style={styles.contactItem}>+234 913 348 5636</Text>
              <Text style={styles.contactItem}>www.getlands.shop</Text>
              <Text style={styles.contactItem}>info@getlands.shop</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <Text style={styles.bottomBarText}>STRATEGIC . TRANSPARENT . TRUSTED</Text>
        </View>
      </Page>
    </Document>
  );
};
"""

with open('src/components/pdf/ReceiptTemplate.tsx', 'w') as f:
    f.write(new_content)
