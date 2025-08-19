import MainHeader from '@/components/layout/main-header';

export default function HackathonsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
