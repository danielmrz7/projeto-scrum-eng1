import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Cabeçalho / Navbar */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow">
              C
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              Comcil <span className="text-indigo-600">App</span>
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Sistema de Gestão
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
          Plataforma desenvolvida para gestão de cadastros.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/clientes"
            className="px-6 py-3 text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all hover:-translate-y-0.5"
          >
            Gerenciar Clientes
          </Link>
          <a
            href="https://github.com/danielmrz7/projeto-scrum-eng1"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all"
          >
            Ver Repositório GitHub
          </a>
        </div>
      </section>

      {/* Destaques / Funcionalidades */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow max-w-md w-full">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Gestão de Clientes</h3>
            <p className="text-slate-600 text-sm">
              Cadastre, atualize e controle os dados dos clientes com formulários dinâmicos.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-center text-sm">
        <p>© {new Date().getFullYear()} </p>
      </footer>
    </div>
  );
}