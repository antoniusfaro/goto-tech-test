import React from 'react';
import ApolloProvider from "./providers/ApolloProvider";
import ContactProvider from "./providers/ContactProvider";
import NotificationProvider from "./providers/NotificationProvider";
import RouterProvider from "./providers/RouterProvider";
import "./styles/variables.css"

function App() {
  return (
    <ApolloProvider>
      <ContactProvider>
        <NotificationProvider>
          <RouterProvider />
        </NotificationProvider>
      </ContactProvider>
    </ApolloProvider>
  );
}

export default App;
