import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  getProjects,
  createProject,
  deleteProject,
} from '../api/api'

import type {
  Project,
  ProjectCreate,
  ProjectStatus,
} from '../types'

import Loading from '../components/ui/Loading'

const initialForm: ProjectCreate = {
  nameProject: '',
  status: 'planning',
  deadline: null,
  date_start: null,
  date_end: null,
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [form, setForm] = useState<ProjectCreate>(initialForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadProjects() {
    try {
      setProjects(await getProjects())
      setError('')
    } catch {
      setError('Не удалось загрузить проекты.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()

    setSaving(true)
    setError('')

    try {
      const projectData = {
        ...form,
        deadline: form.deadline || null,
      }

      await createProject(projectData)

      setForm(initialForm)
      setShowForm(false)

      await loadProjects()
    } catch {
      setError('Не удалось создать проект. Проверь данные.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Удалить этот проект?')) return

    try {
      await deleteProject(id)
      await loadProjects()
    } catch {
      setError('Не удалось удалить проект.')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Проекты
          </h1>
          <p className="text-slate-500 mt-2">
            Управление проектами
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
        >
          {showForm ? 'Закрыть форму' : '+ Создать проект'}
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
          className="bg-white p-6 rounded-2xl border border-slate-200 mb-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">
            Новый проект
          </h2>

          <input
            required
            placeholder="Название проекта"
            value={form.nameProject}
            onChange={(e) =>
              setForm({ ...form, nameProject: e.target.value })
            }
            className="w-full border border-slate-300 rounded-lg p-3"
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as ProjectStatus,
              })
            }
            className="w-full border border-slate-300 rounded-lg p-3"
          >
            <option value="planning">Планирование</option>
            <option value="active">Активный</option>
            <option value="completed">Завершён</option>
            <option value="frozen">Заморожен</option>
            <option value="cancelled">Отменён</option>
          </select>

          <label className="block text-sm text-slate-600">
            Дедлайн
            <input
              type="date"
              value={form.deadline ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  deadline: e.target.value || null,
                })
              }
              className="w-full border border-slate-300 rounded-lg p-3 mt-1"
            />
          </label>

          <div className="flex gap-3">
            <button
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg disabled:opacity-50"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-slate-100 px-5 py-3 rounded-lg"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-sm text-slate-500">
                <th className="p-5">ID</th>
                <th className="p-5">Название</th>
                <th className="p-5">Статус</th>
                <th className="p-5">Дедлайн</th>
                <th className="p-5">Действия</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-5 text-slate-500">
                    #{project.id}
                  </td>

                  <td className="p-5 font-medium">
                    {project.nameProject}
                  </td>

                  <td className="p-5">
                    {project.status}
                  </td>

                  <td className="p-5">
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString('ru-RU')
                      : '—'}
                  </td>

                  <td className="p-5">
                    <div className="flex gap-3">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Открыть
                      </Link>

                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-500 hover:underline"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {projects.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-slate-400"
                  >
                    Проекты не найдены.
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