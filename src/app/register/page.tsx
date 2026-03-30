import Header from '@/components/header'
import RegistrationForm from '@/components/registration-form'

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full flex flex-col relative" style={{ backgroundColor: '#0C0F14' }}>
      <Header />
      <RegistrationForm />
    </main>
  )
}
