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
                <div className="mx-auto d-sm-flex d-block flex-sm-nowrap">
                    <div className="collapse navbar-collapse text-center" id="navbarSupportedContent">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" href="/">Home</Link>
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
