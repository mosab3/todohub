import { Container, Card, List, Navbar } from '@/components/main'
import { useState } from 'react'


export default function Home() {

  const [todo, setTodo] = useState([])

  const handelEnter = (event) => {
    let value = event.target.value
    let isObjPresent = todo.some(obj => {
      return obj.text === event.target.value
    })
    if (event.key == 'Enter') {
      if (value != "" && isObjPresent == false) {
        setTodo(
          [
            {text: value.trim(), checked: false},
            ...todo,
          ]  
        )
        event.target.value = ""
      }
    }
  }

  const handelCheck = (event) => {
    let checked = event.target.checked
    let value = event.target.value
    setTodo((prevTodo) => {
      return prevTodo.map((obj) => {
        if (obj.text === value) {
          return { ...obj, checked };
        }
        return obj;
      });
    });

  }


  return (
    <>
      <Navbar />
      <Container>
        <Card>
          <List>
            <div className='mb-3'>
              <input className='form-control' placeholder='fix that bug...' onKeyDown={handelEnter}/>
            </div>
            <div className='mb-3'>
                <List>
                  {todo.filter(obj => {
                      return obj.checked === false
                    }).map((value, index) =>(
                    <li className='list-group-item' key={index}>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      key={index}
                      value={value.text}
                      onChange={handelCheck}
                      checked={value.checked}
                    /> {value.text}</li>
                  ))}
                </List>
            </div>
            <div className=''>
                <List>
                    {todo.filter(obj => {
                      return obj.checked === true
                    }).map((value, index) =>(
                    <li className='list-group-item list-group-item-secondary' key={index}>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      key={index}
                      value={value.text}
                      onChange={handelCheck}
                      checked={value.checked}
                    /> {value.text}</li>
                  ))}
                </List>
            </div>
          </List>
        </Card>
      </Container>
    </>
  )
}
