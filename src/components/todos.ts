/**
 * Todo model and localStorage persistence.
 *
 * Tasks carry a stable `id` so list operations never depend on array indexes.
 * `normalizeTodos` also migrates the pre-id format (and anything shared over QR
 * from an older build) into the current shape.
 */

export interface Todo {
  id: string
  text: string
  checked: boolean
}

const STORAGE_KEY = 'list'

export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/** Coerce unknown input (storage or a scanned QR payload) into valid todos. */
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
    })
  }

  return todos
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
