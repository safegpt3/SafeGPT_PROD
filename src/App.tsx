import React, { useEffect, useState } from 'react'
import Login from './Login' // Make sure this component accepts onLoginSuccess prop
import {
  getClient,
  Webchat,
  WebchatProvider,
  WebchatClient,
  Configuration,
} from '@botpress/webchat'

// Your Botpress client ID (replace with your actual client ID)
const clientId = '22670945-a65d-4a51-a3e4-dfb8ac30601b'

// Optional: Define any user data you want to pass along
const userData = { foo: 'bar' }

// Configuration for your Bot (these values will be shown in the chat header)
const configuration: Configuration = {
  botAvatar: 'https://upload.wikimedia.org/wikipedia/commons/9/91/T-bone-raw-MCB.jpg',
  botDescription: 'Hello, world!',
  botName: 'Hello Bot',
}

const App: React.FC = () => {
  // State to determine if the user has successfully logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // State to hold the Webchat client instance
  const [client, setClient] = useState<WebchatClient | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      // Initialize the Botpress client once the user is authenticated
      const clientInstance = getClient({ clientId })
      setClient(clientInstance)

      // Optional: Listen to all events from the Webchat
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      clientInstance.on('*', (event: any) => {
        console.log('Event received from Webchat:', event)

        // Example: Calling the getUser API
        clientInstance.getUser().then((user) => {
          console.log('Current user:', user)
        })
      })
    }
  }, [isAuthenticated])

  // If not authenticated, show the login page
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  // While waiting for the Webchat client to initialize
  if (!client) {
    return <div>Loading chat...</div>
  }

  // Once authenticated and the client is ready, render the chat
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WebchatProvider
        client={client}
        configuration={configuration}
        userData={userData}
      >
        <Webchat />
      </WebchatProvider>
    </div>
  )
}

export default App
