import { useRef, type CSSProperties, type ReactNode } from 'react'
import { CheckIcon, CloseIcon, PencilIcon, TrashIcon } from './icons'
import { IconButton } from './ui'
import type { Todo } from './todos'

interface TaskItemProps {
  todo: Todo
  /** Position in its section - drives the staggered entrance animation. */
  index: number
  editing: boolean
  draft: string
  onDraftChange: (value: string) => void
  onToggle: (id: string) => void
  onStartEdit: (todo: Todo) => void
  onCommitEdit: (id: string) => void
  onCancelEdit: () => void
  onDelete: (id: string) => void
}

export function TaskItem({
  todo,
  index,
  editing,
  draft,
  onDraftChange,
  onToggle,
  onStartEdit,
  onCommitEdit,
  onCancelEdit,
  onDelete,
}: TaskItemProps) {
  // Escape cancels the edit; without this the resulting blur would re-commit it.
  const skipBlurCommit = useRef(false)

  return (
    <li
      className="task"
      data-done={todo.checked}
      data-editing={editing}
      style={{ '--i': index } as CSSProperties}
    >
      <label className="check">
        <input
          type="checkbox"
          checked={todo.checked}
          disabled={editing}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark "${todo.text}" as ${todo.checked ? 'not done' : 'done'}`}
        />
        <span className="check__box">
          <CheckIcon size={14} />
        </span>
      </label>

      {editing ? (
        <input
          className="task__input"
          value={draft}
          dir="auto"
          autoFocus
          aria-label="Edit task"
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onCommitEdit(todo.id)
            if (event.key === 'Escape') {
              skipBlurCommit.current = true
              onCancelEdit()
            }
          }}
          onBlur={() => {
            if (skipBlurCommit.current) {
              skipBlurCommit.current = false
              return
            }
            onCommitEdit(todo.id)
          }}
        />
      ) : (
        <span
          className="task__text"
          dir="auto"
          onDoubleClick={() => {
            if (!todo.checked) onStartEdit(todo)
          }}
        >
          {todo.text}
        </span>
      )}

      <div className="task__actions">
        {editing ? (
          <>
            <IconButton label="Save changes" onClick={() => onCommitEdit(todo.id)}>
              <CheckIcon size={18} />
            </IconButton>
            <IconButton label="Cancel editing" onClick={onCancelEdit}>
              <CloseIcon size={18} />
            </IconButton>
          </>
        ) : (
          <>
            {todo.checked ? null : (
              <IconButton label={`Edit "${todo.text}"`} onClick={() => onStartEdit(todo)}>
                <PencilIcon size={18} />
              </IconButton>
            )}
            <IconButton label={`Delete "${todo.text}"`} danger onClick={() => onDelete(todo.id)}>
              <TrashIcon size={18} />
            </IconButton>
          </>
        )}
      </div>
    </li>
  )
}

interface TaskSectionProps {
  title: string
  count: number
  children: ReactNode
}

export function TaskSection({ title, count, children }: TaskSectionProps) {
  return (
    <section className="section" aria-label={title}>
      <div className="section__head">
        <h2 className="section__title">{title}</h2>
        <span className="pill">{count}</span>
        <span className="section__rule" />
      </div>
      {children}
    </section>
  )
}
