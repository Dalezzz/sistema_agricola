"use client"

import Panel from '@/components/ui/Panel'
import { trpc } from '@/lib/trpc/react'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('es-ES') : 'N/D'

export default function UsuariosPage() {
  const usersQuery = trpc.users.list.useQuery()
  const createUser = trpc.users.create.useMutation()
  const rows = usersQuery.data ?? []

  const handleAddUser = async () => {
    const nextIndex = rows.length + 1
    const firstName = `Usuario${nextIndex}`
    const lastName = 'Demo'

    await createUser.mutateAsync({
      firstName,
      lastName,
      email: `usuario${nextIndex}@demo.com`,
      password: 'demo1234',
    })
    await usersQuery.refetch()
    window.alert(`Se agregó ${firstName} ${lastName} en el backend`)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Equipo</p>
        <h1 className="text-3xl font-bold">Usuarios</h1>
      </div>

      <Panel
        title="Usuarios activos"
        description="Administracion de accesos y responsables por predio."
        action={
          <button
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            onClick={handleAddUser}
          >
            + Nuevo usuario
          </button>
        }
      >
        {usersQuery.isLoading ? (
          <div className="text-sm text-[color:var(--ink-soft)]">Cargando usuarios...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[color:var(--surface-muted)] border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Creado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user: any) => (
                  <tr key={user.id} className="border-b hover:bg-[color:var(--surface-muted)]">
                    <td className="px-4 py-3 font-medium">{`${user.firstName} ${user.lastName}`.trim()}</td>
                    <td className="px-4 py-3 text-sm text-[color:var(--ink-soft)]">{user.email}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && (
              <div className="p-4 text-sm text-[color:var(--ink-soft)]">No hay usuarios registrados.</div>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
