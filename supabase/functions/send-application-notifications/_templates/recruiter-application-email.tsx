import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface RecruiterApplicationEmailProps {
  recruiterName: string;
  jobTitle: string;
  candidateName: string;
  fitScore: number;
  avgDealSize?: number;
  languages: string[];
  assessmentScore?: number;
  threadUrl: string;
  candidateUrl: string;
  companyName: string;
  fitReasons: string[];
}

export const RecruiterApplicationEmail = ({
  recruiterName,
  jobTitle,
  candidateName,
  fitScore,
  avgDealSize,
  languages,
  assessmentScore,
  threadUrl,
  candidateUrl,
  companyName,
  fitReasons
}: RecruiterApplicationEmailProps) => (
  <Html>
    <Head />
    <Preview>Neue Bewerbung: {jobTitle} – {candidateName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Neue Bewerbung eingegangen 👋</Heading>
        
        <Text style={text}>
          Hallo {recruiterName},
        </Text>
        
        <Text style={text}>
          es gibt eine neue Bewerbung auf <strong>{jobTitle}</strong>.
        </Text>

        <Section style={candidateSection}>
          <Text style={candidateTitle}>
            <strong>Kandidat:</strong> {candidateName} · FIT {fitScore} / 100
          </Text>
          
          <Text style={candidateDetails}>
            <strong>Dealgröße:</strong> {avgDealSize ? `€${avgDealSize.toLocaleString('de-DE')}` : '—'} · 
            <strong>Sprachen:</strong> {languages.join(', ')} · 
            <strong>SCI-Score:</strong> {assessmentScore || '—'}
          </Text>
        </Section>

        {fitReasons.length > 0 && (
          <Section style={fitSection}>
            <Text style={sectionTitle}><strong>Warum passt der Kandidat?</strong></Text>
            {fitReasons.slice(0, 3).map((reason, index) => (
              <Text key={index} style={fitReason}>• {reason}</Text>
            ))}
          </Section>
        )}

        <Section style={buttonSection}>
          <Button style={primaryButton} href={threadUrl}>
            Zum Chat öffnen
          </Button>
        </Section>

        <Text style={text}>
          Alternativ kannst du die Bewerbung direkt im Dashboard öffnen:
        </Text>

        <Section style={buttonSection}>
          <Button style={secondaryButton} href={candidateUrl}>
            Bewerbung ansehen
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={footerText}>
          <strong>Tipp:</strong> Antworte schnell – die besten Kandidaten sind nicht lange verfügbar.
        </Text>

        <Text style={footer}>
          <Link href={`${process.env.SITE_URL || 'https://closebase.app'}`} style={link}>
            Closebase
          </Link>
          , die führende Sales-Recruiting-Plattform.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecruiterApplicationEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const candidateSection = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const candidateTitle = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
}

const candidateDetails = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
  lineHeight: '20px',
}

const fitSection = {
  margin: '20px 0',
}

const sectionTitle = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
}

const fitReason = {
  color: '#666',
  fontSize: '14px',
  margin: '4px 0',
  lineHeight: '20px',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const primaryButton = {
  backgroundColor: '#007cff',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 8px',
}

const secondaryButton = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e1e5e9',
  color: '#333',
  fontSize: '16px',
  fontWeight: 'normal',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 8px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '16px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '12px',
}

const link = {
  color: '#007cff',
  textDecoration: 'underline',
}