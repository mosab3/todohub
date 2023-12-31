export function Items ({arr, isChecked, onCheck, onDelete, isDivSpace, isGrayedOut}) {
    const items = arr.filter(
        (obj) => obj.checked === isChecked
    ).map(
        (value) => (
            <div className="input-group mb-1" key={value.id}>
                <span className="input-group-text">
                    <input
                        type="checkbox"
                        className="form-check-input mt-0"
                        key={value.id}
                        value={value.text}
                        onChange={event => onCheck(event.target.checked, value.id)}
                        checked={value.checked}
                    />
                </span>
                <div dir="auto" className={`form-control${isGrayedOut ? " bg-secondary-subtle" : ""}`}>
                    {value.text}
                </div>
                <span className="input-group-text" value={value.text} onClick={() => onDelete(value.id)}>
                    <i className="bi bi-trash-fill" />
                </span>
            </div>
        )
    )
    return (
        <div className={isDivSpace ? "mb-3" : ""}>
            {items}
        </div>
    )
}