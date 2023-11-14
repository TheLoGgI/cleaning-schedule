"use client"

import * as React from "react"

import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface PropsType {
  username?: string
  scheduleId?: string
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : ""

export const Email = ({ username = "", scheduleId = "-1" }: PropsType) => (
  <Html>
    <Head />
    <Preview>
      A fine-grained personal access token has been added to your account
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/cleaning-schedule-logo.png`}
          width="32"
          height="32"
          alt="Github"
        />

        <Text style={title}>
          <strong>{username}</strong>, you have cleaning duty in the coming
          week!
        </Text>

        <Section style={section}>
          <Text style={text}>
            Hey <strong>{username}</strong>!
          </Text>
          <Text style={text}>
            A fine-grained personal access token (<Link>resend</Link>) was
            recently added to your account.
          </Text>

          <Link
            style={button}
            href={`https://www.cleaning-schedule.dk/schedule/${scheduleId}`}
          >
            Watch Schedule
          </Link>
        </Section>
        {/* <Text style={links}>
          <Link style={link}>Your security audit log</Link> ・{" "}
          <Link style={link}>Contact support</Link>
        </Text> */}

        {/* <Text style={footer}>
          GitHub, Inc. ・88 Colin P Kelly Jr Street ・San Francisco, CA 94107
        </Text> */}
      </Container>
    </Body>
  </Html>
)

// export default GithubAccessTokenEmail

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
}

const container = {
  width: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
}

const title = {
  fontSize: "24px",
  lineHeight: 1.25,
}

const section = {
  padding: "24px",

  textAlign: "center" as const,
}

const text = {
  margin: "0 0 10px 0",
  textAlign: "left" as const,
}

const button = {
  display: "block",
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "0.75em 1.5em",
}

const links = {
  textAlign: "center" as const,
}

const link = {
  color: "#0366d6",
  fontSize: "12px",
}

const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "60px",
}
