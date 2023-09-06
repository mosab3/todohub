import { Container, Card, List } from '@/components/main'


export default function Home() {

  const handelEnter = (event) => {
    if (event.key == 'Enter') {
      console.log('Entered.')
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
                <li className='list-group-item'>One</li>
                <li className='list-group-item'>Two</li>
                <li className='list-group-item'>Three</li>
              </List>
          </div>
          </List>
        </Card>
      </Container>
    </>
  )
}
