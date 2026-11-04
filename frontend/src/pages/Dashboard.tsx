import { useEffect, useState } from 'react'
import {
  getProjects,
  getTasks,
  getDevelopers,
} from '../api/api'

import type {
  Project,
  Task,
  Developer,
} from '../types'

import Loading from '../components/ui/Loading'

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [p, t, d] = await Promise.all([
          getProjects(),
          getTasks(),
          getDevelopers(),
        ])

        setProjects(p)
        setTasks(t)
        setDevelopers(d)
      } catch {
        setError('Не удалось загрузить статистику. Проверь работу API.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const stats = [
    {
      title: 'Всего проектов',
      value: projects.length,
      color: 'blue',
    },
    {
      title: 'Всего задач',
      value: tasks.length,
      color: 'violet',
    },
    {
      title: 'Разработчики',
      value: developers.length,
      color: 'emerald',
    },
  ]

  if (loading) return <Loading />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Главная панель
        </h1>

        <p className="text-slate-500 mt-2">
          Общая информация о состоянии проектов
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <p className="text-sm text-slate-500">
              {stat.title}
            </p>

            <h2 className="text-4xl font-bold mt-4 text-slate-800">
              {stat.value}
            </h2>

            <div className="mt-4 text-sm text-slate-400">
              Данные из базы проекта
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-5">
          Последние проекты
        </h2>

        {projects.length === 0 ? (
          <p className="text-slate-500">
            Проекты пока отсутствуют.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-slate-500 text-sm">
                  <th className="py-3">Название</th>
                  <th className="py-3">Статус</th>
                  <th className="py-3">ID</th>
                </tr>
              </thead>

              <tbody>
                {projects.slice(0, 5).map((project) => (
                  <tr
                    key={project.id}
                    className="border-b last:border-0"
                  >
                    <td className="py-4 font-medium">
                      {project.nameProject}
                    </td>

                    <td className="py-4">
                      {project.status}
                    </td>

                    <td className="py-4 text-slate-500">
                      #{project.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}