import { Container, Card, List, Navbar } from '@/components/main'
import { Items } from '@/components/list'
import { useState, useEffect } from 'react'
import { hashString } from 'react-hash-string'

export default function Home() {

  const [todo, setTodo] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const localList = localStorage.getItem('list');
    if (localList) {
      setTodo(JSON.parse(localList))
    }
  }, [])

  const handleEnter = (event) => {
    let value = message.trim()
    let isObjPresent = todo.some(obj => {
      return obj.text === value
    })
    if (event.key == 'Enter' || event.type == 'click') {
      if (value != "" && isObjPresent == false) {
        const updatedTodo = [
          {id: hashString(value), text: value, checked: false},
          ...todo,
        ]
        setTodo(updatedTodo)
        localStorage.setItem('list', JSON.stringify(updatedTodo))
        setMessage("")
      }
    }
  }

  const handleCheck = (checked, id) => {
    const updatedTodo = (prevTodo, checked, id) => {
      return prevTodo.map((obj) => {
        if (obj.id === id) {
          return { ...obj, checked };
        }
        return obj;
      });
    }
    const reserveTodo = updatedTodo(todo, checked, id)
    setTodo(reserveTodo);
    localStorage.setItem('list', JSON.stringify(reserveTodo))

  }

  const handleDelete = (id) => {
    const updatedTodo = todo.filter((obj) => obj.id !== id);
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
                <span className='input-group-text'><i className="bi bi-plus-lg" onClick={handleEnter} /></span>
                <input dir='auto' value={message} onChange={event => setMessage(event.target.value)} className='form-control' placeholder='fix that bug...' onKeyDown={handleEnter}/>
              </div>
            </div>
            <Items
              arr={todo}
              isChecked={false}
              onCheck={handleCheck}
              onDelete={handleDelete}
              isDivSpace={true}
            />
            
            <Items
              arr={todo}
              isChecked={true}
              onCheck={handleCheck}
              onDelete={handleDelete}
              isDivSpace={false}
              isGrayedOut={true}
            />
          </List>
        </Card>
      </Container>
    </>
  )
}
