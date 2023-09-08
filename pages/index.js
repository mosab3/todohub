import { Container, Card, List, Navbar } from '@/components/main'
import { useState } from 'react'


export default function Home() {

  const [todo, setTodo] = useState([])
  const [complete, setComplete] = useState([])

  const handelEnter = (event) => {
    let value = event.target.value
    if (event.key == 'Enter') {
      if (value != "" && todo.includes(value) != true && complete.includes(value) != true) {
        setTodo(oldTodoList => [...oldTodoList, value.trim()])
        event.target.value = ""
      }
    }
  }

  const handelCheck = (event) => {
    let checked = event.target.checked
    let value = event.target.value
    let todoList = todo
    let completeList = complete
    if (complete.includes(value) == false && checked) {
      setTodo(todoList.filter(e => e !== value))
      setComplete(oldCompleteList => [...oldCompleteList, value])
    }
    else if (todo.includes(value) == false && checked == false) {
        setComplete(completeList.filter(e => e !== value))
        setTodo(oldTodoList => [...oldTodoList, value])
    }
  }

  return (
    <>
      <Navbar />
      <Container>
        <Card>
          <List>
            <div className='mb-3'>
              <input className='form-control' placeholder='Input Text...' onKeyDown={handelEnter}/>
            </div>
            <div className='mb-3'>
                <List>
                  {todo.slice(0).reverse().map((value, index) =>
                    <li className='list-group-item' key={index}>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      key={index}
                      value={value}
                      onChange={handelCheck}
                      defaultChecked={false}
                    /> {value}</li>
                  )}
                </List>
            </div>
            <div className='mb-3'>
                <List>
                  {complete.slice(0).reverse().map((value, index) =>
                    <li className='list-group-item list-group-item-secondary' key={index}>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      key={index}
                      value={value}
                      onChange={handelCheck}
                      defaultChecked={true}
                    /> {value}</li>
                  )}
                </List>
            </div>
          </List>
        </Card>
      </Container>
    </>
  )
}
