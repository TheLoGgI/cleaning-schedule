import * as React from "react"

import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import { days, tasks } from "@/app/api/cron/kitchenTasks"

interface PropsType {
  username?: string
  scheduleId?: string
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://www.cleaning-schedule.dk"
console.log("baseUrl: ", baseUrl)

export const NotifyUsersOfSchedule = ({
  username = "",
  scheduleId = "-1",
}: PropsType) => (
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
          alt="Cleaning schedule Logo"
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
            You have cleaning duty in the coming week. You can see your schedule
            below.
          </Text>

          <Link
            style={button}
            href={`https://www.cleaning-schedule.dk/schedule/${scheduleId}`}
          >
            Watch Schedule
          </Link>
        </Section>
        <Section>
          <Text style={text}>
            <strong>Things that has to be done, doing the week</strong>
          </Text>
          {tasks.map((task, index) => {
            return (
              <>
                {index === 0 && (
                  <Row>
                    <strong>
                      {task.days.map((day) => days[day]).join(", ")}
                    </strong>
                  </Row>
                )}
                {index === 5 && (
                  <>
                    <Row>‎ </Row> {/* Empty spacing */}
                    <Row>
                      <strong>Sunday</strong>
                    </Row>
                  </>
                )}
                <Row key={task.task}>
                  <Column>
                    {index + 1}. {task.task}
                  </Column>
                </Row>
              </>
            )
          })}
        </Section>
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
