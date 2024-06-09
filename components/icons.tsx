interface IconsProps {
    onClick?: () => void; //Optional arg
}

export function PlusIcon() {

    return (
        <>
            <i className="bi bi-plus-lg" />
        </>
    )
}

export function TrashIcon() {

    return (
        <>
            <i className="bi bi-trash-fill" />
        </>
    )
}

export function EditIcon() {

    return (
        <>
            <i className="bi bi-pencil-square" />
        </>
    )
}
