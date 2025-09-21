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

interface AdminApplicationEmailProps {
  companyName: string;
  jobTitle: string;
  jobId: string;
  candidateName: string;
  userId: string;
  fitScore: number;
  adminUrl: string;
}

export const AdminApplicationEmail = ({
  companyName,
  jobTitle,
  jobId,
  candidateName,
  userId,
  fitScore,
  adminUrl
}: AdminApplicationEmailProps) => (
  <Html>
    <Head />
    <Preview>[Admin] Neue Bewerbung: {jobTitle} bei {companyName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>[Admin] Neue Bewerbung</Heading>
        
        <Text style={text}>
          Hallo Admin,
        </Text>
        
        <Text style={text}>
          eine neue Bewerbung wurde erstellt.
        </Text>

        <Section style={detailsSection}>
          <Text style={detailItem}>
            <strong>Company:</strong> {companyName}
          </Text>
          <Text style={detailItem}>
            <strong>Job:</strong> {jobTitle} (ID {jobId})
          </Text>
          <Text style={detailItem}>
            <strong>Kandidat:</strong> {candidateName} (User {userId}) – FIT {fitScore}
          </Text>
        </Section>

        <Section style={buttonSection}>
          <Button style={primaryButton} href={adminUrl}>
            Application öffnen (Admin)
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={footerText}>
          Status-Monitor & Ratenlimits können im Admin-Dashboard eingesehen werden.
        </Text>

        <Text style={footer}>
          <Link href={`${process.env.SITE_URL || 'https://closebase.app'}/admin`} style={link}>
            Closebase Admin
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default AdminApplicationEmail

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

const detailsSection = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const detailItem = {
  color: '#333',
  fontSize: '14px',
  margin: '8px 0',
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