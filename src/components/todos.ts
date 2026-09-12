/**
 * Todo model and localStorage persistence.
 *
 * Tasks carry a stable `id` so list operations never depend on array indexes,
 * and each task owns a one-level sub-list of steps.
 */

export interface Subtask {
  id: string
  text: string
  checked: boolean
}

export interface Todo {
  id: string
  text: string
  checked: boolean
  subtasks: Subtask[]
}

const STORAGE_KEY = '***'

export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/** Coerce unknown sub-list input (storage or a scanned QR payload) into steps. */
function normalizeSubtasks(input: unknown): Subtask[] {
  if (!Array.isArray(input)) return []

  const seen = new Set<string>()
  const subtasks: Subtask[] = []

  for (const entry of input) {
    if (!entry || typeof entry !== 'object') continue

    const candidate = entry as Partial<Subtask>
    const text = typeof candidate.text === 'string' ? candidate.text.trim() : ''
    if (!text || seen.has(text)) continue
    seen.add(text)

    subtasks.push({
      id: typeof candidate.id === 'string' && candidate.id ? candidate.id : createId(),
      text,
      checked: candidate.checked === true,
    })
  }

  return subtasks
}

/**
 * Coerce unknown input into valid todos, migrating the pre-id and pre-subtask
 * formats (including anything shared over QR from an older build).
 */
export function normalizeTodos(input: unknown): Todo[] {
  if (!Array.isArray(input)) return []

  const seen = new Set<string>()
  const todos: Todo[] = []

  for (const entry of input) {
    if (!entry || typeof entry !== 'object') continue

    const candidate = entry as Partial<Todo>
    const text = typeof candidate.text === 'string' ? candidate.text.trim() : ''
    // Empty tasks are meaningless, and duplicate text breaks the "already
    // present" rule the UI relies on.
    if (!text || seen.has(text)) continue
    seen.add(text)

    todos.push({
      id: typeof candidate.id === 'string' && candidate.id ? candidate.id : createId(),
      text,
      checked: candidate.checked === true,
      subtasks: normalizeSubtasks(candidate.subtasks),
    })
  }

  return todos
}

/** `2/5` progress for a task's sub-list. */
export function subtaskProgress(todo: Todo): { done: number; total: number } {
  return {
    total: todo.subtasks.length,
    done: todo.subtasks.filter((subtask) => subtask.checked).length,
  }
}

export function loadTodos(): Todo[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? normalizeTodos(JSON.parse(raw)) : []
  } catch {
    return []
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    /* storage may be full or blocked - the UI keeps working in memory */
  }
}
