"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserRole } from "@prisma/client"

export default function DashboardNav() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isDriver = session?.user?.role === UserRole.DRIVER
  const isClient = session?.user?.role === UserRole.CLIENT

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              RETORNO
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {isDriver && (
                <>
                  <Link
                    href="/dashboard/driver/vehicles"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/dashboard/driver/vehicles")
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Meus Veículos
                  </Link>
                  <Link
                    href="/dashboard/driver/availabilities"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/dashboard/driver/availabilities")
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Minhas Publicações
                  </Link>
                </>
              )}
              
              {isClient && (
                <Link
                  href="/dashboard/search"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/dashboard/search")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Buscar Fretes
                </Link>
              )}

              <Link
                href="/dashboard/chats"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/dashboard/chats")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Mensagens
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              <span className="font-medium">{session?.user?.name}</span>
              <span className="text-gray-500 ml-2">
                ({isDriver ? "Motorista" : "Cliente"})
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
