import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { LEGAL_ASSETS } from './legalAssets';
import { numberToNairaWords } from '../../lib/numberToWords';

export interface DeedOfAssignmentProps {
  customerName: string;
  customerAddress?: string;
  assignorName?: string;
  assignorAddress?: string;
  assignorEntity?: string;
  dateOfExecution?: Date | string;
  propertyDescription?: string;
  location?: string;
  totalPrice: number;
  plotNumber?: string;
  referenceCode?: string;
}

const styles = StyleSheet.create({
  // Page Styles
  coverPage: {
    paddingTop: 36,
    paddingBottom: 28,
    paddingLeft: 46,
    paddingRight: 46,
    fontFamily: 'Times-Roman',
    backgroundColor: '#ffffff',
    fontSize: 10.5,
    lineHeight: 1.4,
    color: '#0f172a',
  },
  bodyPage: {
    paddingTop: 42,
    paddingBottom: 42,
    paddingLeft: 48,
    paddingRight: 48,
    fontFamily: 'Times-Roman',
    backgroundColor: '#ffffff',
    fontSize: 11.6,
    lineHeight: 1.7,
    color: '#0f172a',
  },
  // Running Header
  runningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 8,
    marginBottom: 22,
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
    fontSize: 8.5,
    fontFamily: 'Times-Bold',
    color: '#1e293b',
    letterSpacing: 0.5,
  },
  runningHeaderPage: {
    fontSize: 8.5,
    fontFamily: 'Times-Roman',
    color: '#64748b',
  },
  // Cover Elements
  coverLogoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  coverLogo: {
    width: 90,
    height: 90,
    objectFit: 'contain',
  },
  coverTitle: {
    fontSize: 24,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    letterSpacing: 2,
    color: '#0f172a',
    marginBottom: 16,
  },
  coverSubhead: {
    fontSize: 13.5,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    letterSpacing: 1.5,
    color: '#1e293b',
    marginBottom: 6,
  },
  coverPartyName: {
    fontSize: 17,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  coverPartyDetail: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    color: '#334155',
    marginTop: 2,
  },
  coverPartyRole: {
    fontSize: 12.5,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    color: '#1e293b',
    marginTop: 2,
    marginBottom: 14,
  },
  coverPropertyBox: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#cbd5e1',
    borderBottomColor: '#cbd5e1',
    paddingVertical: 12,
    marginVertical: 14,
  },
  coverPropertyText: {
    fontSize: 11,
    fontFamily: 'Times-Italic',
    textAlign: 'center',
    lineHeight: 1.5,
    color: '#1e293b',
  },
  coverPreparedSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  coverPreparedByBox: {
    flex: 1,
    paddingRight: 16,
  },
  preparedByTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    textDecoration: 'underline',
    marginBottom: 4,
    color: '#0f172a',
  },
  preparedByName: {
    fontSize: 11.5,
    fontFamily: 'Times-Bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  preparedByFirm: {
    fontSize: 10.5,
    fontFamily: 'Times-Bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  preparedByAddress: {
    fontSize: 8.5,
    fontFamily: 'Times-Roman',
    color: '#475569',
    lineHeight: 1.35,
  },
  coverSealContainer: {
    width: 95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverSeal: {
    width: 90,
    height: 90,
    objectFit: 'contain',
  },
  coverFooterGrid: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  footerCol: {
    flex: 1,
  },
  footerColTitle: {
    fontSize: 8.2,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    color: '#0f172a',
    marginBottom: 2,
  },
  footerColText: {
    fontSize: 7,
    fontFamily: 'Times-Roman',
    color: '#64748b',
    lineHeight: 1.25,
  },
  inChambersBar: {
    borderTopWidth: 0.5,
    borderTopColor: '#cbd5e1',
    marginTop: 6,
    paddingTop: 4,
  },
  inChambersText: {
    fontSize: 6.6,
    fontFamily: 'Times-Roman',
    color: '#64748b',
    lineHeight: 1.25,
    textAlign: 'center',
  },
  // Body Typography
  mainHeading: {
    fontSize: 12.5,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginBottom: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  betweenHeading: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  partyBlock: {
    fontSize: 11.6,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
    lineHeight: 1.65,
    marginBottom: 14,
  },
  bold: {
    fontFamily: 'Times-Bold',
  },
  whereasHeading: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textDecoration: 'underline',
    marginTop: 12,
    marginBottom: 14,
  },
  recitalItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  recitalNum: {
    width: 24,
    fontSize: 11.6,
    fontFamily: 'Times-Bold',
  },
  recitalText: {
    flex: 1,
    fontSize: 11.6,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
    lineHeight: 1.65,
  },
  witnessethHeading: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textDecoration: 'underline',
    marginTop: 16,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  covenantItem: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  covenantNum: {
    width: 24,
    fontSize: 11.2,
    fontFamily: 'Times-Bold',
  },
  covenantText: {
    flex: 1,
    fontSize: 11.2,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
    lineHeight: 1.6,
  },
  defectBox: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: '#cbd5e1',
  },
  defectTitle: {
    fontSize: 13,
    fontFamily: 'Times-Bold',
    letterSpacing: 0.5,
    marginBottom: 14,
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  defectParagraph: {
    fontSize: 11.6,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
    lineHeight: 1.7,
    marginBottom: 16,
    color: '#1e293b',
  },
  covenantAffirmationBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  covenantAffirmationTitle: {
    fontSize: 10.5,
    fontFamily: 'Times-Bold',
    letterSpacing: 0.5,
    color: '#0f172a',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  covenantAffirmationText: {
    fontSize: 10.2,
    fontFamily: 'Times-Roman',
    lineHeight: 1.6,
    textAlign: 'justify',
    color: '#334155',
  },
  // Execution Schedule Styles
  schedulesTitle: {
    fontSize: 14.5,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    color: '#0f172a',
  },
  witnessWhereof: {
    fontSize: 11.5,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
    lineHeight: 1.55,
    marginBottom: 20,
    color: '#1e293b',
  },
  executionCard: {
    marginBottom: 22,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
  },
  executionPartyTitle: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  assignorSigImage: {
    width: 140,
    height: 46,
    objectFit: 'contain',
    marginBottom: 2,
  },
  witnessSigImage: {
    width: 80,
    height: 40,
    objectFit: 'contain',
  },
  signatureLine: {
    width: 150,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    height: 44,
    marginBottom: 4,
  },
  signatureCaption: {
    fontSize: 9,
    fontFamily: 'Times-Italic',
    color: '#64748b',
    marginTop: 2,
  },
  consentBox: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
  },
  consentTitle: {
    fontSize: 11,
    fontFamily: 'Times-Italic',
    textAlign: 'center',
    marginBottom: 14,
    color: '#1e293b',
  },
  consentLine: {
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
    borderBottomStyle: 'dotted',
    marginBottom: 6,
  },
});

