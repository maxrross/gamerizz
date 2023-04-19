import React from 'react'
import Home from './index'
import { UserProvider } from '@auth0/nextjs-auth0/client'

describe('<Home />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<UserProvider><Home /></UserProvider>)
  })
})
