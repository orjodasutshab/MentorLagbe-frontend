"use client";

import { useState } from "react";
import { toast } from "sonner";
import Avatar from "@/components/Avatar";
import { Icon } from "@/components/icons";
import { Badge, EmptyState, ErrorBox, PageTitle, TableSkeleton } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { useApi } from "@/lib/hooks";
import type { Role, User } from "@/lib/types";

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [role, setRole] = useState("all");
  const { data, loading, error, reload } = useApi<{ items: User[] }>(`/admin/users?role=${role}`);
  const [busyId, setBusyId] = useState<string | null>(null);
  const items = data?.items || [];

  async function changeRole(u: User, next: Role) {
    if (next === u.role) return;
    setBusyId(u._id);
    try {
      await api(`/admin/users/${u._id}/role`, { method: "PATCH", body: { role: next } });
      toast.success(`${u.name} is now a ${next}`);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(u: User) {
    if (!window.confirm(`Delete ${u.name} (${u.email})? This cannot be undone.`)) return;
    setBusyId(u._id);
    try {
      await api(`/admin/users/${u._id}`, { method: "DELETE" });
      toast.success("User deleted");
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <PageTitle
        title="User Management"
        subtitle="View every registered user and manage their role."
        action={
          <select className="input" style={{ width: "auto" }} value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filter by role">
            <option value="all">All roles</option>
            <option value="student">Students</option>
            <option value="tutor">Tutors</option>
            <option value="admin">Admins</option>
          </select>
        }
      />
      <div className="card overflow-hidden">
        {error ? (
          <div className="p-5"><ErrorBox message={error} onRetry={reload} /></div>
        ) : loading ? (
          <TableSkeleton />
        ) : items.length === 0 ? (
          <EmptyState title="No users found" />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>User</th><th>Role</th><th>Plan</th><th>Joined</th><th>Change role</th><th /></tr></thead>
              <tbody>
                {items.map((u) => {
                  const self = u._id === me?._id;
                  return (
                    <tr key={u._id}>
                      <td className="min-w-[14rem]">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.image} name={u.name} size={36} />
                          <div className="min-w-0">
                            <p className="font-semibold">{u.name}{self ? " (you)" : ""}</p>
                            <p className="truncate text-xs text-muted">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><Badge value={u.role} /></td>
                      <td><Badge value={u.plan} label={u.plan === "pro" ? "Pro" : "Free"} /></td>
                      <td className="whitespace-nowrap text-muted">{formatDate(u.createdAt)}</td>
                      <td>
                        <select
                          className="input"
                          style={{ width: "auto", padding: "0.4rem 0.6rem" }}
                          value={u.role}
                          disabled={self || busyId === u._id}
                          onChange={(e) => changeRole(u, e.target.value as Role)}
                          aria-label={`Change role for ${u.name}`}
                        >
                          <option value="student">Student</option>
                          <option value="tutor">Tutor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="text-right">
                        <button className="btn btn-danger btn-sm" disabled={self || busyId === u._id} onClick={() => remove(u)} aria-label={`Delete ${u.name}`}>
                          <Icon name="trash" size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
