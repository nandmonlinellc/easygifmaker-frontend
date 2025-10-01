import './App.css'

function MaintenanceMessage() {
  return (
    <div className="maintenance-page">
      <div className="maintenance-card">
        <h1>EasyGifMaker is undergoing maintenance</h1>
        <p className="maintenance-subtitle">
          We&#39;re upgrading our tools and will be back online shortly. Thanks for your patience and for
          using EasyGifMaker!
        </p>
        <p className="maintenance-contact">
          Need to reach us? Email <a href="mailto:support@easygifmaker.com">support@easygifmaker.com</a> and we&#39;ll
          get back to you soon.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  return <MaintenanceMessage />
}
