import { Container, Card, Navbar, ShareModal, Todo, Wrapper, ToasterComponent } from '@/components/main'
import { PlusIcon, ShareIcon } from '@/components/icons'
import { List, Items, TaskType } from '@/components/list'
import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'


export default function Home() {

  const [todo, setTodo] = useState<Todo[]>([]);
  const [message, setMessage] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const refMessage = useRef(null);
  const refOpenModal = useRef<HTMLButtonElement>(null)


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
      <Wrapper>
        <ToasterComponent />
        <Navbar />
        <ShareModal
          todo={todo}
          setTodo={setTodo}
          refOpen={refOpenModal}
        />
        <Container>
          <Card>
            <List>
              <div className='mb-3'>
                <div className='input-group flex-nowrap'>
                    <span className='input-group-text'>
                      <div className='hstack gap-2'>
                        <div>
                          <span onClick={(event) => handelEnter(event)}>
                            <PlusIcon />
                          </span>
                        </div>
                        <div className='vr'></div>
                        <div>
                          <span onClick={() => refOpenModal.current?.click()}>
                            <ShareIcon />
                          </span>
                        </div>
                      </div>
                    </span>
                  <input
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                    className='form-control'
                    placeholder='fix that bug...'
                    onKeyDown={(event) => handelEnter(event)}
                    ref={refMessage}
                    dir="auto"
                    autoFocus
                  />
                </div>
              </div>
              <Items
                taskType={TaskType.Uncompleted}
                todo={todo}
                handelEdit={handelEdit}
                handelCheck={handelCheck}
                handelDelete={handelDelete}
                handelEnter={handelEnter}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
              />
              <Items
                taskType={TaskType.Completed}
                todo={todo}
                handelCheck={handelCheck}
                handelDelete={handelDelete}
              />
            </List>
          </Card>
        </Container>
      </Wrapper>
    </>
  )
}
