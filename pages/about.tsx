import { Container, Card, Navbar } from '@/components/main'


export default function About() {
    return (
        <>
            <Navbar />
            <Container>
                <Card>
                    <h1 className="display-4">About Me</h1>
                    <hr/>
                    <br/>
                    <p>
                        Just some random software engineer.
                    </p>
                </Card>
            </Container>
        </>
    )

}