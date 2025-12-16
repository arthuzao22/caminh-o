"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { VehicleType } from "@prisma/client"

type Vehicle = {
  id: string
  type: VehicleType
  brand: string
  model: string
  year: number
  plate: string
  capacity: number
  description?: string
  photos: Array<{
    id: string
    url: string
    isPrimary: boolean
  }>
  _count: {
    availabilities: number
  }
}

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  TRUCK_SMALL: "Caminhão 3/4",
  TRUCK_MEDIUM: "Caminhão Toco",
  TRUCK_LARGE: "Caminhão Truck",
  TRUCK_SEMI: "Carreta Simples",
  TRUCK_BI: "Bi-trem",
  TRUCK_RODOTREM: "Rodotrem",
  VAN: "Van/Furgão",
  PICKUP: "Pickup",
  OTHER: "Outro"
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles")
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error)
      }

      setVehicles(data.vehicles)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este veículo?")) {
      return
    }

    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir veículo")
      }

      setVehicles(vehicles.filter(v => v.id !== id))
    } catch (error: any) {
      alert(error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Carregando veículos...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meus Veículos</h1>
        <Link
          href="/dashboard/driver/vehicles/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          + Adicionar Veículo
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">Você ainda não cadastrou nenhum veículo.</p>
          <Link
            href="/dashboard/driver/vehicles/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Cadastrar Primeiro Veículo
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              {vehicle.photos.length > 0 ? (
                <img
                  src={vehicle.photos[0].url}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-600">{vehicle.year} • {vehicle.plate}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium">{VEHICLE_TYPE_LABELS[vehicle.type]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacidade:</span>
                    <span className="font-medium">{vehicle.capacity}t</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Publicações:</span>
                    <span className="font-medium">{vehicle._count.availabilities}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/driver/vehicles/${vehicle.id}/edit`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
