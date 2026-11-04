import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  getProject,
  getGrounds,
  getTasks,
  createTask,
} from '../api/api'

import type {
  Project,
  Ground,
  Task,
  TaskCreate,
} from '../types'

import Loading from '../components/ui/Loading'

export default function ProjectDetail() {
  const { id } = useParams()
  const projectId = Number(id)

  const [project, setProject] = useState<Project | null>(null)
  const [grounds, setGrounds] = useState<Ground[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState<TaskCreate>({
    title: '',
    ground_id: 0,
    parent_id: null,
    status: 'new',
    description: '',
    planned_effort: 0,
    actual_effort: 0,
  })

  async function loadData() {
    try {
      const [p, g, t] = await Promise.all([
        getProject(projectId),
        getGrounds(),
        getTasks(),
      ])

      setProject(p)

      const projectGrounds = g.filter(
        (ground) => ground.project_id === projectId
      )

      setGrounds(projectGrounds)

      const groundIds = new Set(
        projectGrounds.map((ground) => ground.id)
      )

      setTasks(
        t.filter((task) => groundIds.has(task.ground_id))
      )

      setError('')
    } catch {
      setError('Не удалось загрузить информацию о проекте.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (Number.isInteger(projectId) && projectId > 0) {
      loadData()
    } else {
      setError('Некорректный ID проекта.')
      setLoading(false)
    }
  }, [projectId])

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()

    try {
      await createTask(form)
      setShowForm(false)

      setForm({
        title: '',
        ground_id: 0,
        parent_id: null,
        status: 'new',
        description: '',
        planned_effort: 0,
        actual_effort: 0,
      })

      await loadData()
    } catch {
      setError('Не удалось создать задачу.')
    }
  }

  if (loading) return <Loading />

  if (error && !project) {
    return (
      <div className="bg-red-50 text-red-700 p-5 rounded-xl">
        {error}
      </div>
    )
  }

  if (!project) return null

  return (
    <div>
      <Link
        to="/projects"
        className="text-blue-600 hover:underline"
      >
        ← Назад к проектам
      </Link>

      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold">
          {project.nameProject}
        </h1>

        <p className="text-slate-500 mt-2">
          Проект #{project.id}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-5">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <p className="text-slate-500 text-sm">Статус</p>
          <p className="text-xl font-semibold mt-2">
            {project.status}
          </p>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <p className="text-slate-500 text-sm">Оснований</p>
          <p className="text-xl font-semibold mt-2">
            {grounds.length}
          </p>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <p className="text-slate-500 text-sm">Задач</p>
          <p className="text-xl font-semibold mt-2">
            {tasks.length}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <h2 className="text-xl font-semibold">
          Задачи проекта
        </h2>

        <button
          onClick={() => setShowForm(!showForm)}
          disabled={grounds.length === 0}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg disabled:opacity-50"
        >
          + Добавить задачу
        </button>
      </div>

      {grounds.length === 0 && (
        <p className="text-amber-700 bg-amber-50 p-4 rounded-xl mb-5">
          Для добавления задачи сначала необходимо создать основание проекта.
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleCreateTask}
          className="bg-white rounded-xl border p-6 mb-6 space-y-4"
        >
          <input
            required
            placeholder="Название задачи"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full border rounded-lg p-3"
          />

          <select
            required
            value={form.ground_id || ''}
            onChange={(e) =>
              setForm({
                ...form,
                ground_id: Number(e.target.value),
              })
            }
            className="w-full border rounded-lg p-3"
          >
            <option value="">Выбери основание</option>

            {grounds.map((ground) => (
              <option key={ground.id} value={ground.id}>
                {ground.title}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Описание задачи"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full border rounded-lg p-3"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              min="0"
              placeholder="Планируемые часы"
              value={form.planned_effort}
              onChange={(e) =>
                setForm({
                  ...form,
                  planned_effort: Number(e.target.value),
                })
              }
              className="border rounded-lg p-3"
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as TaskCreate['status'],
                })
              }
              className="border rounded-lg p-3"
            >
              <option value="new">Новая</option>
              <option value="active">Активная</option>
              <option value="completed">Завершена</option>
              <option value="frozen">Заморожена</option>
              <option value="cancelled">Отменена</option>
            </select>
          </div>

          <button className="bg-blue-600 text-white px-5 py-3 rounded-lg">
            Создать задачу
          </button>
        </form>
      )}

      <div className="bg-white border rounded-xl overflow-hidden">
        {tasks.length === 0 ? (
          <p className="p-8 text-center text-slate-400">
            Задач пока нет.
          </p>
        ) : (
          <div className="divide-y">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-5 flex flex-wrap justify-between gap-3"
              >
                <div>
                  <h3 className="font-semibold">
                    {task.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {task.description}
                  </p>
                </div>

                <span className="text-sm bg-slate-100 px-3 py-1 rounded-full h-fit">
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}