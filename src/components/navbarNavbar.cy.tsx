import React from 'react'
import Navbar from './navbar'
import { UserProvider } from '@auth0/nextjs-auth0/client'

describe('<Navbar />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<UserProvider><Navbar /></UserProvider>)
  })
})