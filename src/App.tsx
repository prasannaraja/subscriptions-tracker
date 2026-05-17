import { useEffect, useRef, useState } from "react";
import type { Subscription, ToastMessage, Preset, SubscriptionForm, Loan, LoanForm } from "./types";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { EMPTY_FORM } from "./constants";
import { setFilterCat, setSearchQ, setShowInactive, setSortBy } from "./features/filters/filtersSlice";
import {
  addSubscription,
  deleteSubscription,
  importSubscriptions,
  toggleActive,
  toggleMonth,
  updateSubscription,
} from "./features/subscriptions/subscriptionsSlice";
import {
  selectActiveSubscriptions,
  selectBaseCurrency,
  selectFilteredSubscriptions,
  selectMonthlyTotal,
  selectSubscriptions,
  selectSubscriptionsByCategory,
  selectUpcomingRenewals,
  selectYearlyTotal,
} from "./features/subscriptions/subscriptionsSelectors";
import { saveSubscriptions } from "./features/subscriptions/subscriptionsPersistence";
import { normalizeSubscriptions } from "./features/subscriptions/subscriptionsValidation";
import { addLoan, deleteLoan, updateLoan, toggleLoanMonth, setCommitted, closeLoan } from "./features/loans/loansSlice";
import { selectLoans, selectCommittedLoans, selectOtherCommitmentsByCurrency } from "./features/loans/loansSelectors";
import { saveLoans } from "./features/loans/loansPersistence";
import { setBaseCurrency } from "./features/settings/settingsSlice";
import { saveSettings } from "./features/settings/settingsPersistence";
import { clearToast, showToast as showToastAction } from "./features/toast/toastSlice";
import seedSubscriptions from "./features/subscriptions/seedSubscriptions.json";
import { formatCurrency } from "./utils";
import { Dashboard } from "./components/Dashboard";
import { ListView } from "./components/ListView";
import { AddEditView } from "./components/AddEditView";
import { LoansView } from "./components/LoansView";
import { AddEditLoanView } from "./components/AddEditLoanView";
import { SettingsView } from "./components/SettingsView";
import { styles } from "./styles/theme";

