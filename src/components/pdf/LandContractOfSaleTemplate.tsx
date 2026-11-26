import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { LEGAL_ASSETS } from './legalAssets';
import { numberToNairaWords } from '../../lib/numberToWords';

export interface LandContractOfSaleProps {
  customerName: string;
  customerAddress?: string;
  vendorName?: string;
  vendorEntity?: string;
  vendorAddress?: string;
  dateOfAgreement?: Date | string;
  propertyDescription?: string;
  location?: string;
  totalContractPrice: number;
  amountPaid: number;
  plotNumber?: string;
  referenceCode?: string;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 44,
    paddingRight: 44,
    fontFamily: 'Times-Roman',
    backgroundColor: '#ffffff',
    fontSize: 9.5,
    lineHeight: 1.48,
    color: '#111827',
  },
  runningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 6,
    marginBottom: 16,
  },
  runningHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  runningHeaderLogo: {
    width: 24,
    height: 24,
    objectFit: 'contain',
  },
  runningHeaderText: {
    fontSize: 7.5,
    fontFamily: 'Times-Bold',
    color: '#374151',
    letterSpacing: 0.5,
  },
  badgeInstallment: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 12,
  },
  badgeInstallmentText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#b45309',
    textTransform: 'uppercase',
  },
  docTitle: {
    fontSize: 15,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    letterSpacing: 1,
    color: '#0f172a',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  docSubtitle: {
    fontSize: 9.5,
    fontFamily: 'Times-Italic',
    textAlign: 'center',
    color: '#475569',
    marginBottom: 14,
  },
  partiesBox: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#f8fafc',
    marginBottom: 12,
  },
  partyLine: {
    fontSize: 9,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
    lineHeight: 1.4,
    marginBottom: 4,
  },
  bold: {
    fontFamily: 'Times-Bold',
  },
  financialSummaryBox: {
    borderWidth: 1.5,
    borderColor: '#008b45',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#f0fdf4',
    marginVertical: 10,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#bbf7d0',
  },
  financialLabel: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
  },
  financialValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  conditionPrecedentCard: {
    borderWidth: 1.5,
    borderColor: '#dc2626',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fef2f2',
    marginVertical: 10,
  },
  conditionPrecedentTitle: {
    fontSize: 9.5,
    fontFamily: 'Times-Bold',
    color: '#991b1b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  conditionPrecedentText: {
    fontSize: 8.8,
    fontFamily: 'Times-Roman',
    color: '#7f1d1d',
    textAlign: 'justify',
    lineHeight: 1.45,
  },
  clauseSection: {
    marginTop: 8,
    marginBottom: 6,
  },
  clauseTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    textDecoration: 'underline',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  clauseItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  clauseNum: {
    width: 18,
    fontSize: 9,
    fontFamily: 'Times-Bold',
  },
  clauseText: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
    lineHeight: 1.42,
  },
  executionCard: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    padding: 8,
    marginVertical: 6,
    backgroundColor: '#fafbfc',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  assignorSigImage: {
    width: 110,
    height: 35,
    objectFit: 'contain',
  },
  witnessSigImage: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#64748b',
    borderBottomStyle: 'dotted',
    marginTop: 14,
    marginBottom: 2,
  },
  signatureCaption: {
    fontSize: 7.5,
    fontFamily: 'Times-Roman',
    color: '#64748b',
  },
});

