import Link from "next/link"
import { useState } from "react"
import { Html } from "next/document"

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

export function Switch({label, onChange, checked}) {
    return (
    <div className="form-check form-switch">
        <input type="checkbox" className="form-check-input" onChange={onChange} checked={checked} role="switch" />
        <label className="form-check-label">{label}</label>
    </div>

    )
}

export function Navbar() {
    const [isChecked, setIsChecked] = useState(false)

    const handleToggle = () => {
        let html = document.documentElement
        setIsChecked(!isChecked);
        if (isChecked == false) {
            html.setAttribute("data-bs-theme", "dark")
        } else {
            html.setAttribute("data-bs-theme", "light")
        }
    }
    
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
                        <Switch onChange={handleToggle} checked={isChecked} label="Dark Mode" />
                    </div>
                </div>
            </nav>
        </>
    )
}
