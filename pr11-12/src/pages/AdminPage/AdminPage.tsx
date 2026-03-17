import { useEffect, useState } from "react";
import UsersList from "../../components/UsersList/UsersList";
import "./AdminPage.scss";
import EditUserModal from "../../components/EditUserModal/EditUserModal";
import type { User } from "../../types/app";
import { api } from "../../api";
export default function AdminPage() {
    const [showEditUserModal, setShowEditUserModal] = useState(false);

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const response = await api.getUsers();
            setUsers(response.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    function onUpdateUser(updatedUser: User) {
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    }

    return (
        <>
            <UsersList
                users={users}
                onUpdate={onUpdateUser}
                onEdit={(user) => {
                    setEditingUser(user);
                    setShowEditUserModal(true);
                }}
            />
            {showEditUserModal && editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setShowEditUserModal(false)}
                    onUpdate={onUpdateUser}
                />
            )}
        </>
    );
}
