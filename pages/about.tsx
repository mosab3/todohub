import { Container, Card, Navbar, Wrapper } from '@/components/main'


export default function About() {
    return (
        <>
            <Wrapper>
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
            </Wrapper>
        </>
    )

}