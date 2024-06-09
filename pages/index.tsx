import { Container, Card, List, Navbar } from '@/components/main'
import { PlusIcon, TrashIcon, EditIcon } from '@/components/icons'
import React, { useState, useEffect, useRef } from 'react'
import toast, {Toaster} from 'react-hot-toast'


export default function Home() {

  interface Todo {
    text: string,
    checked: boolean
    isEditing: boolean
  }

  const [todo, setTodo] = useState<Todo[]>([]);
  const [message, setMessage] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const refMessage = useRef(null);

  useEffect(() => {
    const localList = localStorage.getItem('list');
    if (localList) {
      setTodo(JSON.parse(localList))
    }
  }, [])

  const handelEdit = (index: number) => {
    // Check if there are any active edit
    let isActiveEdit = todo.some(obj => {
      return obj.isEditing === true
    })
    if (isActiveEdit) {
      toast.error('Can not edit more than one task at the same time.')
      return;
    }

    refMessage.current.disabled = true;
    localStorage.setItem('tempMessage', message);
    setMessage('')

    const updatedTodo: Todo[] = [...todo] 
    updatedTodo[index].isEditing = true
    setEditMessage(updatedTodo[index].text)
    setTodo(updatedTodo)

  }

  const handelEnter = (
    event: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>,
    isEdit: boolean = false,
    index: null | number = null,
  ) => {
    if (
      // Check for click
      event.type === 'click' ||
      
      // Check for enter
      event.type === 'keydown' && (event as React.KeyboardEvent<HTMLSpanElement>).key === 'Enter'
      ) {
      let value: string
      if (isEdit) {
        value = editMessage.trim()
      } else {
        value = message.trim()
      }
      console.log(value);
      let isObjPresent = todo.some(obj => {
        return obj.text === value
      })
      if (isObjPresent) {
        toast.error('This task is already present.')

      } else if (value == "") {
        toast.error('Can not submit an empty task.')

      } else {
        let updatedTodo: Todo[] = []
        if (isEdit) {
          updatedTodo = [...todo]
          updatedTodo[index].text = value
          updatedTodo[index].isEditing = false
        } else {
          updatedTodo = [
            {text: value, checked: false, isEditing: false},
            ...todo,
          ]
        }
        setTodo(updatedTodo)
        localStorage.setItem('list', JSON.stringify(updatedTodo))
        let getTempMessage = localStorage.getItem('tempMessage')
        refMessage.current.disabled = false;
        if (getTempMessage) {
          setMessage(getTempMessage)
          localStorage.setItem('tempMessage', '')
        } else {
          setMessage("")
        }
      }
    }
  }

  const handelCheck = (event, index: number | null = null) => {
    if (index) {
      let beenEditing = [...todo][index]
      let isBeenEditing = beenEditing.isEditing
      console.log(isBeenEditing)
      if (isBeenEditing) {
        toast.error('Can not complete a task while it\'s been edited.')
        return;
      }
    }
    
    let checked = event.target.checked
    let value = event.target.value
    const updatedTodo = (prevTodo: Todo[], checked: boolean, value: string) => {
      return prevTodo.map((obj) => {
        if (obj.text === value) {
          return { ...obj, checked };
        }
        return obj;
      });
    }
    const reserveTodo = updatedTodo(todo, checked, value)
    setTodo(reserveTodo);
    localStorage.setItem('list', JSON.stringify(reserveTodo))

  }

  const handelDelete = (text: string) => {
    const updatedTodo = todo.filter((obj) => {
      if (obj.text === text && obj.isEditing) {
        toast.error('Can not delete a task while it\'s been edit.')
        return obj
      }
      return obj.text !== text
    });

    setTodo(updatedTodo);
    localStorage.setItem('list', JSON.stringify(updatedTodo))
  }

  return (
    <>
      <Toaster />
      <Navbar />
      <Container>
        <Card>
          <List>
            <div className='mb-3'>
              <div className='input-group flex-nowrap'>
                <span className='input-group-text' onClick={(event) => handelEnter(event)}>
                <PlusIcon />
                </span>
                <input
                  value={message}
                  onChange={event => setMessage(event.target.value)}
                  className='form-control'
                  placeholder='fix that bug...'
                  onKeyDown={(event) => handelEnter(event)}
                  ref={refMessage}
                  autoFocus
                />
              </div>
            </div>
            <div className='mb-3'>
                  {todo.filter(obj => {
                      return obj.checked === false
                    }).map((value, index) =>(
                      <div className='input-group mb-1' key={index}>
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
                        {value.isEditing ?
                        <input type="text"
                          value={editMessage}
                          onChange={(event) => setEditMessage(event.target.value)}
                          className='form-control'
                          onKeyDown={(event) => handelEnter(event, true, index)}
                          autoFocus
                          
                        />
                        :(<div className='form-control'>{value.text}</div>)
                        }
                        <span className='input-group-text' onClick={() => handelDelete(value.text)}>
                          <TrashIcon />
                        </span>
                        <span className='input-group-text' onClick={() => handelEdit(index)}>
                          <EditIcon />
                        </span>
                      </div>
                  ))}
            </div>
            <div className=''>
                    {todo.filter(obj => {
                      return obj.checked === true
                    }).map((value, index) =>(
                      <div className='input-group mb-1 grayed-out' key={index}>
                        <span className='input-group-text'>
                          <input
                            type='checkbox'
                            className='form-check-input mt-0'
                            key={index}
                            value={value.text}
                            onChange={handelCheck}
                            checked={value.checked}
                          />
                        </span>
                        <div className='form-control bg-secondary-subtle'>
                          {value.text}
                        </div>
                        <span className='input-group-text' onClick={() => handelDelete(value.text)}>
                          <TrashIcon />
                        </span>
                      </div>
                    ))}
            </div>
          </List>
        </Card>
      </Container>
    </>
  )
}
