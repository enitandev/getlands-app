import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { LEGAL_ASSETS } from './legalAssets';

export interface LandAllocationCertificateProps {
  customerName: string;
  estateName: string;
  location: string;
  plots: number | string;
  plotNumber?: string;
  totalValue: number;
  allocationDate?: Date | string;
  referenceCode?: string;
  paymentStatus?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  borderOuter: {
    borderWidth: 2,
    borderColor: '#008b45',
    height: '100%',
    padding: 4,
  },
  borderInner: {
    borderWidth: 1,
    borderColor: '#d4af37',
    height: '100%',
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    position: 'relative',
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  chambersLogo: {
    width: 44,
    height: 44,
    objectFit: 'contain',
  },
  getlandsBrandText: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#008b45',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  getlandsSubText: {
    fontSize: 7.5,
    fontFamily: 'Helvetica',
    color: '#64748b',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 2,
  },
  title: {
    fontSize: 24,
    color: '#003319',
    fontFamily: 'Times-Bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#d4af37',
    fontFamily: 'Times-Bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  certifyText: {
    fontSize: 10,
    color: '#475569',
    fontFamily: 'Times-Italic',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 22,
    fontFamily: 'Times-Bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    borderBottomWidth: 1.5,
    borderBottomColor: '#d4af37',
    paddingBottom: 4,
    width: '85%',
    textAlign: 'center',
    marginBottom: 14,
  },
  allocationDescText: {
    fontSize: 10,
    color: '#334155',
    fontFamily: 'Times-Roman',
    textAlign: 'center',
    lineHeight: 1.45,
    maxWidth: '90%',
    marginBottom: 14,
  },
  estateName: {
    fontFamily: 'Times-Bold',
    color: '#008b45',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusBadgePaid: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  statusBadgeInstallment: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  statusBadgeText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 10,
    marginBottom: 18,
    backgroundColor: '#f8fafc',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
    borderRightWidth: 0.5,
    borderRightColor: '#cbd5e1',
  },
  statLabel: {
    fontSize: 7,
    color: '#64748b',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 9,
    color: '#0f172a',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  signaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
    alignItems: 'flex-end',
  },
  signatureBox: {
    alignItems: 'center',
    width: 130,
  },
  sigImageMD: {
    width: 95,
    height: 32,
    objectFit: 'contain',
  },
  sigImageCounsel: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  },
  sigLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#64748b',
    marginTop: 4,
    marginBottom: 4,
  },
  sigName: {
    fontSize: 8.5,
    fontFamily: 'Times-Bold',
    color: '#0f172a',
  },
  sigTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica',
    color: '#64748b',
    textAlign: 'center',
  },
  certRefCode: {
    position: 'absolute',
    bottom: 8,
    fontSize: 7,
    fontFamily: 'Helvetica',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
});

export const LandAllocationCertificateTemplate: React.FC<LandAllocationCertificateProps> = ({
  customerName,
  estateName,
  location,
  plots,
  plotNumber = 'Allocated Plot',
  totalValue,
  allocationDate,
  referenceCode,
  paymentStatus = 'paid_in_full',
}) => {
  const isPaidInFull = paymentStatus === 'paid_in_full';
  const allocDate = allocationDate ? new Date(allocationDate) : new Date();

  return (
    <Document
      title={`Certificate of Allocation: ${customerName}`}
      author="Getlands Real-Asset Marketplace"
      subject={`Certificate of Land Allocation: ${plotNumber}`}
      creator="Getlands Legal Document System"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.borderOuter}>
          <View style={styles.borderInner}>
            {/* Top Brand Header */}
            <View style={styles.logoRow}>
              <View>
                <Text style={styles.getlandsBrandText}>GETLANDS</Text>
                <Text style={styles.getlandsSubText}>REAL-ASSET MARKETPLACE</Text>
              </View>
              <Image src={LEGAL_ASSETS.chambersLogoLarge} style={styles.chambersLogo} />
            </View>

            <Text style={styles.title}>CERTIFICATE OF ALLOCATION</Text>
            <Text style={styles.subtitle}>OFFICIAL LAND PLOT BENEFICIAL ALLOCATION</Text>

            <Text style={styles.certifyText}>This is to officially certify that</Text>
            <Text style={styles.customerName}>{customerName}</Text>

            <Text style={styles.allocationDescText}>
              Has been beneficially allocated all that real property designated as{' '}
              <Text style={{ fontFamily: 'Times-Bold' }}>{plotNumber}</Text> ({plots} {typeof plots === 'number' && plots > 1 ? 'Plots' : 'Plot'}) in{' '}
              <Text style={styles.estateName}>{estateName}</Text>, Situate, Lying and Being at {location}.
            </Text>

            {/* Status Badge */}
            <View style={{ ...styles.statusBadge, ...(isPaidInFull ? styles.statusBadgePaid : styles.statusBadgeInstallment) }}>
              <Text style={{ ...styles.statusBadgeText, color: isPaidInFull ? '#065f46' : '#92400e' }}>
                {isPaidInFull ? 'Fully Paid & Beneficial Title Conveyed' : 'Provisional Allocation : Installment Active'}
              </Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Allocated Plot(s)</Text>
                <Text style={styles.statValue}>{plotNumber}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Units/Plots</Text>
                <Text style={styles.statValue}>{plots} {typeof plots === 'number' && plots > 1 ? 'Plots' : 'Plot'}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Estate Location</Text>
                <Text style={styles.statValue}>{location.length > 30 ? location.substring(0, 30) + '...' : location}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Value</Text>
                <Text style={styles.statValue}>N{totalValue.toLocaleString('en-NG')}</Text>
              </View>
              <View style={{ ...styles.statBox, borderRightWidth: 0 }}>
                <Text style={styles.statLabel}>Allocation Date</Text>
                <Text style={styles.statValue}>{allocDate.toLocaleDateString('en-GB')}</Text>
              </View>
            </View>

            {/* Signatures */}
            <View style={styles.signaturesRow}>
              <View style={styles.signatureBox}>
                <Image src={LEGAL_ASSETS.assignorSignature} style={styles.sigImageMD} />
                <View style={styles.sigLine} />
                <Text style={styles.sigName}>Bello Enitan Samuel</Text>
                <Text style={styles.sigTitle}>Managing Director, Getlands</Text>
              </View>

              <View style={styles.signatureBox}>
                <Image src={LEGAL_ASSETS.nbaSeal} style={styles.sigImageCounsel} />
                <View style={styles.sigLine} />
                <Text style={styles.sigName}>Chief Wakeel O. Liady</Text>
                <Text style={styles.sigTitle}>Legal Counsel, The Bridge Chambers</Text>
              </View>
            </View>

            {referenceCode && (
              <Text style={styles.certRefCode}>
                ALLOCATION CERTIFICATE NO: {referenceCode} | ISSUED BY GETLANDS LEGAL REGISTER
              </Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default LandAllocationCertificateTemplate;
