import "./Modal.scss";

interface Props {
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal(props: Props) {
    // при нажатии вне модалки
    function onBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
        // проверяем чтобы таргет был бэкдропом
        if (event.target === event.currentTarget) {
            props.onClose();
        }
    }

    return (
        <div
            className="modal-backdrop"
            onClick={onBackdropClick}>
            <div className="modal">
                <h2 className="modal__title">{props.title}</h2>
                {props.children}
            </div>
        </div>
    );
}
