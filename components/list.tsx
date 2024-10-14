import { TrashIcon, EditIcon } from "./icons";
import { Tooltip } from '../node_modules/bootstrap/dist/js/bootstrap.esm';
import { useEffect } from "react";
// import { Tooltip } from 'bootstrap/dist/js/bootstrap.bundle.min.js';

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
    handelCheck ?: (checked: boolean, value: string, index: number | null) => void;
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
  // useEffect(() => {
  //   const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  //   const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))
  //   return () => {
  //     tooltipList.map(t => t.dispose())
  //   }
  // })
    return (
        <>
        {/* 
          TODO:
          - make new ui items editable
          - replace Icons
        */}
            {/* <div className='boarder bg-info rounded-5 bg-opacity-25'>
              <div className='container p-1'>
                <div className='hstack gap-1'>
                  <div className='p-1'>
                    <div
                      className="d-flex justify-content-center align-items-center rounded-circle bg-info bg-opacity-25"
                      style={{
                        width: '2rem',
                        height: '2rem',
                      }}
                      >
                      <i className="bi bi-check-lg" />
                    </div>
                  </div>
                  <div className='p-1'>
                    <div className='rounded-5 bg-info bg-opacity-25'>
                      <div className='p-3'>
                        <div style={{ fontSize: "0.96rem" }}>but cash flow</div>
                      </div>
                    </div>
                  </div>
                  <div className='p-1'>
                    <div className='rounded-5 bg-info bg-opacity-25'>
                      <div className='p-2'>
                        <div className='hstack gap-1'>
                          <div className='p-1'>
                          <i className='bi bi-trash' />
                          </div>
                          <div className='p-1'>
                          <div className='vr'></div>
                          </div>
                          <div className='p-1'>
                          <i className='bi bi-pencil-square' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            <div className={taskType === TaskType.Uncompleted ? 'mb-3' : ''}>
                  {todo.filter(obj => {
                      if (taskType === TaskType.Completed) {
                          return obj.checked === true
                      } else if (taskType === TaskType.Uncompleted) {
                          return obj.checked === false
                      }
                    }).map((value, index) =>(
                      <div className="p-2">
                        <div className={`boarder bg-${taskType === TaskType.Completed ? 'success' : 'info'} rounded-5 bg-opacity-25`}>
                          <div className="container p-1">
                            <div className="hstack gap-1">
                              {/* Checkbox */}
                              <div className='p-1' onClick={() => handelCheck(!value.checked, value.text, index)}>
                                <div
                                  className={`d-flex justify-content-center align-items-center rounded-circle bg-${taskType === TaskType.Completed ? 'success' : 'info'} bg-opacity-25`}
                                  style={{
                                    width: '2rem',
                                    height: '2rem',
                                  }}
                                  >
                                  {value.checked ? <i className="bi bi-check-lg" /> : null}
                                </div>
                              </div>
                              <div className='p-1 w-100'>
                                <div className={`rounded-5 bg-${taskType === TaskType.Completed ? 'success' : 'info'} bg-opacity-25`}>
                                  <div className='p-3'>
                                    <div
                                      style={{ fontSize: "0.96rem", maxWidth: "25rem", minWidth: "10rem" }}
                                      className={`${taskType === TaskType.Completed && 'text-decoration-line-through'}`}
                                      >
                                      {value.isEditing && taskType === TaskType.Uncompleted ? (
                                        <input type="text"
                                          style={{border: 0, outline: 0}}
                                          value={editMessage}
                                          onChange={(event) => setEditMessage(event.target.value)}
                                          className='form-control bg-transparent'
                                          onKeyDown={(event) => handelEnter(event, true, index)}
                                          autoFocus
                                          
                                        />
                                      ) : (value.text) }
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* <div className={'input-group mb-1' + (taskType === TaskType.Completed ? ' grayed-out' : '')} key={index}>
                                <span className='input-group-text'>
                                  <input
                                    type='checkbox'
                                    className='form-check-input mt-0'
                                    key={index}
                                    value={value.text}
                                    onChange={(event) => handelCheck(!value.checked, value.text, index)}
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
                              </div> */}
                              <div className='p-1'>
                                <div className={`rounded-5 bg-${taskType === TaskType.Completed ? 'success' : 'info'} bg-opacity-25`}>
                                  <div className='p-2'>
                                    <div className='hstack gap-1'>
                                      <div className='p-1' onClick={() => handelDelete(value.text)}>
                                        <TrashIcon />
                                      </div>
                                      {taskType === TaskType.Uncompleted && (
                                        <>
                                          <div className='p-1'>
                                            <div className='vr'></div>
                                          </div>
                                          <div className='p-1' onClick={() => handelEdit(index)}>
                                            <EditIcon />
                                          </div>
                                        </>
                                      ) }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
            </div>
        </>
    )
}