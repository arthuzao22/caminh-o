import { auth } from "@/lib/auth/auth-options"
import { UserRole } from "@prisma/client"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Não autorizado")
  }
  return user
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Acesso negado: permissão insuficiente")
  }
  return user
}

export async function isDriver() {
  const user = await getCurrentUser()
  return user?.role === UserRole.DRIVER
}

export async function isClient() {
  const user = await getCurrentUser()
  return user?.role === UserRole.CLIENT
}

export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === UserRole.ADMIN
}
