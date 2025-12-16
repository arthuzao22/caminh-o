"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

type Availability = {
  id: string
  originCity: string
  originState: string
  destinationCity: string
  destinationState: string
  availableDate: string
  availableCapacity: number
  priceEstimate?: number
  description?: string
  vehicle: {
    id: string
    type: string
    brand: string
    model: string
    capacity: number
    photos: Array<{
      url: string
      isPrimary: boolean
    }>
  }
  user: {
    id: string
    name: string
    companyName?: string
    whatsapp?: string
  }
}

const VEHICLE_TYPE_LABELS: Record<string, string> = {
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

export default function SearchPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    originCity: "",
    originState: "",
    destinationCity: "",
    destinationState: "",
    dateFrom: "",
    minCapacity: ""
  })

  useEffect(() => {
    fetchAvailabilities()
  }, [])

  const fetchAvailabilities = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/availabilities/search?${params}`)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchAvailabilities()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const createChat = async (userId: string) => {
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: userId })
      })

      const data = await response.json()

      if (response.ok) {
        window.location.href = `/dashboard/chats/${data.chat.id}`
      }
    } catch (error) {
      console.error("Error creating chat:", error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Buscar Fretes de Retorno</h1>

      {/* Search Filters */}
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origem - Cidade
            </label>
            <input
              type="text"
              value={filters.originCity}
              onChange={(e) => setFilters({ ...filters, originCity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="São Paulo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origem - Estado (UF)
            </label>
            <input
              type="text"
              maxLength={2}
              value={filters.originState}
              onChange={(e) => setFilters({ ...filters, originState: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="SP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destino - Cidade
            </label>
            <input
              type="text"
              value={filters.destinationCity}
              onChange={(e) => setFilters({ ...filters, destinationCity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Rio de Janeiro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destino - Estado (UF)
            </label>
            <input
              type="text"
              maxLength={2}
              value={filters.destinationState}
              onChange={(e) => setFilters({ ...filters, destinationState: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="RJ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data a partir de
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidade mínima (t)
            </label>
            <input
              type="number"
              step={0.1}
              value={filters.minCapacity}
              onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="10"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-lg text-gray-600">Carregando...</div>
        </div>
      ) : availabilities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">Nenhuma disponibilidade encontrada com os filtros aplicados.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availabilities.map((availability) => (
            <div key={availability.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              {availability.vehicle.photos.length > 0 ? (
                <img
                  src={availability.vehicle.photos[0].url}
                  alt={`${availability.vehicle.brand} ${availability.vehicle.model}`}
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    {availability.originCity}/{availability.originState} → {availability.destinationCity}/{availability.destinationState}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Data: {formatDate(availability.availableDate)}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Veículo:</span>
                    <span className="font-medium">
                      {VEHICLE_TYPE_LABELS[availability.vehicle.type]}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacidade:</span>
                    <span className="font-medium">{availability.availableCapacity}t</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Motorista:</span>
                    <span className="font-medium">
                      {availability.user.companyName || availability.user.name}
                    </span>
                  </div>
                  {availability.priceEstimate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valor estimado:</span>
                      <span className="font-medium text-green-600">
                        R$ {availability.priceEstimate.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {availability.description && (
                  <p className="text-sm text-gray-600 mb-4">{availability.description}</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => createChat(availability.user.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Enviar Mensagem
                  </button>
                  {availability.user.whatsapp && (
                    <a
                      href={`https://wa.me/55${availability.user.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
