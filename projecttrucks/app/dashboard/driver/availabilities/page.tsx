"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AvailabilityStatus } from "@prisma/client"

type Availability = {
  id: string
  originCity: string
  originState: string
  destinationCity: string
  destinationState: string
  availableDate: string
  availableCapacity: number
  status: AvailabilityStatus
  description?: string
  priceEstimate?: number
  vehicle: {
    brand: string
    model: string
    plate: string
  }
}

export default function AvailabilitiesPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvailabilities()
  }, [])

  const fetchAvailabilities = async () => {
    try {
      const response = await fetch("/api/availabilities")
      const data = await response.json()

      if (response.ok) {
        setAvailabilities(data.availabilities)
      }
    } catch (error) {
      console.error("Error fetching availabilities:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta publicação?")) {
      return
    }

    try {
      const response = await fetch(`/api/availabilities/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setAvailabilities(availabilities.filter(a => a.id !== id))
      }
    } catch (error) {
      console.error("Error deleting availability:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status: AvailabilityStatus) => {
    const badges = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-gray-100 text-gray-800",
      COMPLETED: "bg-blue-100 text-blue-800"
    }
    const labels = {
      ACTIVE: "Ativa",
      INACTIVE: "Inativa",
      COMPLETED: "Concluída"
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-lg text-gray-600">Carregando publicações...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Minhas Publicações</h1>
        <Link
          href="/dashboard/driver/availabilities/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          + Nova Publicação
        </Link>
      </div>

      {availabilities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">Você ainda não publicou nenhuma disponibilidade.</p>
          <Link
            href="/dashboard/driver/availabilities/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Criar Primeira Publicação
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {availabilities.map((availability) => (
            <div
              key={availability.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {availability.originCity}/{availability.originState} → {availability.destinationCity}/{availability.destinationState}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {availability.vehicle.brand} {availability.vehicle.model} - {availability.vehicle.plate}
                  </p>
                </div>
                {getStatusBadge(availability.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="font-medium">{formatDate(availability.availableDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Capacidade</p>
                  <p className="font-medium">{availability.availableCapacity}t</p>
                </div>
                {availability.priceEstimate && (
                  <div>
                    <p className="text-sm text-gray-600">Valor Estimado</p>
                    <p className="font-medium text-green-600">
                      R$ {availability.priceEstimate.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {availability.description && (
                <p className="text-sm text-gray-700 mb-4">{availability.description}</p>
              )}

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/driver/availabilities/${availability.id}/edit`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(availability.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
