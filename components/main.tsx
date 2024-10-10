import Link from "next/link"
import { useState, useEffect, useRef, LegacyRef, Dispatch } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Scanner } from "@yudiel/react-qr-scanner"
import toast, { Toaster } from "react-hot-toast"

export interface Todo {
    text: string,
    checked: boolean
    isEditing: boolean
  }


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
    const [darkMode, setDarkMode] = useState('light');

    useEffect(() => {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const storedDarkMode = localStorage.getItem('darkMode');
        if (storedDarkMode) {
          setDarkMode(storedDarkMode);
          document.documentElement.setAttribute('data-bs-theme', storedDarkMode);
        }
      }
    }, []);
  
    const toggleDarkMode = () => {
      const newMode = darkMode === 'light' ? 'dark' : 'light';
      setDarkMode(newMode);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('darkMode', newMode);
      }
      document.documentElement.setAttribute('data-bs-theme', newMode);
    };
    
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
                        <Switch onChange={toggleDarkMode} checked={darkMode === 'dark'} label="Dark Mode" />
                    </div>
                </div>
            </nav>
        </>
    )
}

interface ShareModalProps {
    todo: Todo[],
    setTodo: Dispatch<React.SetStateAction<Todo[]>>,
    refOpen: LegacyRef<HTMLButtonElement>
}
export enum ShareType {
    SEND,
    RECEIVE
};

export function ShareModal({todo, setTodo, refOpen}: ShareModalProps) {
    const [shareType, setShareType] = useState<ShareType>(null)
    const [resultObjs, setResultObjs] = useState<Todo[]>([])
    const refCloseModal = useRef<HTMLButtonElement>(null)
    const validateSharedObjs = (sharedArray: Todo[]) => {
        const addTodo = () => {
            const existingItems = new Set(todo.map(items => items.text))
            const filteredList = sharedArray.filter(item => !existingItems.has(item.text))
            setTodo((prevList) => [...prevList, ...filteredList])
            toast.success('List added successfully.')
            refCloseModal.current.click()
        }
        const localArray = sharedArray.map((value, index) => {
            return (
                <div className="mb-3" key={index}>
                    <div className="p-3 rounded-pill bg-info bg-opacity-10">
                        <div className="position-relative">
                            <div className="position-absolute top-50 start-0 translate-middle-y">
                                {value.text}
                            </div>
                            <div className="position-absolute top-50 end-0 translate-middle-y">
                                <span className="badge rounded-pill text-bg-info bg-opacity-75" >
                                    status: <span className="badge rounded-pill text-bg-light bg-opacity-75">{value.checked ? "Completed" : "Uncompleted"}</span>
                                </span>
                                {
                                    todo.some((obj) => obj.text === value.text) &&
                                    <span className="badge rounded-pill text-bg-danger bg-opacity-75">
                                        Duplicated
                                    </span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
        return (
            <>
                {localArray}
                <button type="button" className="btn btn-primary" onClick={addTodo}>Add</button>
            </>
        )
    }

    const generateQR = () => {
        if (shareType === ShareType.SEND) {
            const codeValue = JSON.stringify(todo)
            return (
                <>
                    <QRCodeCanvas className="border p-2 bg-light" value={codeValue} size={230} />
                </>
            )
        }
    }
    const modalBody = () => {
        if (shareType === ShareType.SEND) {
            return (
                <div>
                    <div className="vstack gap-2 mx-auto">
                        <div>
                            {generateQR()}
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => setShareType(null)}>Back</button>
                        </div>
                    </div>
                </div>
            )
        } else if (shareType === ShareType.RECEIVE) {
            return (
                <div className="justify-content-center">
                    <div>
                        {resultObjs.length > 1 ? (
                            validateSharedObjs(resultObjs)
                        ) : (
                            <>
                                <Scanner onScan={result => {
                                    try {
                                        const newList: Todo[] = JSON.parse(result[0].rawValue)
                                        setResultObjs(newList)
                                    } catch (error) {
                                        toast.error("Error While reading the QR code, could not parse the List")
                                        refCloseModal.current.click()
                                    }
                                }}
                                    formats={["qr_code"]}
                                    />
                                <br />
                                <button type="button" className="btn btn-primary" onClick={() => setShareType(null)}>Back</button>
                            </>
                            )}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="hstack gap-2 justify-content-center">
                    <div className="p-2">
                        <button type="button" className="btn btn-primary" onClick={() => setShareType(ShareType.SEND)}>Sender</button>
                    </div>
                    <div className="vr"></div>
                    <div className="p-2">
                        <button type="button" className="btn btn-primary" onClick={() => {setShareType(ShareType.RECEIVE); setResultObjs([])}}>Receiver</button>
                    </div>
                </div>
            )
        }
    }
    return (
        <>
            <Toaster />
            <button type="button" className="btn btn-primary" ref={refOpen} data-bs-toggle="modal" data-bs-target="#shareModal" hidden={true} />
            <div
                className={`modal fade`}
                id="shareModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden={true}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Share List</h1>
                    </div>
                    <div className="modal-body">
                        <div>
                            {modalBody()}
                        </div>
                        <br />
                        <div>
                            <p className="fw-lighter">Share List between device using QR code</p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" ref={refCloseModal} data-bs-dismiss="modal" onClick={() => setShareType(null)}>Close</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}