export const DeedOfAssignmentTemplate: React.FC<DeedOfAssignmentProps> = ({
  customerName,
  customerAddress = 'the within named address, Federal Republic of Nigeria',
  assignorName = 'BELLO ENITAN SAMUEL',
  assignorAddress = 'No. 3, Bello Close, Oke Ago-Owu, Abeokuta, Ogun State',
  assignorEntity = 'GETLANDS PROPERTIES CO.',
  dateOfExecution,
  propertyDescription = 'all that one acre (6 plots) of Land',
  location = 'ERIKU VILLAGE, ILEWO ORILE, ABEOKUTA NORTH LOCAL GOVERNMENT, OGUN STATE',
  totalPrice = 2500000,
  plotNumber,
  referenceCode,
}) => {
  const executionDate = dateOfExecution ? new Date(dateOfExecution) : new Date();
  const dayStr = executionDate.getDate().toString();
  const monthStr = executionDate.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const yearStr = executionDate.getFullYear().toString();
  const fullDateFormatted = `${dayStr} DAY OF ${monthStr} ${yearStr}`;

  const priceInFigures = `N${totalPrice.toLocaleString('en-NG')}`;
  const priceInWords = numberToNairaWords(totalPrice);

  const parcelWithPlot = plotNumber 
    ? `${propertyDescription} designated as ${plotNumber}`
    : propertyDescription;

  return (
    <Document
      title={`Deed of Assignment: ${customerName}`}
      author="Chief Wakeel Olawale Liady, The Bridge Chambers"
      subject={`Deed of Assignment for ${parcelWithPlot}`}
      creator="Getlands Legal Document System"
    >
      {/* ================= PAGE 1: COVER PAGE ================= */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverLogoContainer}>
          <Image src={LEGAL_ASSETS.chambersLogoLarge} style={styles.coverLogo} />
        </View>

        <Text style={styles.coverTitle}>DEED OF ASSIGNMENT</Text>

        <Text style={styles.coverSubhead}>BETWEEN</Text>
        <Text style={styles.coverPartyName}>{assignorName}</Text>
        <Text style={styles.coverPartyDetail}>[{assignorEntity}]</Text>
        <Text style={styles.coverPartyRole}>[ASSIGNOR]</Text>

        <Text style={styles.coverSubhead}>AND</Text>
        <Text style={styles.coverPartyName}>{customerName}</Text>
        <Text style={styles.coverPartyRole}>[ASSIGNEE]</Text>

        <View style={styles.coverPropertyBox}>
          <Text style={styles.coverPropertyText}>
            In Respect of {parcelWithPlot} Situate, Lying and Being at {location}
          </Text>
        </View>

        <View style={styles.coverPreparedSection}>
          <View style={styles.coverPreparedByBox}>
            <Text style={styles.preparedByTitle}>Prepared by:</Text>
            <Text style={styles.preparedByName}>Chief Wakeel Olawale LIADY</Text>
            <Text style={styles.preparedByFirm}>THE BRIDGE CHAMBERS</Text>
            <Text style={styles.preparedByAddress}>
              Okedara House, Plot 776, 3rd Floor,{'\n'}
              Lagos-Abeokuta Express Way,{'\n'}
              Near Total Filling Station by Alakuko Bus Stop, Lagos State.{'\n'}
              Email: waleliady@gmail.com | Tel: 08075773333, 07038223787
            </Text>
          </View>
          <View style={styles.coverSealContainer}>
            <Image src={LEGAL_ASSETS.nbaSeal} style={styles.coverSeal} />
          </View>
        </View>

        <View style={styles.coverFooterGrid}>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>Lagos Office</Text>
            <Text style={styles.footerColText}>
              3rd Floor, Okedara House{'\n'}
              776, Lagos-Abk Express Way{'\n'}
              Alakuko Bus Stop, Lagos State
            </Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>Abuja Office</Text>
            <Text style={styles.footerColText}>
              Suite 222, Anbeez Plaza{'\n'}
              Ndola Square, Opp. CAC{'\n'}
              Zone 5, Abuja, FCT
            </Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>Ibadan Office</Text>
            <Text style={styles.footerColText}>
              Adekola Kareem & Co{'\n'}
              3rd Floor, Ance Building{'\n'}
              Jericho, Ibadan, Oyo State
            </Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>Telephone</Text>
            <Text style={styles.footerColText}>
              +(234) 01-2916414{'\n'}
              +(234) 803 4064 506{'\n'}
              Hotline: 070 3822 3787
            </Text>
          </View>
        </View>

        <View style={styles.inChambersBar}>
          <Text style={styles.inChambersText}>
            IN CHAMBERS: Surajudeen YAYA (Head, Abuja Law Office), Hamdalat O. AZEEZ (Head, Ibadan Chambers), Remi AKINTUNDE (Head, Lagos Chambers), Rotimi KOMOLAFE (Admin Partner), Partners: Wasiu Oluseyi RAHEEM, Ojo AJIBUWA, Lukman MUSTAPHA | Principal Partner: Wakeel Olawale LIADY
          </Text>
        </View>
      </Page>

      {/* ================= PAGE 2: PARTIES & RECITALS 1 TO 3 ================= */}
      <Page size="A4" style={styles.bodyPage}>
        <View style={styles.runningHeader}>
          <View style={styles.runningHeaderLeft}>
            <Image src={LEGAL_ASSETS.chambersLogoSmall} style={styles.runningHeaderLogo} />
            <Text style={styles.runningHeaderText}>THE BRIDGE CHAMBERS : DEED OF ASSIGNMENT</Text>
          </View>
          <Text style={styles.runningHeaderPage}>PAGE 2 OF 6</Text>
        </View>

        <Text style={styles.mainHeading}>
          THIS DEED OF ASSIGNMENT IS MADE THIS {fullDateFormatted}
        </Text>

        <Text style={styles.betweenHeading}>BETWEEN</Text>
        <Text style={styles.partyBlock}>
          <Text style={styles.bold}>{assignorName} [{assignorEntity}]</Text> of {assignorAddress} (hereinafter called the <Text style={styles.bold}>"ASSIGNOR"</Text>) [which expression shall where the context so admits include his personal legal representatives, executors, administrators and assigns of the <Text style={styles.bold}>FIRST PART</Text>].
        </Text>

        <Text style={styles.betweenHeading}>AND</Text>
        <Text style={styles.partyBlock}>
          <Text style={styles.bold}>{customerName.toUpperCase()}</Text> of {customerAddress} (hereinafter called the <Text style={styles.bold}>"ASSIGNEE"</Text>) [which expression shall where the context so admits include heirs, personal legal representatives, executors, administrators and assigns of the <Text style={styles.bold}>SECOND PART</Text>].
        </Text>

        <Text style={styles.whereasHeading}>WHEREAS:</Text>

        <View style={styles.recitalItem}>
          <Text style={styles.recitalNum}>1.</Text>
          <Text style={styles.recitalText}>
            This {parcelWithPlot} now the subject of this Agreement (hereinafter referred to as the "Hereditament") is part of a total land measuring approximately 40,468.564 SQUARE METRES, which has been under the dominion and use of the "ASSIGNOR" under Yoruba Native Laws and Customs of inheritance.
          </Text>
        </View>

        <View style={styles.recitalItem}>
          <Text style={styles.recitalNum}>2.</Text>
          <Text style={styles.recitalText}>
            The Assignor has continued to exercise open acts of ownership over the said property herein which was purchased from the Omiremi family represented by Chief Aremu Olatoye Omiremi, Chief Samson Ayinde Omiremi, Mr. Mumuni Adebayo Omiremi, Mr. Wasiu Abiodun Omiremi, Mr. Bashiru Omiremi and Mr. Rotimi Omiremi.
          </Text>
        </View>

        <View style={styles.recitalItem}>
          <Text style={styles.recitalNum}>3.</Text>
          <Text style={styles.recitalText}>
            OMIREMI AKINYEMI, the great grand-father of the family in ERIKU VILLAGE, ILEWO ORILE, ABEOKUTA NORTH LOCAL GOVERNMENT, OGUN STATE, was the owner by first settlement from time immemorial of the large tract/expanse of land.
          </Text>
        </View>
      </Page>

      {/* ================= PAGE 3: RECITALS 4 TO 6 & OPERATIVE TESTATUM ================= */}
      <Page size="A4" style={styles.bodyPage}>
        <View style={styles.runningHeader}>
          <View style={styles.runningHeaderLeft}>
            <Image src={LEGAL_ASSETS.chambersLogoSmall} style={styles.runningHeaderLogo} />
            <Text style={styles.runningHeaderText}>THE BRIDGE CHAMBERS : DEED OF ASSIGNMENT</Text>
          </View>
          <Text style={styles.runningHeaderPage}>PAGE 3 OF 6</Text>
        </View>

        <View style={styles.recitalItem}>
          <Text style={styles.recitalNum}>4.</Text>
          <Text style={styles.recitalText}>
            At the death of Omiremi Akinyemi and the operation of the applicable customary law of succession and inheritance, hereditament hereinafter described including the portion now assigned from part of the tract of the land containing an approximate Area of 400,468.564 Square Metres, vested in his children as absolute owners.
          </Text>
        </View>

        <View style={styles.recitalItem}>
          <Text style={styles.recitalNum}>5.</Text>
          <Text style={styles.recitalText}>
            The children, [listed in paragraph 2 above] jointly agreed with the ASSIGNOR to assign their entire interest, legal and equitable in that 400,468.564 Square Metres of Land (100 acres) in the aforesaid hereditament measuring approximately 400,468.564 Square Metres, LYING, BEING AND SITUATE AT ERIKU VILLAGE, ILEWO ORILE, ABEOKUTA NORTH LOCAL GOVERNMENT, OGUN STATE.
          </Text>
        </View>

        <View style={styles.recitalItem}>
          <Text style={styles.recitalNum}>6.</Text>
          <Text style={styles.recitalText}>
            The ASSIGNOR has long been in exclusive and undisturbed possession of the whole area of land part of which is now intended for Assignment cultivating and exercising full acts of ownership thereon and all that the said land yields.
          </Text>
        </View>

        <Text style={styles.witnessethHeading}>
          NOW THEREFORE THIS PURCHASE AGREEMENT WITNESSETH AS FOLLOWS:
        </Text>

        <View style={styles.covenantItem}>
          <Text style={styles.covenantNum}>1.</Text>
          <Text style={styles.covenantText}>
            IN FURTHERANCE of the foregoing recitals and in consideration of the sum of <Text style={styles.bold}>{priceInFigures} ({priceInWords})</Text> paid to the Assignor by the Assignee (the receipt whereof the Assignor hereby acknowledges) the Assignor as the BENEFICIAL OWNER hereby assigns, transfers, sells and vests UNTO the Assignee ALL THAT piece and parcel of land MEASURING APPROXIMATELY {parcelWithPlot}.
          </Text>
        </View>

        <View style={styles.covenantItem}>
          <Text style={styles.covenantNum}>2.</Text>
          <Text style={styles.covenantText}>
            The ASSIGNOR covenants with the ASSIGNEE to immediately upon the execution of this agreement put the ASSIGNEE in possession of the property in which beneficial title has been transferred to the ASSIGNEE and also assure the ASSIGNEE of quiet enjoyment of the said property without interruption and/or disturbance from the ASSIGNORS, their agent(s), executors, assigns, privy or any person whatsoever.
          </Text>
        </View>
      </Page>

      {/* ================= PAGE 4: COVENANTS 3 TO 9 ================= */}
      <Page size="A4" style={styles.bodyPage}>
        <View style={styles.runningHeader}>
          <View style={styles.runningHeaderLeft}>
            <Image src={LEGAL_ASSETS.chambersLogoSmall} style={styles.runningHeaderLogo} />
            <Text style={styles.runningHeaderText}>THE BRIDGE CHAMBERS : DEED OF ASSIGNMENT</Text>
          </View>
          <Text style={styles.runningHeaderPage}>PAGE 4 OF 6</Text>
        </View>

        <View style={styles.covenantItem}>
          <Text style={styles.covenantNum}>3.</Text>
          <Text style={styles.covenantText}>
            That the ASSIGNOR has the full right to assign the Demised Land to the ASSIGNEE, and that the ASSIGNEE shall peaceably hold and enjoy the Demised Land without any interruption or disturbance by the ASSIGNOR, or any other person claiming through, from, for, against, under or in trust for the ASSIGNOR.
          </Text>
        </View>

        <View style={styles.covenantItem}>
          <Text style={styles.covenantNum}>4.</Text>
          <Text style={styles.covenantText}>
            THE ASSIGNOR HEREBY WARRANTS THAT THE INTEGRITY OF THE TITLE TO THE PROPERTY IS GOOD, CLEAN AND SHALL BE WITHOUT ANY THIRD PARTY CLAIM WHATSOEVER AND THAT THEY HAVE THE FULL AUTHORITY, POWER AND NECESSARY CONSENTS TO PERFORM THIS AGREEMENT, THE DEED OF ASSIGNMENT AND TO SELL THE PROPERTY TO THE ASSIGNEE.
          </Text>
        </View>

        <View style={styles.covenantItem}>
          <Text style={styles.covenantNum}>5.</Text>
          <Text style={styles.covenantText}>
            The ASSIGNOR further covenants with the ASSIGNEE to assist in further acts of documentation as may be necessary to further confirm the transfer of title to the Property which transfer is already made by the ASSIGNORS to the ASSIGNEE in this agreement.
          </Text>
        </View>

        <View style={styles.covenantItem}>
          <Text style={styles.covenantNum}>6.</Text>
          <Text style={styles.covenantText}>
            The ASSIGNOR shall execute or provide relevant documents, and assist the ASSIGNEE to effect the perfection of the Deed and ensure the assignment of the Demised land to the ASSIGNEE.
          </Text>
        </View>

        <View style={styles.covenantItem}>
          <Text style={styles.covenantNum}>7.</Text>
          <Text style={styles.covenantText}>
            The ASSIGNOR hereby acknowledges receipt of the said sum of the purchase price of <Text style={styles.bold}>{priceInFigures} ({priceInWords})</Text> paid at the point of executing this contract.
          </Text>
        </View>

        <View style={styles.covenantItem}>
          <Text style={styles.covenantNum}>8.</Text>
          <Text style={styles.covenantText}>
            The ASSIGNOR further covenants that at the point of executing this contract, they shall deliver to the ASSIGNEE a copy of their Title documents.
          </Text>
        </View>

        <View style={styles.covenantItem}>
          <Text style={styles.covenantNum}>9.</Text>
          <Text style={styles.covenantText}>
            The ASSIGNOR hereby warrants that this Agreement is a legal, valid and binding obligation upon the ASSIGNORS and is enforceable against the ASSIGNORS in accordance with the terms of this agreement and all relevant and applicable laws.
          </Text>
        </View>
      </Page>

      {/* ================= PAGE 5: COVENANT 10 & DEFECT IN TITLE ================= */}
      <Page size="A4" style={styles.bodyPage}>
        <View style={styles.runningHeader}>
          <View style={styles.runningHeaderLeft}>
            <Image src={LEGAL_ASSETS.chambersLogoSmall} style={styles.runningHeaderLogo} />
            <Text style={styles.runningHeaderText}>THE BRIDGE CHAMBERS : DEED OF ASSIGNMENT</Text>
          </View>
          <Text style={styles.runningHeaderPage}>PAGE 5 OF 6</Text>
        </View>

        <View style={styles.covenantItem}>
          <Text style={styles.covenantNum}>10.</Text>
          <Text style={styles.covenantText}>
            The ASSIGNOR hereby undertakes that they shall not SELL, TRANSFER, ASSIGN or howsoever deal with the property or any part thereof in a manner that is inconsistent with the ASSIGNEE'S rights and interests under this Deed of Assignment.
          </Text>
        </View>

        <View style={styles.defectBox}>
          <Text style={styles.defectTitle}>DEFECT IN ASSIGNOR'S TITLE:</Text>
          <Text style={styles.defectParagraph}>
            If the ASSIGNEE discovers that the property is encumbered in any way or there is a defect in the ASSIGNOR'S title, the ASSIGNEE shall be entitled to treat the entire transaction as having been repudiated by the ASSIGNOR and shall be entitled to a full refund of any sums paid from the ASSIGNOR, which sum is not limited to the amount expressed in this Deed and all costs and expenses incurred by the ASSIGNEE arising out of this Agreement or any adverse claim by any third party claiming under the ASSIGNOR.
          </Text>
          <Text style={styles.defectParagraph}>
            This shall not affect the ASSIGNEE'S right(s) to claim incidental damages that may arise from the performance by the ASSIGNEE of his obligations hereunder. If the ASSIGNEE discovers that the property is encumbered by a third party, the Assignee shall be entitled to treat the entire transaction as having been repudiated by the ASSIGNOR, and shall be entitled to a refund of all the monies paid to the ASSIGNOR.
          </Text>
        </View>

        <View style={styles.covenantAffirmationBox}>
          <Text style={styles.covenantAffirmationTitle}>COVENANT OF TITLE & ABSOLUTE INDEMNITY</Text>
          <Text style={styles.covenantAffirmationText}>
            The Assignor unconditionally covenants that the hereditament assigned herein is free from all encumbrances, family disputes, acquisition notices, or adverse ownership claims. The Assignor further guarantees full legal defense and indemnification of the Assignee against all third-party demands whatsoever, in perpetuity.
          </Text>
        </View>
      </Page>

      {/* ================= PAGE 6: SCHEDULES & EXECUTION ================= */}
      <Page size="A4" style={styles.bodyPage}>
        <View style={styles.runningHeader}>
          <View style={styles.runningHeaderLeft}>
            <Image src={LEGAL_ASSETS.chambersLogoSmall} style={styles.runningHeaderLogo} />
            <Text style={styles.runningHeaderText}>THE BRIDGE CHAMBERS : DEED OF ASSIGNMENT</Text>
          </View>
          <Text style={styles.runningHeaderPage}>PAGE 6 OF 6</Text>
        </View>

        <Text style={styles.schedulesTitle}>SCHEDULES</Text>
        <Text style={styles.witnessWhereof}>
          IN WITNESS WHEREOF the parties hereto have set their hands and seals the day, month and year first above written.
        </Text>

        {/* Assignor Execution Block */}
        <View style={styles.executionCard}>
          <Text style={styles.executionPartyTitle}>
            SIGNED, SEALED AND DELIVERED By the within named Assignor:
          </Text>
          <Text style={{ fontSize: 10, fontFamily: 'Times-Bold', color: '#1e293b', marginBottom: 4 }}>
            Mr. {assignorName} ({assignorEntity}):
          </Text>

          <View style={styles.signatureRow}>
            <View style={{ flex: 1 }}>
              <Image src={LEGAL_ASSETS.assignorSignature} style={styles.assignorSigImage} />
              <Text style={styles.signatureCaption}>Assignor Signature</Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 12 }}>
              <Text style={{ fontSize: 9.5, fontFamily: 'Times-Bold', color: '#1e293b', marginBottom: 2 }}>
                In the presence of Assignor's Witness:
              </Text>
              <Text style={{ fontSize: 9, fontFamily: 'Times-Roman', color: '#334155' }}>
                NAME: BELLO ABIODUN
              </Text>
              <Text style={{ fontSize: 9, fontFamily: 'Times-Roman', color: '#334155' }}>
                ADDRESS: 3, BELLO CLOSE, OKE AGO-OWU, ABEOKUTA.
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Image src={LEGAL_ASSETS.witnessSignature} style={styles.witnessSigImage} />
                <Text style={{ fontSize: 9, fontFamily: 'Times-Roman', color: '#475569' }}>
                  DATE: {executionDate.toLocaleDateString('en-GB')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Assignee Execution Block */}
        <View style={styles.executionCard}>
          <Text style={styles.executionPartyTitle}>
            SIGNED, SEALED AND DELIVERED By the within named Assignee:
          </Text>
          <Text style={{ fontSize: 10, fontFamily: 'Times-Bold', color: '#1e293b', marginBottom: 4 }}>
            {customerName.toUpperCase()}:
          </Text>

          <View style={styles.signatureRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureCaption}>Assignee Signature</Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 12 }}>
              <Text style={{ fontSize: 9.5, fontFamily: 'Times-Bold', color: '#1e293b', marginBottom: 2 }}>
                In the presence of Assignee's Witness:
              </Text>
              <Text style={{ fontSize: 8.8, fontFamily: 'Times-Roman', color: '#64748b' }}>
                NAME: ............................................................................
              </Text>
              <Text style={{ fontSize: 8.8, fontFamily: 'Times-Roman', color: '#64748b', marginTop: 4 }}>
                ADDRESS: ........................................................................
              </Text>
              <Text style={{ fontSize: 8.8, fontFamily: 'Times-Roman', color: '#64748b', marginTop: 4 }}>
                OCCUPATION: ................................................................
              </Text>
              <Text style={{ fontSize: 8.8, fontFamily: 'Times-Roman', color: '#64748b', marginTop: 4 }}>
                SIGNATURE: ............................ DATE: ............................
              </Text>
            </View>
          </View>
        </View>

        {/* Magistrate / Notary Public Block */}
        <View style={styles.consentBox}>
          <Text style={styles.consentTitle}>I hereby consent to the transaction contained herein</Text>
          <View style={styles.consentLine} />
          <Text style={{ fontSize: 9.5, fontFamily: 'Times-Bold', color: '#334155', letterSpacing: 1.5 }}>
            MAGISTRATE / NOTARY PUBLIC
          </Text>
          {referenceCode && (
            <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica', color: '#94a3b8', marginTop: 6 }}>
              DOC REF: {referenceCode}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default DeedOfAssignmentTemplate;
