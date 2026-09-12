import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { PlusIcon, ShareIcon } from '@/components/icons'
import { TaskItem, TaskSection } from '@/components/list'
import { ShareModal } from '@/components/share'
import { createId, loadTodos, saveTodos, type Todo } from '@/components/todos'
import { AppToaster, Button, EmptyState, Progress } from '@/components/ui'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const active = useMemo(() => todos.filter((todo) => !todo.checked), [todos])
  const completed = useMemo(() => todos.filter((todo) => todo.checked), [todos])

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
    setTodos((prev) => [{ id: createId(), text, checked: false }, ...prev])
    setDraft('')
    inputRef.current?.focus()
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, checked: !todo.checked } : todo)))
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

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
    if (editingId === id) cancelEdit()
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.checked))
    cancelEdit()
    toast.success('Completed tasks cleared.')
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
          A todo list that lives entirely in this browser. It works offline, uploads nothing, and
          moves between your devices with a QR code.
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
          body="Add your first task above. Everything stays in this browser, so it will still be here when you come back."
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
                    onDraftChange={setEditDraft}
                    onToggle={toggleTodo}
                    onStartEdit={startEdit}
                    onCommitEdit={commitEdit}
                    onCancelEdit={cancelEdit}
                    onDelete={removeTodo}
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
                    onDraftChange={setEditDraft}
                    onToggle={toggleTodo}
                    onStartEdit={startEdit}
                    onCommitEdit={commitEdit}
                    onCancelEdit={cancelEdit}
                    onDelete={removeTodo}
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
