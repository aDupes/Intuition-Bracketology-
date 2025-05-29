"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Trophy, Users } from "lucide-react"

interface Contestant {
  id: string
  name: string
  file?: File
  fileUrl?: string
}

interface Match {
  id: string
  contestant1?: Contestant
  contestant2?: Contestant
  winner?: Contestant
}

export default function Component() {
  const [leftBracket, setLeftBracket] = useState<Contestant[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: `left-${i + 1}`,
      name: `Contestant L${i + 1}`,
    })),
  )

  const [rightBracket, setRightBracket] = useState<Contestant[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: `right-${i + 1}`,
      name: `Contestant R${i + 1}`,
    })),
  )

  const [leftRound2, setLeftRound2] = useState<Contestant[]>(Array(5).fill(null))
  const [rightRound2, setRightRound2] = useState<Contestant[]>(Array(5).fill(null))
  const [leftRound3, setLeftRound3] = useState<Contestant[]>(Array(2).fill(null))
  const [rightRound3, setRightRound3] = useState<Contestant[]>(Array(2).fill(null))
  const [leftFinal, setLeftFinal] = useState<Contestant | null>(null)
  const [rightFinal, setRightFinal] = useState<Contestant | null>(null)
  const [champion, setChampion] = useState<Contestant | null>(null)

  const handleFileUpload = (contestantId: string, file: File, bracket: "left" | "right") => {
    const fileUrl = URL.createObjectURL(file)

    if (bracket === "left") {
      setLeftBracket((prev) => prev.map((c) => (c.id === contestantId ? { ...c, file, fileUrl } : c)))
    } else {
      setRightBracket((prev) => prev.map((c) => (c.id === contestantId ? { ...c, file, fileUrl } : c)))
    }
  }

  const handleNameChange = (contestantId: string, name: string, bracket: "left" | "right") => {
    if (bracket === "left") {
      setLeftBracket((prev) => prev.map((c) => (c.id === contestantId ? { ...c, name } : c)))
    } else {
      setRightBracket((prev) => prev.map((c) => (c.id === contestantId ? { ...c, name } : c)))
    }
  }

  const advanceContestant = (contestant: Contestant, round: number, bracket: "left" | "right", position: number) => {
    if (round === 2) {
      if (bracket === "left") {
        setLeftRound2((prev) => {
          const newRound = [...prev]
          newRound[position] = contestant
          return newRound
        })
      } else {
        setRightRound2((prev) => {
          const newRound = [...prev]
          newRound[position] = contestant
          return newRound
        })
      }
    } else if (round === 3) {
      if (bracket === "left") {
        setLeftRound3((prev) => {
          const newRound = [...prev]
          newRound[position] = contestant
          return newRound
        })
      } else {
        setRightRound3((prev) => {
          const newRound = [...prev]
          newRound[position] = contestant
          return newRound
        })
      }
    } else if (round === 4) {
      if (bracket === "left") {
        setLeftFinal(contestant)
      } else {
        setRightFinal(contestant)
      }
    } else if (round === 5) {
      setChampion(contestant)
    }
  }

  const ContestantCard = ({
    contestant,
    bracket,
    round = 1,
    position = 0,
    canAdvance = false,
    advanceToRound = 0,
  }: {
    contestant: Contestant | null
    bracket: "left" | "right"
    round?: number
    position?: number
    canAdvance?: boolean
    advanceToRound?: number
  }) => {
    if (!contestant) {
      return (
        <Card className="w-48 h-32 border-dashed border-2 border-gray-500 bg-gray-900">
          <CardContent className="p-4 flex items-center justify-center h-full">
            <span className="text-gray-300 text-sm">Awaiting Winner</span>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="w-48 h-32 border-2 border-white hover:border-blue-400 transition-colors bg-gray-900">
        <CardContent className="p-3">
          <div className="space-y-2">
            {round === 1 ? (
              <Input
                value={contestant.name}
                onChange={(e) => handleNameChange(contestant.id, e.target.value, bracket)}
                className="text-sm font-medium bg-gray-800 border-gray-600 text-white"
                placeholder="Contestant name"
              />
            ) : (
              <div className="text-sm font-medium truncate text-white">{contestant.name}</div>
            )}

            <div className="flex items-center gap-2">
              {round === 1 ? (
                <Label
                  htmlFor={`file-${contestant.id}`}
                  className="cursor-pointer flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                >
                  <Upload className="w-3 h-3" />
                  Upload Atom
                </Label>
              ) : contestant.fileUrl ? (
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <Upload className="w-3 h-3" />
                  Atom Uploaded
                </div>
              ) : (
                <div className="text-xs text-gray-400">No atom</div>
              )}
            </div>

            {round === 1 && (
              <Input
                id={`file-${contestant.id}`}
                type="file"
                className="hidden"
                accept=".atom,.claim,.json,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileUpload(contestant.id, file, bracket)
                  }
                }}
              />
            )}

            {canAdvance && (
              <Button
                size="sm"
                className="w-full text-xs bg-blue-600 hover:bg-blue-700"
                onClick={() => advanceContestant(contestant, advanceToRound, bracket, position)}
              >
                Advance
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tournament Bracket</h1>
          <p className="text-gray-300">Intuition Systems Atom & Claim Competition</p>
        </div>

        <div className="grid grid-cols-7 gap-8 items-center">
          {/* Left Bracket - Round 1 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-4 text-white flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Round 1 - Left
            </h3>
            {leftBracket.map((contestant, index) => (
              <ContestantCard
                key={contestant.id}
                contestant={contestant}
                bracket="left"
                round={1}
                position={Math.floor(index / 2)}
                canAdvance={index % 2 === 1}
                advanceToRound={2}
              />
            ))}
          </div>

          {/* Left Bracket - Round 2 */}
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-center mb-4 text-white">Round 2</h3>
            {leftRound2.map((contestant, index) => (
              <ContestantCard
                key={`left-r2-${index}`}
                contestant={contestant}
                bracket="left"
                round={2}
                position={Math.floor(index / 2)}
                canAdvance={index < 4 && index % 2 === 1}
                advanceToRound={3}
              />
            ))}
          </div>

          {/* Left Bracket - Round 3 */}
          <div className="space-y-16">
            <h3 className="text-lg font-semibold text-center mb-4 text-white">Semifinals</h3>
            {leftRound3.map((contestant, index) => (
              <ContestantCard
                key={`left-r3-${index}`}
                contestant={contestant}
                bracket="left"
                round={3}
                position={0}
                canAdvance={index === 1}
                advanceToRound={4}
              />
            ))}
          </div>

          {/* Finals */}
          <div className="space-y-32">
            <h3 className="text-lg font-semibold text-center mb-4 text-white flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Finals
            </h3>
            <ContestantCard
              contestant={leftFinal}
              bracket="left"
              round={4}
              canAdvance={!!leftFinal && !!rightFinal}
              advanceToRound={5}
            />
            <ContestantCard
              contestant={rightFinal}
              bracket="right"
              round={4}
              canAdvance={!!leftFinal && !!rightFinal}
              advanceToRound={5}
            />
          </div>

          {/* Right Bracket - Round 3 */}
          <div className="space-y-16">
            <h3 className="text-lg font-semibold text-center mb-4 text-white">Semifinals</h3>
            {rightRound3.map((contestant, index) => (
              <ContestantCard
                key={`right-r3-${index}`}
                contestant={contestant}
                bracket="right"
                round={3}
                position={0}
                canAdvance={index === 1}
                advanceToRound={4}
              />
            ))}
          </div>

          {/* Right Bracket - Round 2 */}
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-center mb-4 text-white">Round 2</h3>
            {rightRound2.map((contestant, index) => (
              <ContestantCard
                key={`right-r2-${index}`}
                contestant={contestant}
                bracket="right"
                round={2}
                position={Math.floor(index / 2)}
                canAdvance={index < 4 && index % 2 === 1}
                advanceToRound={3}
              />
            ))}
          </div>

          {/* Right Bracket - Round 1 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-4 text-white flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Round 1 - Right
            </h3>
            {rightBracket.map((contestant, index) => (
              <ContestantCard
                key={contestant.id}
                contestant={contestant}
                bracket="right"
                round={1}
                position={Math.floor(index / 2)}
                canAdvance={index % 2 === 1}
                advanceToRound={2}
              />
            ))}
          </div>
        </div>

        {/* Champion Display with Logo */}
        {champion && (
          <div className="mt-12 text-center">
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2796-TlfQoUQ8HxldcTaefi6ZRfebiCkkRw.jpeg"
                alt="Tribes of Intuition"
                className="w-64 mx-auto mb-4"
              />
              <div className="inline-block p-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg">
                <Trophy className="w-16 h-16 text-white mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Tournament Champion</h2>
                <p className="text-xl text-yellow-100">{champion.name}</p>
                {champion.fileUrl && <p className="text-sm text-yellow-200 mt-2">✓ Intuition Systems Atom Submitted</p>}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-white">
          <h3 className="text-lg font-semibold text-white mb-2">How to Use</h3>
          <ul className="text-gray-300 space-y-1 text-sm">
            <li>1. Enter contestant names in Round 1</li>
            <li>2. Upload Intuition Systems atoms or claims for each contestant</li>
            <li>3. Click "Advance" buttons to progress winners through each round</li>
            <li>4. Continue until a final champion is crowned</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
