import { TrashIcon, EditIcon } from "./icons";
export enum TaskType {
    Completed,
    Uncompleted
}
interface Todo {
    text: string;
    checked: boolean;
    isEditing: boolean;
}
interface ItemProps {
    taskType: TaskType;
    todo: Todo[];
    handelEdit ?: (index: number) => void;
    handelCheck ?: (event: React.ChangeEvent<HTMLInputElement>, index: number | null) => void;
    handelDelete ?: (text: string) => void;
    handelEnter ?: (event: React.KeyboardEvent<HTMLSpanElement>, isEdit: boolean, index: number | null) => void;
    editMessage ?: string;
    setEditMessage ?: React.Dispatch<React.SetStateAction<string>>;
}

export function List({ children }) {
  return (
      <>
          <div className="list-group">
              {children}
          </div>
      </>
  )
}

export function Items ({
    taskType,
    todo,
    handelEdit,
    handelCheck,
    handelDelete,
    handelEnter,
    editMessage,
    setEditMessage
}: ItemProps) {
    return (
        <>
            <div className={taskType === TaskType.Uncompleted ? 'mb-3' : ''}>
                  {todo.filter(obj => {
                      if (taskType === TaskType.Completed) {
                          return obj.checked === true
                      } else if (taskType === TaskType.Uncompleted) {
                          return obj.checked === false
                      }
                    }).map((value, index) =>(
                      <div className={'input-group mb-1' + (taskType === TaskType.Completed ? ' grayed-out' : '')} key={index}>
                        <span className='input-group-text'>
                          <input
                            type='checkbox'
                            className='form-check-input mt-0'
                            key={index}
                            value={value.text}
                            onChange={(event) => handelCheck(event, index)}
                            checked={value.checked}
                          />
                        </span>
                        {value.isEditing && taskType === TaskType.Uncompleted?
                        <input type="text"
                          value={editMessage}
                          onChange={(event) => setEditMessage(event.target.value)}
                          className='form-control'
                          onKeyDown={(event) => handelEnter(event, true, index)}
                          autoFocus
                          
                        />
                        :(<div className={'form-control' + (taskType === TaskType.Completed ? ' bg-secondary-subtle' : '')}>{value.text}</div>)
                        }
                        <span className='input-group-text' onClick={() => handelDelete(value.text)}>
                          <TrashIcon />
                        </span>
                        {taskType === TaskType.Completed ? null : (
                            <span className='input-group-text' onClick={() => handelEdit(index)}>
                            <EditIcon />
                            </span>
                        )}
                      </div>
                  ))}
            </div>
        </>
    )
}