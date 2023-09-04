import { Container, Card, List } from '@/components/main'


export default function Home() {
  return (
    <>
      <Container>
        <Card>
          <List>
            <li className='list-group-item'>One</li>
            <li className='list-group-item'>Two</li>
            <li className='list-group-item'>Three</li>
          </List>
        </Card>
      </Container>
    </>
  )
}