export const LandContractOfSaleTemplate: React.FC<LandContractOfSaleProps> = ({
  customerName,
  customerAddress = 'Address On File, Nigeria',
  vendorName = 'BELLO ENITAN SAMUEL',
  vendorEntity = 'GETLANDS PROPERTIES CO.',
  vendorAddress = 'No. 3, Bello Close, Oke Ago-Owu, Abeokuta, Ogun State',
  dateOfAgreement,
  propertyDescription = 'all that one acre (6 plots) of Land',
  location = 'ERIKU VILLAGE, ILEWO ORILE, ABEOKUTA NORTH LOCAL GOVERNMENT, OGUN STATE',
  totalContractPrice = 2500000,
  amountPaid = 500000,
  plotNumber,
  referenceCode,
}) => {
  const agreementDate = dateOfAgreement ? new Date(dateOfAgreement) : new Date();
  const dayStr = agreementDate.getDate().toString();
  const monthStr = agreementDate.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const yearStr = agreementDate.getFullYear().toString();
  const fullDateFormatted = `${dayStr} DAY OF ${monthStr} ${yearStr}`;

  const balanceRemaining = Math.max(0, totalContractPrice - amountPaid);
  const percentCompleted = totalContractPrice > 0 
    ? Math.round((amountPaid / totalContractPrice) * 100) 
    : 0;

  const parcelWithPlot = plotNumber 
    ? `${propertyDescription} designated as ${plotNumber}`
    : propertyDescription;

  return (
    <Document
      title={`Contract of Sale: ${customerName}`}
      author="Chief Wakeel Olawale Liady, The Bridge Chambers"
      subject={`Installment Contract of Sale for ${parcelWithPlot}`}
      creator="Getlands Legal Document System"
    >
      {/* ================= PAGE 1 ================= */}
      <Page size="A4" style={styles.page}>
        <View style={styles.runningHeader}>
          <View style={styles.runningHeaderLeft}>
            <Image src={LEGAL_ASSETS.chambersLogoSmall} style={styles.runningHeaderLogo} />
            <Text style={styles.runningHeaderText}>THE BRIDGE CHAMBERS : CONTRACT OF SALE</Text>
          </View>
          <View style={styles.badgeInstallment}>
            <Text style={styles.badgeInstallmentText}>Installment Agreement ({percentCompleted}% Paid)</Text>
          </View>
        </View>

        <Text style={styles.docTitle}>CONTRACT OF SALE OF REAL PROPERTY & ALLOCATION AGREEMENT</Text>
        <Text style={styles.docSubtitle}>
          Governing Installment Land Acquisition, Reservation and Conditions Precedent to Beneficial Conveyance
        </Text>

        <View style={styles.partiesBox}>
          <Text style={styles.partyLine}>
            <Text style={styles.bold}>THIS CONTRACT OF SALE</Text> is made this <Text style={styles.bold}>{fullDateFormatted}</Text>
          </Text>
          <Text style={styles.partyLine}>
            <Text style={styles.bold}>BETWEEN: {vendorName} [{vendorEntity}]</Text> of {vendorAddress} (hereinafter called the <Text style={styles.bold}>"VENDOR"</Text>, which expression shall include his personal representatives, successors and assigns) of the <Text style={styles.bold}>FIRST PART</Text>.
          </Text>
          <Text style={styles.partyLine}>
            <Text style={styles.bold}>AND: {customerName.toUpperCase()}</Text> of {customerAddress} (hereinafter called the <Text style={styles.bold}>"PURCHASER"</Text>, which expression shall include heirs, executors and assigns) of the <Text style={styles.bold}>SECOND PART</Text>.
          </Text>
        </View>

        {/* Financial Consideration & Ledger Snapshot */}
        <View style={styles.financialSummaryBox}>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Agreed Total Contract Price:</Text>
            <Text style={styles.financialValue}>N{totalContractPrice.toLocaleString('en-NG')} ({numberToNairaWords(totalContractPrice)})</Text>
          </View>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Total Consideration Paid to Date:</Text>
            <Text style={styles.financialValue}>N{amountPaid.toLocaleString('en-NG')} ({numberToNairaWords(amountPaid)})</Text>
          </View>
          <View style={{ ...styles.financialRow, borderBottomWidth: 0 }}>
            <Text style={{ ...styles.financialLabel, color: '#dc2626' }}>Outstanding Balance Due:</Text>
            <Text style={{ ...styles.financialValue, color: '#dc2626' }}>N{balanceRemaining.toLocaleString('en-NG')}</Text>
          </View>
        </View>

        {/* Strict Condition Precedent Box */}
        <View style={styles.conditionPrecedentCard}>
          <Text style={styles.conditionPrecedentTitle}>
            CRITICAL CONDITION PRECEDENT : BENEFICIAL TITLE & DEED OF ASSIGNMENT
          </Text>
          <Text style={styles.conditionPrecedentText}>
            The Vendor and the Purchaser hereby mutually covenant that beneficial title and the formal 6-Page Deed of Assignment shall be prepared, executed, sealed, and released to the Purchaser ONLY upon 100% full liquidation of the total agreed contract price. Prior to complete financial settlement, this Contract of Sale, alongside official Getlands Payment Receipts, serves as the exclusive and binding legal instrument evidencing land reservation, provisional allocation, and financial consideration paid.
          </Text>
        </View>

        <View style={styles.clauseSection}>
          <Text style={styles.clauseTitle}>OPERATIVE TERMS & COVENANTS:</Text>

          <View style={styles.clauseItem}>
            <Text style={styles.clauseNum}>1.</Text>
            <Text style={styles.clauseText}>
              <Text style={styles.bold}>Allocation & Reservation:</Text> In consideration of the deposit paid by the Purchaser, the Vendor hereby reserves and allocates UNTO the Purchaser {parcelWithPlot} Situate, Lying and Being at {location}.
            </Text>
          </View>

          <View style={styles.clauseItem}>
            <Text style={styles.clauseNum}>2.</Text>
            <Text style={styles.clauseText}>
              <Text style={styles.bold}>Installment Settlement:</Text> The Purchaser undertakes to liquidate the outstanding balance of N{balanceRemaining.toLocaleString('en-NG')} in accordance with the agreed installment terms.
            </Text>
          </View>

          <View style={styles.clauseItem}>
            <Text style={styles.clauseNum}>3.</Text>
            <Text style={styles.clauseText}>
              <Text style={styles.bold}>Non-Encumbrance Guarantee:</Text> The Vendor warrants that during the tenure of this installment agreement, the allocated parcel shall not be sold, mortgaged, assigned, or encumbered to any third party.
            </Text>
          </View>
        </View>
      </Page>

      {/* ================= PAGE 2 ================= */}
      <Page size="A4" style={styles.page}>
        <View style={styles.runningHeader}>
          <View style={styles.runningHeaderLeft}>
            <Image src={LEGAL_ASSETS.chambersLogoSmall} style={styles.runningHeaderLogo} />
            <Text style={styles.runningHeaderText}>THE BRIDGE CHAMBERS : CONTRACT OF SALE</Text>
          </View>
          <Text style={{ fontSize: 7.5, fontFamily: 'Times-Roman', color: '#6b7280' }}>PAGE 2 OF 2</Text>
        </View>

        <View style={styles.clauseSection}>
          <View style={styles.clauseItem}>
            <Text style={styles.clauseNum}>4.</Text>
            <Text style={styles.clauseText}>
              <Text style={styles.bold}>Defect in Title Indemnity:</Text> If at any point prior to or after full settlement, a defect is established in the Vendor's title, the Purchaser shall be entitled to an immediate refund of all monies paid alongside reasonable damages incurred.
            </Text>
          </View>

          <View style={styles.clauseItem}>
            <Text style={styles.clauseNum}>5.</Text>
            <Text style={styles.clauseText}>
              <Text style={styles.bold}>Automatic Deed Delivery upon Full Payment:</Text> Immediately upon the final payment confirming 100% full liquidation, the Getlands automated conveyancing engine and The Bridge Chambers shall issue the official 6-Page Deed of Assignment, NBA Practicing Seal, and Land Allocation Certificate.
            </Text>
          </View>
        </View>

        {/* Execution Schedules */}
        <Text style={{ ...styles.clauseTitle, marginTop: 14, textAlign: 'center' }}>
          SCHEDULES & EXECUTION
        </Text>
        <Text style={{ fontSize: 8.5, fontFamily: 'Times-Italic', textAlign: 'center', marginBottom: 10 }}>
          IN WITNESS WHEREOF the parties have hereunder set their hands the day and year first above written.
        </Text>

        {/* Vendor Block */}
        <View style={styles.executionCard}>
          <Text style={{ fontSize: 8.5, fontFamily: 'Times-Bold', textTransform: 'uppercase' }}>
            SIGNED, SEALED AND DELIVERED By the within named Vendor:
          </Text>
          <Text style={{ fontSize: 8.2, fontFamily: 'Times-Bold', color: '#1e293b' }}>
            Mr. {vendorName} ({vendorEntity})
          </Text>
          <View style={styles.signatureRow}>
            <View style={{ flex: 1 }}>
              <Image src={LEGAL_ASSETS.assignorSignature} style={styles.assignorSigImage} />
              <Text style={styles.signatureCaption}>Vendor Signature</Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 12 }}>
              <Text style={{ fontSize: 7.8, fontFamily: 'Times-Bold', color: '#1e293b' }}>
                Witnessed by: BELLO ABIODUN
              </Text>
              <Text style={{ fontSize: 7.5, fontFamily: 'Times-Roman', color: '#475569' }}>
                3, Bello Close, Oke Ago-Owu, Abeokuta.
              </Text>
              <Image src={LEGAL_ASSETS.witnessSignature} style={styles.witnessSigImage} />
            </View>
          </View>
        </View>

        {/* Purchaser Block */}
        <View style={styles.executionCard}>
          <Text style={{ fontSize: 8.5, fontFamily: 'Times-Bold', textTransform: 'uppercase' }}>
            SIGNED, SEALED AND DELIVERED By the within named Purchaser:
          </Text>
          <Text style={{ fontSize: 8.2, fontFamily: 'Times-Bold', color: '#1e293b' }}>
            {customerName.toUpperCase()}
          </Text>
          <View style={styles.signatureRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureCaption}>Purchaser Signature</Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 12 }}>
              <Text style={{ fontSize: 7.8, fontFamily: 'Times-Bold', color: '#1e293b' }}>
                Witness Signature: .......................................
              </Text>
              <Text style={{ fontSize: 7.5, fontFamily: 'Times-Roman', color: '#475569', marginTop: 2 }}>
                Date: {agreementDate.toLocaleDateString('en-GB')}
              </Text>
            </View>
          </View>
        </View>

        {/* Chambers Seal */}
        <View style={{ marginTop: 8, alignItems: 'center' }}>
          <Image src={LEGAL_ASSETS.nbaSeal} style={{ width: 55, height: 55, objectFit: 'contain' }} />
          <Text style={{ fontSize: 7, fontFamily: 'Times-Bold', color: '#334155', marginTop: 2 }}>
            CHIEF WAKEEL OLAWALE LIADY : THE BRIDGE CHAMBERS
          </Text>
          {referenceCode && (
            <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica', color: '#94a3b8' }}>
              AGREEMENT REF: {referenceCode}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default LandContractOfSaleTemplate;
