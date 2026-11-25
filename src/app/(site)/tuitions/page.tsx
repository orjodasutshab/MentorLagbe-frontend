"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import TuitionCard from "@/components/TuitionCard";
import { EmptyState, ErrorBox, Pagination, TuitionCardSkeleton } from "@/components/ui";
import { CLASS_LEVELS, SUBJECTS } from "@/lib/format";
import { useApi } from "@/lib/hooks";
import type { TuitionList } from "@/lib/types";

interface Filters {
  search: string;
  subject: string;
  classLevel: string;
  mode: string;
  sort: string;
}

const EMPTY: Filters = { search: "", subject: "", classLevel: "", mode: "", sort: "latest" };

export default function TuitionsPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [ready, setReady] = useState(false);

  // Read initial filters from the URL (e.g. coming from the home page search).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const initial: Filters = {
      search: p.get("search") || "",
      subject: p.get("subject") || "",
      classLevel: p.get("classLevel") || "",
      mode: p.get("mode") || "",
      sort: p.get("sort") || "latest",
    };
    setFilters(initial);
    setSearchInput(initial.search);
    setReady(true);
  }, []);

  // Debounced server-side search.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      const next = searchInput.trim();
      setFilters((f) => (f.search === next ? f : { ...f, search: next }));
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, ready]);

  const qs = new URLSearchParams();
  if (filters.search) qs.set("search", filters.search);
  if (filters.subject) qs.set("subject", filters.subject);
  if (filters.classLevel) qs.set("classLevel", filters.classLevel);
  if (filters.mode) qs.set("mode", filters.mode);
  qs.set("sort", filters.sort);
  qs.set("page", String(page));
  qs.set("limit", "9");

  const { data, loading, error, reload } = useApi<TuitionList>(ready ? `/tuitions?${qs.toString()}` : null);

  function setFilter(key: keyof Filters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  }

  function clearAll() {
    setFilters(EMPTY);
    setSearchInput("");
    setPage(1);
  }

  function goToPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const hasFilters = Boolean(filters.search || filters.subject || filters.classLevel || filters.mode || filters.sort !== "latest");

  return (
    <div className="container-x py-12">
      <div className="mb-8">
        <span className="eyebrow">Browse</span>
        <h1 className="h-section">Browse Tuitions</h1>
        <p className="sub-section">Search and filter admin-approved tuition batches and mentorship sessions.</p>
      </div>

      <div className="card mb-8 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative sm:col-span-2">
          <Icon name="search" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input"
            style={{ paddingLeft: "2.5rem" }}
            placeholder="Search by title or subject"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search tuitions"
          />
        </div>
        <select className="input" value={filters.subject} onChange={(e) => setFilter("subject", e.target.value)} aria-label="Filter by subject">
          <option value="">All subjects</option>
          {SUBJECTS.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
        <select className="input" value={filters.classLevel} onChange={(e) => setFilter("classLevel", e.target.value)} aria-label="Filter by class level">
          <option value="">All class levels</option>
          {CLASS_LEVELS.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
        <select className="input" value={filters.mode} onChange={(e) => setFilter("mode", e.target.value)} aria-label="Filter by mode">
          <option value="">Online &amp; Offline</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
        <select className="input" value={filters.sort} onChange={(e) => setFilter("sort", e.target.value)} aria-label="Sort tuitions">
          <option value="latest">Newest first</option>
          <option value="fee_asc">Fee: low to high</option>
          <option value="fee_desc">Fee: high to low</option>
        </select>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3 text-sm text-muted">
        <p>
          {loading || !data ? "Loading tuitions..." : (<><span className="font-bold text-foreground">{data.total}</span> tuition{data.total === 1 ? "" : "s"} found</>)}
        </p>
        {hasFilters ? (
          <button className="btn btn-ghost btn-sm" onClick={clearAll}>
            <Icon name="close" size={14} /> Clear filters
          </button>
        ) : null}
      </div>

      {error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (<TuitionCardSkeleton key={i} />))}
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((t) => (<TuitionCard key={t._id} tuition={t} />))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={goToPage} />
        </>
      ) : (
        <div className="card">
          <EmptyState
            title="No tuitions match your search"
            text="Try a different keyword or remove some filters."
            action={<button className="btn btn-primary" onClick={clearAll}>Reset filters</button>}
          />
        </div>
      )}
    </div>
  );
}
