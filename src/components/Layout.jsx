import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import EzoicAd from './EzoicAd'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Outlet />
        {/* Ezoic Ad Placeholder */}
        <div className="my-8 flex justify-center">
          <EzoicAd placeholderId={101} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
