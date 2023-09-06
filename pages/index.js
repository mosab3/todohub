import { Container, Card, List } from '@/components/main'
import { useState } from 'react'


export default function Home() {

  const [todo, setTodo] = useState([])

  const handelEnter = (event) => {
    let value = event.target.value
    if (event.key == 'Enter') {
      if (value != "" && todo.includes(value) != true) {
        setTodo(oldList => [...oldList, value])
      }
    }
  }

  return (
    <>
      <Container>
        <Card>
          <List>
            <div className='mb-3'>
              <input className='form-control' placeholder='Input Text...' onKeyDown={handelEnter}/>
            </div>
            <div className='mb-3'>
                <List>
                  {todo.slice(0).reverse().map((value, index) =>
                    <li className='list-group-item' key={index}><input type='checkbox' className='form-check-input' key={index} /> {value}</li>
                  )}
                </List>
            </div>
          </List>
        </Card>
      </Container>
    </>
  )
}
