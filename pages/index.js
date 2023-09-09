import { Container, Card, List, Navbar } from '@/components/main'
import { useState, useEffect } from 'react'


export default function Home() {

  const [todo, setTodo] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const localList = localStorage.getItem('list');
    if (localList) {
      setTodo(JSON.parse(localList))
    }
  }, [])

  const handelEnter = (event) => {
    let value = message.trim()
    let isObjPresent = todo.some(obj => {
      return obj.text === value
    })
    if (event.key == 'Enter' || event.type == 'click') {
      if (value != "" && isObjPresent == false) {
        const updatedTodo = [
          {text: value, checked: false},
          ...todo,
        ]
        setTodo(updatedTodo)
        localStorage.setItem('list', JSON.stringify(updatedTodo))
        setMessage("")
      }
    }
  }

  const handelCheck = (event) => {
    let checked = event.target.checked
    let value = event.target.value
    const updatedTodo = (prevTodo, checked, value) => {
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

  const handelDelete = (textToDelete) => {
    const updatedTodo = todo.filter((obj) => obj.text !== textToDelete);
    setTodo(updatedTodo);
    localStorage.setItem('list', JSON.stringify(updatedTodo))
  }

  return (
    <>
      <Navbar />
      <Container>
        <Card>
          <List>
            <div className='mb-3'>
              <div className='input-group flex-nowrap'>
                <span className='input-group-text'><i class="bi bi-plus-lg" onClick={handelEnter}></i></span>
                <input value={message} onChange={event => setMessage(event.target.value)} className='form-control' placeholder='fix that bug...' onKeyDown={handelEnter}/>
              </div>
            </div>
            <div className='mb-3'>
                <List>
                  {todo.filter(obj => {
                      return obj.checked === false
                    }).map((value, index) =>(
                    <li className='list-group-item d-flex justify-content-between align-items-center' key={index}>
                      <div>
                      <input
                        type='checkbox'
                        className='form-check-input'
                        key={index}
                        value={value.text}
                        onChange={handelCheck}
                        checked={value.checked}
                      /> {value.text}
                      </div>
                      <i className="bi bi-trash-fill" onClick={() => handelDelete(value.text)} />
                    </li>
                  ))}
                </List>
            </div>
            <div className=''>
                <List>
                    {todo.filter(obj => {
                      return obj.checked === true
                    }).map((value, index) =>(
                    <li className='list-group-item d-flex justify-content-between align-items-center list-group-item-secondary' key={index}>
                      <div>
                        <input
                          type='checkbox'
                          className='form-check-input'
                          key={index}
                          value={value.text}
                          onChange={handelCheck}
                          checked={value.checked}
                          
                        /> {value.text}
                      </div>
                      <i className="bi bi-trash-fill" onClick={() => handelDelete(value.text)} />
                    </li>
                  ))}
                </List>
            </div>
          </List>
        </Card>
      </Container>
    </>
  )
}
