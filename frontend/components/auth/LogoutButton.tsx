"use client"

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/react'

type LogoutButtonProps = {
  className?: string
  label?: string
}

export default function LogoutButton({ className, label = 'Cerrar sesion' }: LogoutButtonProps) {
  const router = useRouter()
  const logoutMutation = trpc.auth.logout.useMutation()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } finally {
      document.cookie = 'access_token=; Path=/; Max-Age=0; SameSite=Lax'
      router.replace('/login')
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={className}
    >
      {logoutMutation.isLoading ? 'Saliendo...' : label}
    </button>
  )
}
