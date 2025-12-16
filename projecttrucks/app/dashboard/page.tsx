"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { UserRole } from "@prisma/client"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect to role-specific dashboard
      if (session?.user?.role === UserRole.DRIVER) {
        router.push("/dashboard/driver/vehicles")
      } else if (session?.user?.role === UserRole.CLIENT) {
        router.push("/dashboard/search")
      }
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Bem-vindo, {session?.user?.name}!
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {session?.user?.role === UserRole.DRIVER && (
          <>
            <Link
              href="/dashboard/driver/vehicles"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Meus Veículos
              </h2>
              <p className="text-gray-600">
                Gerencie sua frota de veículos
              </p>
            </Link>

            <Link
              href="/dashboard/driver/availabilities"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Minhas Publicações
              </h2>
              <p className="text-gray-600">
                Gerencie suas disponibilidades de retorno
              </p>
            </Link>
          </>
        )}

        {session?.user?.role === UserRole.CLIENT && (
          <Link
            href="/dashboard/search"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Buscar Fretes
            </h2>
            <p className="text-gray-600">
              Encontre fretes de retorno disponíveis
            </p>
          </Link>
        )}

        <Link
          href="/dashboard/chats"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Mensagens
          </h2>
          <p className="text-gray-600">
            Converse com motoristas ou clientes
          </p>
        </Link>
      </div>
    </div>
  )
}
