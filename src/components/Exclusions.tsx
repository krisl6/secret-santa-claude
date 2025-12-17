'use client'

import { useState, useEffect } from 'react'

interface Exclusion {
  id: string
  excluder: { id: string; displayName: string }
  excluded: { id: string; displayName: string }
}

interface ExclusionsProps {
  token: string
  participantId: string
  participants: { id: string; displayName: string }[]
  isOrganizer: boolean
}

export default function Exclusions({ token, participantId, participants, isOrganizer }: ExclusionsProps) {
  const [exclusions, setExclusions] = useState<Exclusion[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedExcluded, setSelectedExcluded] = useState('')

  useEffect(() => {
    fetchExclusions()
  }, [token, participantId])

  const fetchExclusions = async () => {
    try {
      const response = await fetch(`/api/exclusions?token=${token}&participantId=${participantId}`)
      const result = await response.json()
      if (response.ok) {
        setExclusions(result.exclusions || [])
      }
    } catch (err) {
      console.error('Failed to fetch exclusions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExclusion = async () => {
    if (!selectedExcluded) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/exclusions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          participantId,
          excludedParticipantId: selectedExcluded,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        alert(result.error || 'Failed to add exclusion')
        return
      }

      setSelectedExcluded('')
      await fetchExclusions()
    } catch (err) {
      alert('Failed to add exclusion')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemoveExclusion = async (excludedId: string) => {
    setActionLoading(true)
    try {
      const response = await fetch('/api/exclusions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          participantId,
          excludedParticipantId: excludedId,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        alert(result.error || 'Failed to remove exclusion')
        return
      }

      await fetchExclusions()
    } catch (err) {
      alert('Failed to remove exclusion')
    } finally {
      setActionLoading(false)
    }
  }

  // Filter out current participant from list
  const availableParticipants = participants.filter((p) => p.id !== participantId)
  const excludedIds = new Set(exclusions.map((e) => e.excluded.id))
  const selectableParticipants = availableParticipants.filter((p) => !excludedIds.has(p.id))

  if (loading) {
    return <div className="text-center p-4">Loading exclusions...</div>
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 border-2 border-[#0F5132]">
      <h3 className="font-bold text-[#0F5132] mb-3 flex items-center gap-2">
        <span>🚫</span>
        Exclusion Rules
      </h3>
      <p className="text-sm text-[#0A3D2E] mb-4">
        {isOrganizer
          ? 'Set who should not be matched with whom (e.g., couples, family members)'
          : 'Exclude people you don\'t want to be your Secret Santa'}
      </p>

      {/* Current Exclusions */}
      {exclusions.length > 0 && (
        <div className="space-y-2 mb-4">
          {exclusions.map((exclusion) => (
            <div
              key={exclusion.id}
              className="flex items-center justify-between bg-gradient-to-r from-[#FFE5E5] to-[#FFF8E7] p-3 rounded-lg border-2 border-[#C8102E]"
            >
              <span className="text-[#0A3D2E] font-semibold">
                You ↔ {exclusion.excluded.displayName}
              </span>
              <button
                onClick={() => handleRemoveExclusion(exclusion.excluded.id)}
                disabled={actionLoading}
                className="text-[#C8102E] hover:text-white hover:bg-[#C8102E] px-3 py-1 rounded-lg transition-all font-semibold text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Exclusion */}
      {selectableParticipants.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedExcluded}
            onChange={(e) => setSelectedExcluded(e.target.value)}
            className="flex-1 px-3 py-2 border-2 border-[#E8F5E9] rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] transition-all bg-white"
          >
            <option value="">Select person to exclude</option>
            {selectableParticipants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.displayName}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddExclusion}
            disabled={actionLoading || !selectedExcluded}
            className="px-4 py-2 bg-gradient-to-r from-[#C8102E] to-[#8B0000] text-white rounded-lg hover:from-[#8B0000] hover:to-[#C8102E] transition-all disabled:opacity-50 font-semibold"
          >
            Add
          </button>
        </div>
      )}

      {selectableParticipants.length === 0 && exclusions.length > 0 && (
        <p className="text-sm text-[#0A3D2E] text-center mt-2">
          All available participants are excluded
        </p>
      )}
    </div>
  )
}

