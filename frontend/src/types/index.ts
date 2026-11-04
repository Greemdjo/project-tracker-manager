export type ProjectStatus =
  | 'planning'
  | 'active'
  | 'completed'
  | 'frozen'
  | 'cancelled'

export type GroundType = 'creation' | 'development'

export type GroundStatus =
  | 'new'
  | 'grade'
  | 'active'
  | 'completed'

export type TaskStatus =
  | 'new'
  | 'active'
  | 'completed'
  | 'frozen'
  | 'cancelled'

export interface Project {
  id: number
  nameProject: string
  status: ProjectStatus
  deadline: string | null
  date_start: string | null
  date_end: string | null
}

export interface Ground {
  id: number
  project_id: number
  title: string
  ground_type: GroundType
  ground_status: GroundStatus
}

export interface Task {
  id: number
  title: string
  ground_id: number
  parent_id: number | null
  status: TaskStatus
  description: string
  planned_effort: number
  actual_effort: number
}

export interface Developer {
  id: number
  username: string
  stek: string[]
  CompetenceLVL: string
}

export interface Report {
  id: number
  project_id: number
  task_id: number
  developer_id: number
  cntHour: number
  reportDate: string
}

export type ProjectCreate = Omit<Project, 'id'>
export type GroundCreate = Omit<Ground, 'id'>
export type TaskCreate = Omit<Task, 'id'>
export type DeveloperCreate = Omit<Developer, 'id'>
export type ReportCreate = Omit<Report, 'id'>