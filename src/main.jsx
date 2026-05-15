import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()


import global_en from "./locales/en/translation.json";
import global_ar from "./locales/ar/translation.json";
import global_sv from "./locales/sv/translation.json";
import i18next from './configuration/i18n.js'
import { I18nextProvider } from 'react-i18next'

i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: { translation: global_en },
    ar: { translation: global_ar },
    sv: { translation: global_sv },
  },  
})


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </I18nextProvider>
  </StrictMode>,
)
