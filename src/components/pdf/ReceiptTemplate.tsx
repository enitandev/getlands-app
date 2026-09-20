import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed, else we use standard ones
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: 20,
  },
  logo: {
    width: 120,
  },
  headerRight: {
    textAlign: 'right',
  },
  title: {
    fontSize: 24,
    color: '#102218',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  receiptInfo: {
    fontSize: 10,
    color: '#68736d',
    marginBottom: 5,
  },
  receivedFrom: {
    fontSize: 12,
    color: '#d4af37', // A goldish color like the example
    fontStyle: 'italic',
    marginBottom: 5,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#102218',
    marginBottom: 5,
  },
  sumText: {
    fontSize: 10,
    color: '#68736d',
    marginBottom: 30,
  },
  amountBox: {
    border: '1px solid #e0e0e0',
    backgroundColor: '#fcf9f2',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  amountLabel: {
    fontSize: 10,
    color: '#d4af37',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 32,
    color: '#102218',
    fontWeight: 'bold',
  },
  detailsTable: {
    borderTop: '1px solid #e0e0e0',
    paddingTop: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottom: '1px dashed #e0e0e0',
    paddingBottom: 10,
  },
  detailLabel: {
    width: '30%',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#102218',
  },
  detailValue: {
    width: '70%',
    fontSize: 10,
    color: '#68736d',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1px solid #102218',
    paddingTop: 20,
  },
  signatureBox: {
    width: '40%',
  },
  signatureLine: {
    borderTop: '1px solid #102218',
    marginTop: 30,
    paddingTop: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
  contactBox: {
    width: '50%',
    fontSize: 9,
    color: '#68736d',
    textAlign: 'right',
  },
});

export const ReceiptTemplate = ({ holding, baseUrl }: { holding: any, baseUrl: string }) => {
  const { opportunity, user, cohort } = holding;
  
  // Fake receipt number based on ID for now
  const receiptNo = `GL-RCPT-${new Date(holding.createdAt).getFullYear()}-${holding.id.substring(0,6).toUpperCase()}`;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Image src={`${baseUrl}/assets/getlands-logo.png`} style={styles.logo} />
            <Text style={{ fontSize: 8, color: '#68736d', marginTop: 5 }}>BUILDING VALUE THROUGH</Text>
            <Text style={{ fontSize: 8, color: '#68736d' }}>STRATEGIC COMMODITY MANAGEMENT.</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.title}>OFFICIAL RECEIPT</Text>
            <Text style={styles.receiptInfo}>RECEIPT NO.: {receiptNo}</Text>
            <Text style={styles.receiptInfo}>DATE: {new Date(holding.createdAt).toLocaleDateString()}</Text>
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
          <View style={{ marginLeft: 20 }}>
            <Text style={styles.amountLabel}>AMOUNT RECEIVED</Text>
            <Text style={styles.amountValue}>N {holding.totalAmount.toLocaleString()}</Text>
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
            <Text style={styles.detailValue}>{new Date(holding.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>Programme Manager{'\n'}GETLANDS</Text>
          </View>
          <View style={styles.contactBox}>
            <Text style={{ marginBottom: 3 }}>1B Unity Road, Sango Ota, Ogun State</Text>
            <Text style={{ marginBottom: 3 }}>+234 913 348 5636</Text>
            <Text style={{ marginBottom: 3 }}>www.getlands.ng</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
