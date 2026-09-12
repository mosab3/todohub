import { useRef, type CSSProperties, type ReactNode } from 'react'
import { CheckIcon, CloseIcon, PencilIcon, PlusIcon, TrashIcon } from './icons'
import { IconButton } from './ui'
import { subtaskProgress, type Todo } from './todos'

/** Everything the sub-list editor needs, grouped so task rows stay readable. */
export interface SubtaskControls {
  /** Id of the task whose "add step" composer is open, if any. */
  composerFor: string | null
  draft: string
  onOpenComposer: (todoId: string) => void
  onCloseComposer: () => void
  onDraftChange: (value: string) => void
  onAdd: (todoId: string) => void
  onToggle: (todoId: string, subtaskId: string) => void
  onDelete: (todoId: string, subtaskId: string) => void
}

interface TaskItemProps {
  todo: Todo
  /** Position in its section - drives the staggered entrance animation. */
  index: number
  editing: boolean
  draft: string
  removing: boolean
  onDraftChange: (value: string) => void
  onToggle: (id: string) => void
  onStartEdit: (todo: Todo) => void
  onCommitEdit: (id: string) => void
  onCancelEdit: () => void
  onDelete: (id: string) => void
  subtasks: SubtaskControls
}

export function TaskItem({
  todo,
  index,
  editing,
  draft,
  removing,
  onDraftChange,
  onToggle,
  onStartEdit,
  onCommitEdit,
  onCancelEdit,
  onDelete,
  subtasks,
}: TaskItemProps) {
  // Escape cancels the edit; without this the resulting blur would re-commit it.
  const skipBlurCommit = useRef(false)
  // Same guard for the "add step" field.
  const skipComposerBlur = useRef(false)

  const composerOpen = subtasks.composerFor === todo.id
  const progress = subtaskProgress(todo)
  const hasSubtasks = progress.total > 0

  const commitSubtask = () => {
    if (skipComposerBlur.current) return
    if (subtasks.draft.trim()) subtasks.onAdd(todo.id)
    else subtasks.onCloseComposer()
  }

  return (
    <li
      className="task"
      data-done={todo.checked}
      data-editing={editing}
      data-removing={removing}
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

      <div className="task__body">
        <div className="task__row">
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
              <span className="task__label">{todo.text}</span>
            </span>
          )}

          {hasSubtasks ? (
            <span
              className="pill pill--sm"
              title={`${progress.done} of ${progress.total} steps done`}
              data-complete={progress.done === progress.total}
            >
              {progress.done}/{progress.total}
            </span>
          ) : null}
        </div>

        {hasSubtasks ? (
          <ul className="subtasks" aria-label={`Steps for ${todo.text}`}>
            {todo.subtasks.map((subtask, subtaskIndex) => (
              <li
                className="subtask"
                key={subtask.id}
                data-done={subtask.checked}
                style={{ '--i': subtaskIndex } as CSSProperties}
              >
                <label className="check check--sm">
                  <input
                    type="checkbox"
                    checked={subtask.checked}
                    onChange={() => subtasks.onToggle(todo.id, subtask.id)}
                    aria-label={`Mark step "${subtask.text}" as ${subtask.checked ? 'not done' : 'done'}`}
                  />
                  <span className="check__box">
                    <CheckIcon size={11} />
                  </span>
                </label>
                <span className="subtask__text" dir="auto">
                  <span className="subtask__label">{subtask.text}</span>
                </span>
                <div className="subtask__actions">
                  <IconButton
                    className="icon-btn--sm"
                    label={`Delete step "${subtask.text}"`}
                    danger
                    onClick={() => subtasks.onDelete(todo.id, subtask.id)}
                  >
                    <TrashIcon size={15} />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {composerOpen ? (
          <div className="subtask-composer">
            <input
              value={subtasks.draft}
              dir="auto"
              autoFocus
              placeholder="Add a step and press Enter"
              aria-label={`Add a step to ${todo.text}`}
              onChange={(event) => subtasks.onDraftChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') subtasks.onAdd(todo.id)
                if (event.key === 'Escape') {
                  skipComposerBlur.current = true
                  subtasks.onCloseComposer()
                }
              }}
              onBlur={() => {
                if (skipComposerBlur.current) {
                  skipComposerBlur.current = false
                  return
                }
                commitSubtask()
              }}
            />
          </div>
        ) : null}
      </div>

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
              <>
                <IconButton
                  label={`Add a step to "${todo.text}"`}
                  onClick={() => subtasks.onOpenComposer(todo.id)}
                >
                  <PlusIcon size={18} />
                </IconButton>
                <IconButton label={`Edit "${todo.text}"`} onClick={() => onStartEdit(todo)}>
                  <PencilIcon size={18} />
                </IconButton>
              </>
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
