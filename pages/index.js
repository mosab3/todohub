import { Container, Card, List, Navbar } from '@/components/main'
import { useState } from 'react'


export default function Home() {

  const [todo, setTodo] = useState([])
  const [message, setMessage] = useState('')

  const handelEnter = (event) => {
    console.log(event)
    let value = message.trim()
    let isObjPresent = todo.some(obj => {
      return obj.text === value
    })
    if (event.key == 'Enter' || event.type == 'click') {
      if (value != "" && isObjPresent == false) {
        setTodo(
          [
            {text: value, checked: false},
            ...todo,
          ]  
        )
        setMessage("")
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

  const handelDelete = (textToDelete) => {
    const updatedTodo = todo.filter((obj) => obj.text !== textToDelete);
    setTodo(updatedTodo);
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
