import { useEffect, useState } from 'react'

import {
  getReports,
  getProjects,
  getTasks,
  getDevelopers,
  createReport,
} from '../api/api'

import type {
  Report,
  Project,
  Task,
  Developer,
  ReportCreate,
} from '../types'

import Loading from '../components/ui/Loading'

const initialForm: ReportCreate = {
  project_id: 0,
  task_id: 0,
  developer_id: 0,
  cntHour: 1,
  reportDate: new Date().toISOString(),
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])

  const [form, setForm] = useState<ReportCreate>(initialForm)

  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  async function loadData() {
    try {
      const [r, p, t, d] = await Promise.all([
        getReports(),
        getProjects(),
        getTasks(),
        getDevelopers(),
      ])

      setReports(r)
      setProjects(p)
      setTasks(t)
      setDevelopers(d)

      setError('')
    } catch {
      setError('Не удалось загрузить отчёты.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()

    try {
      await createReport(form)

      setForm({
        ...initialForm,
        reportDate: new Date().toISOString(),
      })

      setShowForm(false)

      await loadData()
    } catch {
      setError('Не удалось создать отчёт.')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Ежедневные отчёты
          </h1>

          <p className="text-slate-500 mt-2">
            Учёт рабочего времени и выполненных задач
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          + Добавить отчёт
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-5">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border rounded-2xl p-6 mb-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">
            Новый отчёт
          </h2>

          <div>
            <label className="text-sm text-slate-600">
              Проект
            </label>

            <select
              required
              value={form.project_id || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  project_id: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg p-3 mt-1"
            >
              <option value="">Выберите проект</option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.nameProject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600">
              Задача
            </label>

            <select
              required
              value={form.task_id || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  task_id: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg p-3 mt-1"
            >
              <option value="">Выберите задачу</option>

              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600">
              Разработчик
            </label>

            <select
              required
              value={form.developer_id || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  developer_id: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg p-3 mt-1"
            >
              <option value="">Выберите разработчика</option>

              {developers.map((developer) => (
                <option key={developer.id} value={developer.id}>
                  {developer.username}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600">
                Количество часов
              </label>

              <input
                type="number"
                min="1"
                required
                value={form.cntHour}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cntHour: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg p-3 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">
                Дата отчёта
              </label>

              <input
                type="datetime"
                required
                value={new Date(form.reportDate)
                  .toISOString()
                  .slice(0, 16)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reportDate: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-full border rounded-lg p-3 mt-1"
              />
            </div>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg">
            Сохранить отчёт
          </button>
        </form>
      )}

      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-sm text-slate-500">
                <th className="p-5">Дата</th>
                <th className="p-5">Проект</th>
                <th className="p-5">Задача</th>
                <th className="p-5">Разработчик</th>
                <th className="p-5">Часы</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => {
                const project = projects.find(
                  (p) => p.id === report.project_id
                )

                const task = tasks.find(
                  (t) => t.id === report.task_id
                )

                const developer = developers.find(
                  (d) => d.id === report.developer_id
                )

                return (
                  <tr
                    key={report.id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="p-5">
                      {new Date(report.reportDate).toLocaleDateString('ru-RU')}
                    </td>

                    <td className="p-5">
                      {project?.nameProject ?? `#${report.project_id}`}
                    </td>

                    <td className="p-5">
                      {task?.title ?? `#${report.task_id}`}
                    </td>

                    <td className="p-5">
                      {developer?.username ?? `#${report.developer_id}`}
                    </td>

                    <td className="p-5 font-semibold">
                      {report.cntHour} ч.
                    </td>
                  </tr>
                )
              })}

              {reports.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-slate-400"
                  >
                    Отчёты отсутствуют.
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