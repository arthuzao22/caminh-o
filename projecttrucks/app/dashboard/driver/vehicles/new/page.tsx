"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { VehicleType } from "@prisma/client"

const VEHICLE_TYPE_OPTIONS = [
  { value: "TRUCK_SMALL", label: "Caminhão 3/4" },
  { value: "TRUCK_MEDIUM", label: "Caminhão Toco" },
  { value: "TRUCK_LARGE", label: "Caminhão Truck" },
  { value: "TRUCK_SEMI", label: "Carreta Simples" },
  { value: "TRUCK_BI", label: "Bi-trem" },
  { value: "TRUCK_RODOTREM", label: "Rodotrem" },
  { value: "VAN", label: "Van/Furgão" },
  { value: "PICKUP", label: "Pickup" },
  { value: "OTHER", label: "Outro" }
]

export default function NewVehiclePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    type: "TRUCK_MEDIUM" as VehicleType,
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    plate: "",
    capacity: 0,
    description: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar veículo")
      }

      router.push("/dashboard/driver/vehicles")
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-black mb-8">Cadastrar Veículo</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-black mb-2">
            Tipo de Veículo *
          </label>
          <select
            id="type"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as VehicleType })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
          >
            {VEHICLE_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
              Marca *
            </label>
            <input
              id="brand"
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
              placeholder="Ex: Scania, Mercedes, Volvo"
            />
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              Modelo *
            </label>
            <input
              id="model"
              type="text"
              required
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
              placeholder="Ex: R 450, Atego"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Ano *
            </label>
            <input
              id="year"
              type="number"
              required
              min={1900}
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="plate" className="block text-sm font-medium text-gray-700 mb-2">
              Placa *
            </label>
            <input
              id="plate"
              type="text"
              required
              value={formData.plate}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
              placeholder="ABC1D23"
            />
          </div>
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
            Capacidade (toneladas) *
          </label>
          <input
            id="capacity"
            type="number"
            required
            min={0}
            step={0.1}
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
            placeholder="Ex: 15.5"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
            placeholder="Informações adicionais sobre o veículo..."
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
            {loading ? "Cadastrando..." : "Cadastrar Veículo"}
          </button>
        </div>
      </form>
    </div>
  )
}
