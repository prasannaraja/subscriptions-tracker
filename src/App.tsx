import { useState, useEffect, useMemo, useRef } from "react";
import type { Subscription, ToastMessage, Preset, SubscriptionForm } from "./types";
import { EMPTY_FORM } from "./constants";
import { generateId, toMonthly, getNextBillingDate, loadSubs, saveSubs, formatCurrency } from "./utils";
import { Dashboard } from "./components/Dashboard";
import { ListView } from "./components/ListView";
import { AddEditView } from "./components/AddEditView";
import { styles } from "./styles/theme";

export default function App() {
  const [subs, setSubs] = useState<Subscription[]>(loadSubs);
  const [view, setView] = useState("dashboard"); // dashboard | list | add | edit
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<SubscriptionForm>(EMPTY_FORM);
  const [filterCat, setFilterCat] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [searchQ, setSearchQ] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => { saveSubs(subs); }, [subs]);

  function showToast(msg: string, type: ToastMessage["type"] = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  function openAdd(preset: Preset | null = null) {
    if (preset) {
      setForm({ ...EMPTY_FORM, name: preset.name, category: preset.category, color: preset.color, icon: preset.icon });
    } else {
      setForm(EMPTY_FORM);
    }
    setEditId(null);
    setView("add");
  }

  function openEdit(sub: Subscription) {
    setForm({ ...sub });
    setEditId(sub.id);
    setView("add");
  }

  function handleSave() {
    if (!form.name?.trim() || !form.amount || isNaN(parseFloat(String(form.amount)))) {
      showToast("Please fill name and a valid amount.", "error");
      return;
    }
    if (editId) {
      setSubs(s => s.map(x => x.id === editId ? { ...(form as Subscription), id: editId } : x));
      showToast(`${form.name} updated!`);
    } else {
      setSubs(s => [...s, { ...(form as Subscription), id: generateId(), amount: parseFloat(String(form.amount)) }]);
      showToast(`${form.name} added!`);
    }
    setView("list");
  }

  function handleDelete(id: string) {
    const sub = subs.find(s => s.id === id);
    setSubs(s => s.filter(x => x.id !== id));
    showToast(`${sub?.name} removed.`, "info");
  }

  function toggleActive(id: string) {
    setSubs(s => s.map(x => x.id === id ? { ...x, active: !x.active } : x));
  }

  function toggleMonth(id: string, monthKey: string) {
    setSubs(s => s.map(x => {
      if (x.id !== id) return x;
      const isCurrentlyTracked = x.history?.[monthKey] ?? false;
      return { ...x, history: { ...x.history, [monthKey]: !isCurrentlyTracked } };
    }));
  }

  const activeSubs = useMemo(() => subs.filter(s => s.active), [subs]);

  const monthlyTotal = useMemo(() =>
    activeSubs.reduce((sum, s) => sum + toMonthly(parseFloat(String(s.amount)) || 0, s.cycle), 0),
    [activeSubs]
  );

  const yearlyTotal = monthlyTotal * 12;

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    activeSubs.forEach(s => {
      if (!map[s.category]) map[s.category] = 0;
      map[s.category] += toMonthly(parseFloat(String(s.amount)) || 0, s.cycle);
    });
    return map;
  }, [activeSubs]);

  const upcoming = useMemo(() =>
    activeSubs
      .map(s => ({ ...s, nextDate: getNextBillingDate(s.startDate, s.cycle) }))
      .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())
      .slice(0, 5),
    [activeSubs]
  );

  const baseCurrency = activeSubs[0]?.currency || "USD";

  const filteredSubs = useMemo(() => {
    let list = showInactive ? subs : activeSubs;
    if (filterCat !== "all") list = list.filter(s => s.category === filterCat);
    if (searchQ) list = list.filter(s => s.name.toLowerCase().includes(searchQ.toLowerCase()));
    list = [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "amount") return toMonthly(parseFloat(String(b.amount)) || 0, b.cycle) - toMonthly(parseFloat(String(a.amount)) || 0, a.cycle);
      if (sortBy === "next") return new Date(getNextBillingDate(a.startDate, a.cycle)).getTime() - new Date(getNextBillingDate(b.startDate, b.cycle)).getTime();
      return 0;
    });
    return list;
  }, [subs, activeSubs, filterCat, searchQ, sortBy, showInactive]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function exportData() {
    const dataStr = JSON.stringify(subs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", url);
    linkElement.setAttribute("download", "subscriptions.json");
    linkElement.click();
    
    URL.revokeObjectURL(url);
    showToast("Data exported successfully!");
  }

  function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          setSubs(parsed);
          showToast("Data imported successfully!");
        } else {
          showToast("Invalid data format.", "error");
        }
      } catch {
        showToast("Error reading file.", "error");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="layout-root" style={styles.root}>
      {/* Sidebar */}
      <nav className="layout-sidebar" style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>Subscriptions</span>
        </div>
        <div className="nav-items">
          {[
            { id: "dashboard", label: "Dashboard", icon: "⊞" },
            { id: "list", label: "Subscriptions", icon: "≡" },
          ].map(item => (
            <button
              key={item.id}
              style={{ ...styles.navBtn, ...(view === item.id || (view === "add" && item.id === "list") ? styles.navBtnActive : {}) }}
              onClick={() => setView(item.id)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        <button style={styles.addBtn} onClick={() => openAdd()}>
          <span style={{ fontSize: 18, marginRight: 6 }}>+</span> Add Subscription
        </button>
        <div className="sidebar-footer" style={styles.sidebarFooter}>
          <div style={styles.footerStat}>
            <span style={styles.footerLabel}>Monthly</span>
            <span style={styles.footerValue}>{formatCurrency(monthlyTotal, baseCurrency)}</span>
          </div>
          <div style={styles.footerStat}>
            <span style={styles.footerLabel}>Yearly</span>
            <span style={styles.footerValue}>{formatCurrency(yearlyTotal, baseCurrency)}</span>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1E293B", display: "flex", gap: 8 }}>
            <button style={{ ...styles.ghostBtn, flex: 1, padding: "8px 0" }} onClick={exportData}>Export</button>
            <button style={{ ...styles.ghostBtn, flex: 1, padding: "8px 0" }} onClick={() => fileInputRef.current?.click()}>Import</button>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} accept=".json" onChange={handleImport} />
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={styles.main}>
        {toast && (
          <div style={{ ...styles.toast, background: toast.type === "error" ? "#EF4444" : toast.type === "info" ? "#64748B" : "#10B981" }}>
            {toast.msg}
          </div>
        )}

        {view === "dashboard" && (
          <Dashboard
            subs={subs}
            activeSubs={activeSubs}
            monthlyTotal={monthlyTotal}
            yearlyTotal={yearlyTotal}
            byCategory={byCategory}
            upcoming={upcoming}
            openAdd={openAdd}
            openEdit={openEdit}
            baseCurrency={baseCurrency}
          />
        )}

        {view === "list" && (
          <ListView
            filteredSubs={filteredSubs}
            filterCat={filterCat} setFilterCat={setFilterCat}
            sortBy={sortBy} setSortBy={setSortBy}
            searchQ={searchQ} setSearchQ={setSearchQ}
            showInactive={showInactive} setShowInactive={setShowInactive}
            openAdd={openAdd}
            openEdit={openEdit}
            handleDelete={handleDelete}
            toggleActive={toggleActive}
            toggleMonth={toggleMonth}
          />
        )}

        {view === "add" && (
          <AddEditView
            form={form} setForm={setForm}
            editId={editId}
            handleSave={handleSave}
            onCancel={() => setView("list")}
          />
        )}
      </main>
    </div>
  );
}
