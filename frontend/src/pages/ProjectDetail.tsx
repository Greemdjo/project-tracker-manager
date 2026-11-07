import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
    getProject,
    getGrounds,
    getTasks,
    createTask,
    createGround
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

  // Стейты для формы создания основания
const [groundForm, setGroundForm] = useState({ title: '' })
const [isSavingGround, setIsSavingGround] = useState(false)
const currentGround = grounds.length > 0 ? grounds[0] : null;

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
    
    // Защита: если основания нет, задачу создать нельзя
    if (!currentGround) return; 

    try {
      // ✅ Подставляем ID основания автоматически
      const taskData = {
        ...form,
        ground_id: currentGround.id, 
      }

      await createTask(taskData)
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

    // Функция создания основания
async function handleCreateGround(e: React.FormEvent) {
    e.preventDefault()
    setIsSavingGround(true)
    try {
    // Отправляем данные на бэкенд
    await createGround({
        project_id: projectId,
        title: groundForm.title,
        ground_type: 'creation',
        ground_status: 'new',
    })

    setGroundForm({ title: '' })
    await loadData() // Перезагружаем данные, чтобы основание появилось
    } catch {
    setError('Не удалось создать основание.')
    } finally {
    setIsSavingGround(false)
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

          {!currentGround && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            У этого проекта еще нет основания
          </h3>
          <p className="text-amber-700 mb-4 text-sm">
            Создайте основание, чтобы иметь возможность добавлять задачи.
          </p>
          <form onSubmit={handleCreateGround} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-amber-900 mb-1">
                Название основания
              </label>
              <input
                required
                placeholder="Например: Разработка модуля авторизации"
                value={groundForm.title}
                onChange={(e) => setGroundForm({ title: e.target.value })}
                className="w-full border border-amber-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSavingGround}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 disabled:opacity-50 w-full md:w-auto"
            >
              {isSavingGround ? 'Создание...' : 'Создать основание'}
            </button>
          </form>
        </div>
      )}

            {showForm && (
        <form
        onSubmit={handleCreateTask}
        className="bg-white rounded-xl border p-6 mb-6 space-y-4"
        >
        {/* 1. Название */}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
            Название задачи <span className="text-red-500">*</span>
            </label>
            <input
            required
            placeholder="Например: Сделать авторизацию"
            value={form.title}
            onChange={(e) =>
                setForm({ ...form, title: e.target.value })
            }
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* 2. Основание */}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
            Основание <span className="text-red-500">*</span>
            </label>
            <select
            required
            value={form.ground_id || ''}
            onChange={(e) =>
                setForm({
                ...form,
                ground_id: Number(e.target.value),
                })
            }
            className="w-full border rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="" disabled>Выбери основание</option>
            {grounds.map((ground) => (
                <option key={ground.id} value={ground.id}>
                {ground.title}
                </option>
            ))}
            </select>
        </div>

        {/* 3. Описание */}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
            Описание задачи
            </label>
            <textarea
            placeholder="Подробности выполнения задачи..."
            value={form.description}
            onChange={(e) =>
                setForm({ ...form, description: e.target.value })
            }
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
            />
        </div>

        {/* 4. Часы и Статус */}
        <div className="grid md:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
                Планируемые часы
            </label>
            <input
                type="number"
                min="0"
                placeholder="0"
                value={form.planned_effort}
                onChange={(e) =>
                setForm({
                    ...form,
                    planned_effort: Number(e.target.value),
                })
                }
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
                Статус задачи
            </label>
            <select
                value={form.status}
                onChange={(e) =>
                setForm({
                    ...form,
                    status: e.target.value as TaskCreate['status'],
                })
                }
                className="w-full border rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="new">Новая</option>
                <option value="active">Активная</option>
                <option value="completed">Завершена</option>
                <option value="frozen">Заморожена</option>
                <option value="cancelled">Отменена</option>
            </select>
            </div>
        </div>

        <div className="pt-2">
            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Создать задачу
            </button>
        </div>
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