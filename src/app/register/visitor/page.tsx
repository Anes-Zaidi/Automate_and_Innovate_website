import Header from '@/components/header'
import VisitorRegistrationForm from '@/components/visitor-registration-form'

export default function VisitorRegisterPage() {
  return (
    <main className="min-h-screen w-full flex flex-col relative" style={{ backgroundColor: '#0C0F14' }}>
     
      <VisitorRegistrationForm />
    </main>
  )
}
