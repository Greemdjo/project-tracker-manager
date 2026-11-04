import { useEffect, useState } from 'react'

import { getDevelopers } from '../api/api'
import type { Developer } from '../types'

import Loading from '../components/ui/Loading'

export default function Developers() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDevelopers()
      .then(setDevelopers)
      .catch(() => {
        setError('Не удалось загрузить разработчиков.')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Разработчики
        </h1>

        <p className="text-slate-500 mt-2">
          Команда и технические компетенции
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-5">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-sm text-slate-500">
                <th className="p-5">Разработчик</th>
                <th className="p-5">Технологии</th>
                <th className="p-5">Компетенции</th>
              </tr>
            </thead>

            <tbody>
              {developers.map((developer) => (
                <tr
                  key={developer.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="p-5">
                    <div className="font-medium">
                      {developer.username}
                    </div>

                    <div className="text-xs text-slate-400">
                      ID: {developer.id}
                    </div>
                  </td>

                  <td className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {developer.stek.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-5">
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm">
                      {developer.CompetenceLVL}
                    </span>
                  </td>
                </tr>
              ))}

              {developers.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="p-8 text-center text-slate-400"
                  >
                    Разработчики не найдены.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}