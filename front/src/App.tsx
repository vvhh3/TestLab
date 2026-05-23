import './App.css'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Stack } from './components/Stack'
import { WorkSection } from './components/WorkSection'
import { CasesSection } from './components/CasesSection'
import { ContactSection } from './components/ContactSection'
import { AiChat } from './components/AiChat'

function App() {
  return (
    <main>
      <Header />
      <Hero />
      <AiChat/>
      <Stack />
      <WorkSection />
      <CasesSection />
      <ContactSection />
    </main>
  )
}

export default App
