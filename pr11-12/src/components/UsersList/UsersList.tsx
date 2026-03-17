import { useEffect, useState } from "react";
import "./UsersList.scss";
import type { User } from "../../types/app";
import { api } from "../../api";
import UserItem from "../UserItem/UserItem";

interface Props {
    onEdit: (user: User) => void;
    onUpdate: (user: User) => void;
    users: User[];
}

export default function UsersList({ onEdit, onUpdate, users }: Props) {
    return (
        <div>
            {users.map((user) => (
                <UserItem
                    key={user.id}
                    user={user}
                    onEdit={() => onEdit(user)}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    );
}
