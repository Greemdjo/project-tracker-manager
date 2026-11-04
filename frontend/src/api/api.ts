import axios from 'axios'

import type {
  Project,
  Ground,
  Task,
  Developer,
  Report,
  ProjectCreate,
  GroundCreate,
  TaskCreate,
  DeveloperCreate,
  ReportCreate,
} from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Сервер API недоступен')
    } else {
      console.error(
        'Ошибка API:',
        error.response.status,
        error.response.data
      )
    }

    return Promise.reject(error)
  }
)

// Универсальные CRUD-функции
async function getAll<T>(endpoint: string): Promise<T[]> {
  const response = await api.get<T[]>(endpoint)
  return response.data
}

async function getById<T>(
  endpoint: string,
  id: number
): Promise<T> {
  const response = await api.get<T>(`${endpoint}${id}/`)
  return response.data
}

async function create<T, D>(
  endpoint: string,
  data: D
): Promise<T> {
  const response = await api.post<T>(endpoint, data)
  return response.data
}

async function update<T, D>(
  endpoint: string,
  id: number,
  data: D
): Promise<T> {
  const response = await api.put<T>(
    `${endpoint}${id}/`,
    data
  )

  return response.data
}

async function remove(
  endpoint: string,
  id: number
): Promise<void> {
  await api.delete(`${endpoint}${id}/`)
}

// ==========================
// PROJECTS
// ==========================

export const getProjects = () =>
  getAll<Project>('/projects/')

export const getProject = (id: number) =>
  getById<Project>('/projects/', id)

export const createProject = (data: ProjectCreate) =>
  create<Project, ProjectCreate>('/projects/', data)

export const updateProject = (
  id: number,
  data: ProjectCreate
) => update<Project, ProjectCreate>('/projects/', id, data)

export const deleteProject = (id: number) =>
  remove('/projects/', id)

// ==========================
// GROUNDS
// ==========================

export const getGrounds = () =>
  getAll<Ground>('/grounds/')

export const getGround = (id: number) =>
  getById<Ground>('/grounds/', id)

export const createGround = (data: GroundCreate) =>
  create<Ground, GroundCreate>('/grounds/', data)

export const updateGround = (
  id: number,
  data: GroundCreate
) => update<Ground, GroundCreate>('/grounds/', id, data)

export const deleteGround = (id: number) =>
  remove('/grounds/', id)

// ==========================
// TASKS
// ==========================

export const getTasks = () =>
  getAll<Task>('/tasks/')

export const getTask = (id: number) =>
  getById<Task>('/tasks/', id)

export const createTask = (data: TaskCreate) =>
  create<Task, TaskCreate>('/tasks/', data)

export const updateTask = (
  id: number,
  data: TaskCreate
) => update<Task, TaskCreate>('/tasks/', id, data)

export const deleteTask = (id: number) =>
  remove('/tasks/', id)

// ==========================
// DEVELOPERS
// ==========================

export const getDevelopers = () =>
  getAll<Developer>('/developers/')

export const getDeveloper = (id: number) =>
  getById<Developer>('/developers/', id)

export const createDeveloper = (data: DeveloperCreate) =>
  create<Developer, DeveloperCreate>('/developers/', data)

export const updateDeveloper = (
  id: number,
  data: DeveloperCreate
) => update<Developer, DeveloperCreate>(
  '/developers/',
  id,
  data
)

export const deleteDeveloper = (id: number) =>
  remove('/developers/', id)

// ==========================
// REPORTS
// ==========================

export const getReports = () =>
  getAll<Report>('/reports/')

export const getReport = (id: number) =>
  getById<Report>('/reports/', id)

export const createReport = (data: ReportCreate) =>
  create<Report, ReportCreate>('/reports/', data)

export const updateReport = (
  id: number,
  data: ReportCreate
) => update<Report, ReportCreate>(
  '/reports/',
  id,
  data
)

export const deleteReport = (id: number) =>
  remove('/reports/', id)

export default api