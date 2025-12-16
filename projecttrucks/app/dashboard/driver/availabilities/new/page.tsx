"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Vehicle = {
  id: string
  brand: string
  model: string
  plate: string
  capacity: number
}

export default function NewAvailabilityPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [formData, setFormData] = useState({
    vehicleId: "",
    originCity: "",
    originState: "",
    destinationCity: "",
    destinationState: "",
    availableDate: "",
    flexibleDates: false,
    availableCapacity: 0,
    priceEstimate: "",
    description: "",
    observations: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles")
      const data = await response.json()

      if (response.ok) {
        setVehicles(data.vehicles)
        if (data.vehicles.length > 0) {
          setFormData(prev => ({
            ...prev,
            vehicleId: data.vehicles[0].id,
            availableCapacity: data.vehicles[0].capacity
          }))
        }
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error)
    }
  }

  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    setFormData({
      ...formData,
      vehicleId,
      availableCapacity: vehicle?.capacity || 0
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const payload = {
        ...formData,
        priceEstimate: formData.priceEstimate ? parseFloat(formData.priceEstimate) : undefined
      }

      const response = await fetch("/api/availabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar publicação")
      }

      router.push("/dashboard/driver/availabilities")
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  if (vehicles.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg">
          <p className="mb-2">Você precisa cadastrar um veículo antes de criar uma publicação.</p>
          <button
            onClick={() => router.push("/dashboard/driver/vehicles/new")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Cadastrar Veículo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nova Publicação de Retorno</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        <div>
          <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-2">
            Veículo *
          </label>
          <select
            id="vehicleId"
            required
            value={formData.vehicleId}
            onChange={(e) => handleVehicleChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {vehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} - {vehicle.plate}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="originCity" className="block text-sm font-medium text-gray-700 mb-2">
              Cidade de Origem *
            </label>
            <input
              id="originCity"
              type="text"
              required
              value={formData.originCity}
              onChange={(e) => setFormData({ ...formData, originCity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="São Paulo"
            />
          </div>

          <div>
            <label htmlFor="originState" className="block text-sm font-medium text-gray-700 mb-2">
              Estado de Origem (UF) *
            </label>
            <input
              id="originState"
              type="text"
              required
              maxLength={2}
              value={formData.originState}
              onChange={(e) => setFormData({ ...formData, originState: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="SP"
            />
          </div>

          <div>
            <label htmlFor="destinationCity" className="block text-sm font-medium text-gray-700 mb-2">
              Cidade de Destino *
            </label>
            <input
              id="destinationCity"
              type="text"
              required
              value={formData.destinationCity}
              onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Rio de Janeiro"
            />
          </div>

          <div>
            <label htmlFor="destinationState" className="block text-sm font-medium text-gray-700 mb-2">
              Estado de Destino (UF) *
            </label>
            <input
              id="destinationState"
              type="text"
              required
              maxLength={2}
              value={formData.destinationState}
              onChange={(e) => setFormData({ ...formData, destinationState: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="RJ"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="availableDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data Disponível *
            </label>
            <input
              id="availableDate"
              type="date"
              required
              value={formData.availableDate}
              onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="availableCapacity" className="block text-sm font-medium text-gray-700 mb-2">
              Capacidade Disponível (t) *
            </label>
            <input
              id="availableCapacity"
              type="number"
              required
              min={0}
              step={0.1}
              value={formData.availableCapacity}
              onChange={(e) => setFormData({ ...formData, availableCapacity: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="priceEstimate" className="block text-sm font-medium text-gray-700 mb-2">
            Valor Estimado (R$)
          </label>
          <input
            id="priceEstimate"
            type="number"
            step={0.01}
            value={formData.priceEstimate}
            onChange={(e) => setFormData({ ...formData, priceEstimate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="1500.00"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.flexibleDates}
              onChange={(e) => setFormData({ ...formData, flexibleDates: e.target.checked })}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Datas flexíveis</span>
          </label>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Detalhes sobre a carga, requisitos especiais, etc."
          />
        </div>

        <div>
          <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            id="observations"
            rows={2}
            value={formData.observations}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Informações adicionais"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Publicando..." : "Publicar Disponibilidade"}
          </button>
        </div>
      </form>
    </div>
  )
}
