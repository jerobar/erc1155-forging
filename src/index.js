import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import store from './stores/store'
import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'

import { App } from './App'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
)
