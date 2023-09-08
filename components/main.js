import Link from "next/link"

export function Container({ children }) {
    return (
        <>
            <div className="d-flex justify-content-center">
                <div className="pt-5" style={{width: '35rem'}}>
                    <div className="container">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export function Card({ children }) {
    return (
        <>
            <div className="card">
                <div className="card-body">
                    {children}
                </div>
            </div>
        </>
    )
}

export function List({ children }) {
    return (
        <>
            <div className="list-group">
                {children}
            </div>
        </>
    )
}

export function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" href="/">TodoHub</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded={false} aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" href="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/about">About</Link>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav>
        </>
    )
}
