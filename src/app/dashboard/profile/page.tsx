"use client";

import { useState } from "react";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import { Badge, PageTitle, Spinner } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import type { User } from "@/lib/types";

const DEFAULT_AVATAR = "/api/assets/default-avatar.svg";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [image, setImage] = useState(user?.image || DEFAULT_AVATAR);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (name.trim().length < 2) err.name = "Name must be at least 2 characters.";
    if (bio.length > 500) err.bio = "Bio can be at most 500 characters.";
    if (!image.trim()) err.image = "Please upload or paste a profile image.";
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    try {
      const res = await api<{ user: User }>("/users/profile", {
        method: "PATCH",
        body: { name: name.trim(), phone: phone.trim(), bio: bio.trim(), image: image.trim() },
      });
      setUser(res.user);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title="Update Profile" subtitle="Keep your details fresh so tutors and students can trust you." />

      <form onSubmit={save} noValidate className="card space-y-6 p-6 sm:p-8">
        <ImageUpload label="Profile picture" value={image} onChange={setImage} maxDim={600} round defaultOption={DEFAULT_AVATAR} />
        {errors.image ? <p className="field-error">{errors.image}</p> : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="p-name">Full name</label>
            <input id="p-name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name ? <p className="field-error">{errors.name}</p> : null}
          </div>
          <div>
            <label className="label" htmlFor="p-phone">Phone</label>
            <input id="p-phone" className="input" placeholder="01XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="p-email">Email</label>
            <input id="p-email" className="input" value={user.email} disabled readOnly />
          </div>
          <div>
            <span className="label">Account</span>
            <div className="flex h-[2.7rem] items-center gap-2">
              <Badge value={user.role} />
              <Badge value={user.plan} label={user.plan === "pro" ? "Pro plan" : "Free plan"} />
              {user.createdAt ? <span className="text-xs text-muted">Since {formatDate(user.createdAt)}</span> : null}
            </div>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="p-bio">Bio</label>
          <textarea id="p-bio" rows={4} className="input" placeholder="Tell others a little about yourself" value={bio} onChange={(e) => setBio(e.target.value)} />
          <p className="mt-1 text-right text-xs text-muted">{bio.length}/500</p>
          {errors.bio ? <p className="field-error">{errors.bio}</p> : null}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
            {busy ? <Spinner size={16} /> : null} Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
