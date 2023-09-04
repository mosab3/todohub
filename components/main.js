export function Container({ children }) {
    return (
        <>
            <div className="pt-5">
                <div className="container">
                    {children}
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
