import { FC, ReactElement } from "react"
import ApolloProvider from "./ApolloProvider"
import ContactProvider from "./ContactProvider"
import NotificationProvider from "./NotificationProvider"
import { MemoryRouter } from "react-router-dom"

interface Props {
  children: ReactElement
}

const TestProvider: FC<Props> = ({ children }) => {
  return (
    <ApolloProvider>
      <ContactProvider>
        <NotificationProvider>
          <MemoryRouter>
            {children}
          </MemoryRouter>
        </NotificationProvider>
      </ContactProvider>
    </ApolloProvider>
  )
}

export default TestProvider