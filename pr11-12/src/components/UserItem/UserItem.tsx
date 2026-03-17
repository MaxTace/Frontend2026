import { api } from "../../api";
import type { User, UserRole } from "../../types/app";
import "./UserItem.scss";

interface Props {
    user: User;
    onEdit: (user: User) => void;
    onUpdate: (user: User) => void;
}

export default function UserItem({ user, onEdit, onUpdate }: Props) {
    async function onRoleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newRole = event.target.value as UserRole;

        try {
            await api.updateUser(user.id, {
                role: newRole,
            });

            onUpdate({ ...user, role: newRole });
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    }

    async function onBlockToggle() {
        try {
            await api.updateUser(user.id, {
                is_blocked: !user.is_blocked,
            });
        } catch (error) {
            console.error("Error toggling user block status:", error);
        }
        onUpdate({ ...user, is_blocked: !user.is_blocked });
    }

    return (
        <div className="user-item">
            <h3 className="user-item__name">
                {user.first_name} {user.last_name}
            </h3>
            <div className="user-item__email">{user.email}</div>
            <select
                className="user-item__role"
                defaultValue={user.role}
                onChange={onRoleChange}>
                <option value="user">Пользователь</option>
                <option value="seller">Продавец</option>
                <option value="admin">Администратор</option>
            </select>
            <div className="user-item__status">{user.is_blocked ? "Заблокирован" : "Активен"}</div>
            <div className="user-item__actions">
                <button
                    className="user-item__edit-button"
                    onClick={() => onEdit(user)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
                        />
                    </svg>
                </button>
                <button
                    className="user-item__block-button"
                    data-blocked={user.is_blocked}
                    onClick={onBlockToggle}>
                    {user.is_blocked ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M5.85 17.1q1.275-.975 2.85-1.537T12 15t3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4T6.337 6.338T4 12q0 1.475.488 2.775T5.85 17.1M12 13q-1.475 0-2.488-1.012T8.5 9.5t1.013-2.488T12 6t2.488 1.013T15.5 9.5t-1.012 2.488T12 13m0 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q1.325 0 2.5-.387t2.15-1.113q-.975-.725-2.15-1.112T12 17t-2.5.388T7.35 18.5q.975.725 2.15 1.113T12 20m0-9q.65 0 1.075-.425T13.5 9.5t-.425-1.075T12 8t-1.075.425T10.5 9.5t.425 1.075T12 11m0 7.5"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M12 20q1.275 0 2.45-.387t2.2-1.113q-1.025-.725-2.2-1.112T12 17t-2.45.388t-2.2 1.112q1.025.725 2.2 1.113T12 20m2.475-12.975q.775.775.975 1.85t-.25 2.075q-.2.425-.587.588t-.788-.038q-.375-.175-.525-.562t.05-.763q.2-.425.125-.9t-.425-.825q-.325-.325-.763-.412t-.862.087q-.35.125-.7-.038t-.475-.562q-.15-.425.063-.812t.637-.563q.875-.35 1.838-.1t1.687.975M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12q0-1.475.413-2.875t1.212-2.65L1.375 4.2q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3l18.375 18.4q.3.3.288.713t-.313.712t-.7.3t-.7-.3L5.1 7.95q-.55.925-.825 1.95T4 12q0 1.425.475 2.725T5.85 17.1q1.35-1.025 2.913-1.563T12 15q.95 0 1.9.2t1.85.55l3.325 3.325q-1.425 1.425-3.25 2.175T12 22M7.85 2.9q.975-.45 2.025-.675T12 2q2 0 3.825.75t3.25 2.175t2.175 3.25T22 12q0 1.075-.225 2.125T21.1 16.15q-.175.375-.575.488t-.75-.088t-.475-.6t.05-.8q.325-.75.487-1.55T20 12q0-3.35-2.325-5.675T12 4q-.8 0-1.6.162t-1.55.488q-.4.175-.8.05t-.6-.475t-.088-.75t.488-.575"
                            />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
