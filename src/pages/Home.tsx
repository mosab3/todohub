import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { PlusIcon, ShareIcon } from '@/components/icons'
import { TaskItem, TaskSection, type SubtaskControls } from '@/components/list'
import { ShareModal } from '@/components/share'
import { createId, loadTodos, saveTodos, type Todo } from '@/components/todos'
import { AppToaster, Button, EmptyState, Progress } from '@/components/ui'

/** Duration of the row exit animation in globals.css (`task-out`). */
const REMOVE_MS = 220

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [composerFor, setComposerFor] = useState<string | null>(null)
  const [subtaskDraft, setSubtaskDraft] = useState('')
  // Tasks mid-exit-animation: still rendered, already logically deleted.
  const [removing, setRemoving] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const active = useMemo(() => todos.filter((todo) => !todo.checked), [todos])
  const completed = useMemo(() => todos.filter((todo) => todo.checked), [todos])

  /* Tasks ------------------------------------------------------------------ */

  const addTodo = () => {
    const text = draft.trim()
    if (!text) {
      toast.error('Type a task first.')
      return
    }
    if (todos.some((todo) => todo.text === text)) {
      toast.error('That task is already on your list.')
      return
    }
    setTodos((prev) => [{ id: createId(), text, checked: false, subtasks: [] }, ...prev])
    setDraft('')
    inputRef.current?.focus()
  }

  /**
   * A task and its steps move together: completing the task completes every
   * step, and reopening it reopens them. Steps are otherwise independent, so
   * ticking one off never completes the task for you.
   */
  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== id) return todo
        const checked = !todo.checked
        return {
          ...todo,
          checked,
          subtasks: todo.subtasks.map((subtask) => ({ ...subtask, checked })),
        }
      }),
    )
  }

  const startEdit = (todo: Todo) => {
    if (editingId && editingId !== todo.id) {
      toast.error('Finish the task you are editing first.')
      return
    }
    setEditingId(todo.id)
    setEditDraft(todo.text)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditDraft('')
  }

  const commitEdit = (id: string) => {
    const text = editDraft.trim()
    if (!text) {
      toast.error('A task cannot be empty.')
      return
    }
    if (todos.some((todo) => todo.text === text && todo.id !== id)) {
      toast.error('That task already exists.')
      return
    }
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, text } : todo)))
    cancelEdit()
  }

  /** Removes after the exit animation so the row does not vanish abruptly. */
  const removeTodo = (id: string) => {
    if (removing.includes(id)) return
    setRemoving((prev) => [...prev, id])
    window.setTimeout(() => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
      setRemoving((prev) => prev.filter((value) => value !== id))
      if (editingId === id) cancelEdit()
      if (composerFor === id) closeComposer()
    }, REMOVE_MS)
  }

  const clearCompleted = () => {
    const ids = completed.map((todo) => todo.id)
    if (ids.length === 0) return
    setRemoving((prev) => [...prev, ...ids])
    window.setTimeout(() => {
      setTodos((prev) => prev.filter((todo) => !todo.checked))
      setRemoving((prev) => prev.filter((id) => !ids.includes(id)))
      if (editingId && ids.includes(editingId)) cancelEdit()
      if (composerFor && ids.includes(composerFor)) closeComposer()
    }, REMOVE_MS)
    toast.success(`Cleared ${ids.length} completed ${ids.length === 1 ? 'task' : 'tasks'}.`)
  }

  /* Sub-list --------------------------------------------------------------- */

  const openComposer = (todoId: string) => {
    setComposerFor((current) => (current === todoId ? null : todoId))
    setSubtaskDraft('')
  }

  const closeComposer = () => {
    setComposerFor(null)
    setSubtaskDraft('')
  }

  const addSubtask = (todoId: string) => {
    const text = subtaskDraft.trim()
    if (!text) return

    const target = todos.find((todo) => todo.id === todoId)
    if (!target) return
    if (target.subtasks.some((subtask) => subtask.text === text)) {
      toast.error('That step is already on this task.')
      return
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? { ...todo, subtasks: [...todo.subtasks, { id: createId(), text, checked: false }] }
          : todo,
      ),
    )
    // Composer stays open so several steps can be typed in a row.
    setSubtaskDraft('')
  }

  const toggleSubtask = (todoId: string, subtaskId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subtasks: todo.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, checked: !subtask.checked } : subtask,
              ),
            }
          : todo,
      ),
    )
  }

  const deleteSubtask = (todoId: string, subtaskId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? { ...todo, subtasks: todo.subtasks.filter((subtask) => subtask.id !== subtaskId) }
          : todo,
      ),
    )
  }

  const subtaskControls: SubtaskControls = {
    composerFor,
    draft: subtaskDraft,
    onOpenComposer: openComposer,
    onCloseComposer: closeComposer,
    onDraftChange: setSubtaskDraft,
    onAdd: addSubtask,
    onToggle: toggleSubtask,
    onDelete: deleteSubtask,
  }

  const importTodos = (imported: Todo[]) => {
    setTodos((prev) => [...prev, ...imported])
    toast.success(`Added ${imported.length} ${imported.length === 1 ? 'task' : 'tasks'}.`)
  }

  return (
    <>
      <AppToaster />

      <section className="hero">
        <span className="hero__eyebrow">
          <span className="hero__dot" />
          Local-first &middot; no account needed
        </span>
        <h1 className="hero__title">
          Get it out of your head, <em>onto the list</em>.
        </h1>
        <p className="hero__lede">
          A todo list that lives entirely in this browser. Big tasks can hold their own steps, so a
          vague intention becomes a short, obvious sequence.
        </p>
      </section>

      <Progress done={completed.length} total={todos.length} />

      <div className="composer">
        <Button className="btn--round" onClick={addTodo} aria-label="Add task">
          <PlusIcon size={20} />
        </Button>
        <input
          ref={inputRef}
          className="composer__input"
          value={draft}
          dir="auto"
          autoFocus
          placeholder="What needs doing?"
          aria-label="New task"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') addTodo()
          }}
        />
        <Button variant="ghost" onClick={() => setShareOpen(true)}>
          <ShareIcon size={18} />
          <span className="composer__label">Share</span>
        </Button>
      </div>

      {todos.length === 0 ? (
        <EmptyState
          title="Nothing on the list"
          body="Add your first task above. Open a task's + button to break it into steps, and everything stays in this browser."
        />
      ) : (
        <>
          <TaskSection title="Active" count={active.length}>
            {active.length === 0 ? (
              <p className="section__empty">All clear. Nothing left to do.</p>
            ) : (
              <ul className="tasks">
                {active.map((todo, index) => (
                  <TaskItem
                    key={todo.id}
                    todo={todo}
                    index={index}
                    editing={editingId === todo.id}
                    draft={editDraft}
                    removing={removing.includes(todo.id)}
                    onDraftChange={setEditDraft}
                    onToggle={toggleTodo}
                    onStartEdit={startEdit}
                    onCommitEdit={commitEdit}
                    onCancelEdit={cancelEdit}
                    onDelete={removeTodo}
                    subtasks={subtaskControls}
                  />
                ))}
              </ul>
            )}
          </TaskSection>

          {completed.length > 0 ? (
            <TaskSection title="Completed" count={completed.length}>
              <ul className="tasks">
                {completed.map((todo, index) => (
                  <TaskItem
                    key={todo.id}
                    todo={todo}
                    index={index}
                    editing={false}
                    draft=""
                    removing={removing.includes(todo.id)}
                    onDraftChange={setEditDraft}
                    onToggle={toggleTodo}
                    onStartEdit={startEdit}
                    onCommitEdit={commitEdit}
                    onCancelEdit={cancelEdit}
                    onDelete={removeTodo}
                    subtasks={subtaskControls}
                  />
                ))}
              </ul>
              <div className="section__actions">
                <Button variant="quiet" onClick={clearCompleted}>
                  Clear completed
                </Button>
              </div>
            </TaskSection>
          ) : null}
        </>
      )}

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        todos={todos}
        onImport={importTodos}
      />
    </>
  )
}