export default function App() {
  const dispatch = useAppDispatch();
  const subs = useAppSelector(selectSubscriptions);
  const activeSubs = useAppSelector(selectActiveSubscriptions);
  const monthlyTotal = useAppSelector(selectMonthlyTotal);
  const yearlyTotal = useAppSelector(selectYearlyTotal);
  const byCategory = useAppSelector(selectSubscriptionsByCategory);
  const upcoming = useAppSelector(selectUpcomingRenewals);
  const baseCurrency = useAppSelector(selectBaseCurrency);
  const filteredSubs = useAppSelector(selectFilteredSubscriptions);
  const { filterCat, searchQ, showInactive, sortBy } = useAppSelector((state) => state.filters);
  const toast = useAppSelector((state) => state.toast);
  const loans = useAppSelector(selectLoans);
  const committedLoans = useAppSelector(selectCommittedLoans);
  const otherCommitmentsByCurrency = useAppSelector(selectOtherCommitmentsByCurrency);

  const [view, setView] = useState("dashboard"); // dashboard | list | add | loans | addloan | settings
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<SubscriptionForm>(EMPTY_FORM);

  const EMPTY_LOAN_FORM: LoanForm = {
    name: "", totalAmount: 0, currency: baseCurrency,
    receivedDate: new Date().toISOString().split("T")[0],
    notes: "", color: "#FB923C", icon: "◎",
    committed: false, planMonths: 12, history: {}, closed: false,
  };
  const [loanEditId, setLoanEditId] = useState<string | null>(null);
  const [loanForm, setLoanForm] = useState<LoanForm>(EMPTY_LOAN_FORM);

  useEffect(() => { saveSubscriptions(subs); }, [subs]);
  useEffect(() => { saveLoans(loans); }, [loans]);
  useEffect(() => { saveSettings({ baseCurrency }); }, [baseCurrency]);

  function showToast(msg: string, type: ToastMessage["type"] = "success") {
    dispatch(showToastAction({ msg, type }));
    setTimeout(() => dispatch(clearToast()), 2800);
  }

  function openAdd(preset: Preset | null = null) {
    if (preset) {
      setForm({ ...EMPTY_FORM, currency: baseCurrency, name: preset.name, category: preset.category, color: preset.color, icon: preset.icon });
    } else {
      setForm({ ...EMPTY_FORM, currency: baseCurrency });
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
      dispatch(updateSubscription({ id: editId, form }));
      showToast(`${form.name} updated!`);
    } else {
      dispatch(addSubscription(form));
      showToast(`${form.name} added!`);
    }
    setView("list");
  }

  function handleDelete(id: string) {
    const sub = subs.find(s => s.id === id);
    dispatch(deleteSubscription(id));
    showToast(`${sub?.name} removed.`, "info");
  }

  function openAddLoan() {
    setLoanForm({ ...EMPTY_LOAN_FORM, currency: baseCurrency });
    setLoanEditId(null);
    setView("addloan");
  }

  function openEditLoan(loan: Loan) {
    setLoanForm({ ...loan });
    setLoanEditId(loan.id);
    setView("addloan");
  }

  function handleSaveLoan() {
    if (!loanForm.name?.trim() || !loanForm.totalAmount || parseFloat(String(loanForm.totalAmount)) <= 0) {
      showToast("Please fill name and a valid amount.", "error");
      return;
    }
    if (loanEditId) {
      dispatch(updateLoan({ id: loanEditId, form: loanForm }));
      showToast(`${loanForm.name} updated!`);
    } else {
      dispatch(addLoan(loanForm));
      showToast(`${loanForm.name} added!`);
    }
    setView("loans");
  }

  function handleDeleteLoan(id: string) {
    const loan = loans.find((l) => l.id === id);
    dispatch(deleteLoan(id));
    showToast(`${loan?.name} removed.`, "info");
  }

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
        const subscriptions = normalizeSubscriptions(parsed);
        if (subscriptions) {
          dispatch(importSubscriptions(subscriptions));
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

  function resetToSeedData() {
    if (!window.confirm("Replace current subscriptions with the bundled sample data?")) return;

    const subscriptions = normalizeSubscriptions(seedSubscriptions);
    if (!subscriptions) {
      showToast("Seed data is invalid.", "error");
      return;
    }

    dispatch(importSubscriptions(subscriptions));
    showToast("Sample data restored.", "info");
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
            { id: "loans", label: "Loans", icon: "⊕" },
            { id: "settings", label: "Settings", icon: "⚙" },
          ].map(item => (
            <button
              key={item.id}
              style={{ ...styles.navBtn, ...(view === item.id || (view === "add" && item.id === "list") || (view === "addloan" && item.id === "loans") ? styles.navBtnActive : {}) }}
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
            committedLoans={committedLoans}
            otherCommitmentsByCurrency={otherCommitmentsByCurrency}
            onOpenLoans={() => setView("loans")}
          />
        )}

        {view === "list" && (
          <ListView
            filteredSubs={filteredSubs}
            filterCat={filterCat} setFilterCat={(value) => dispatch(setFilterCat(value))}
            sortBy={sortBy} setSortBy={(value) => dispatch(setSortBy(value))}
            searchQ={searchQ} setSearchQ={(value) => dispatch(setSearchQ(value))}
            showInactive={showInactive} setShowInactive={(value) => dispatch(setShowInactive(value))}
            openAdd={openAdd}
            openEdit={openEdit}
            handleDelete={handleDelete}
            toggleActive={(id) => dispatch(toggleActive(id))}
            toggleMonth={(id, monthKey) => dispatch(toggleMonth({ id, monthKey }))}
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

        {view === "loans" && (
          <LoansView
            loans={loans}
            openAdd={openAddLoan}
            openEdit={openEditLoan}
            handleDelete={handleDeleteLoan}
            toggleLoanMonth={(id, key) => dispatch(toggleLoanMonth({ id, monthKey: key }))}
            handleStartPlan={(id, planMonths) => dispatch(setCommitted({ id, committed: true, planMonths }))}
            handleClose={(id) => dispatch(closeLoan(id))}
            baseCurrency={baseCurrency}
          />
        )}

        {view === "addloan" && (
          <AddEditLoanView
            form={loanForm}
            setForm={setLoanForm}
            editId={loanEditId}
            handleSave={handleSaveLoan}
            onCancel={() => setView("loans")}
          />
        )}

        {view === "settings" && (
          <SettingsView
            activeCount={activeSubs.length}
            baseCurrency={baseCurrency}
            exportData={exportData}
            importData={() => fileInputRef.current?.click()}
            monthlyTotal={monthlyTotal}
            onBaseCurrencyChange={(c) => dispatch(setBaseCurrency(c))}
            pausedCount={subs.length - activeSubs.length}
            resetToSeedData={resetToSeedData}
            subscriptions={subs}
            yearlyTotal={yearlyTotal}
          />
        )}
      </main>
    </div>
  );
}
