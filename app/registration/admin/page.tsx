"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navigation/Navbar";
import FooterDeck from "@/components/sections/FooterDeck";
import Preloader from "@/components/preloader/Preloader";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut, UserPlus, FileText, Trash2, Download } from "lucide-react";
import * as XLSX from "xlsx";

interface Account {
  id: string;
  username: string;
  created_at: string;
}

interface Participant {
  name: string;
  number: string;
  class: string;
}

interface Registration {
  id: string;
  event_title: string;
  participants: Participant[];
  created_at: string;
}

export default function AdminPanelPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"create" | "view" | "delete">("create");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedRegistrations, setSelectedRegistrations] = useState<Registration[]>([]);
  
  // Create Account State
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // General States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Check auth and load accounts
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/admin/member-accounts");
      if (res.status === 401) {
        router.push("/registration");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setAccounts(data.accounts || []);
      } else {
        setError(data.error || "Failed to load member accounts");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.dispatchEvent(new Event("session-change"));
      router.push("/registration");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    setIsCreating(true);

    try {
      const res = await fetch("/api/admin/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.error || "Failed to create account");
      } else {
        setCreateSuccess(`Account for "${newUsername}" created successfully!`);
        setNewUsername("");
        setNewPassword("");
        fetchAccounts(); // refresh list
      }
    } catch (err) {
      console.error(err);
      setCreateError("An error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAccount = async (accountId: string, username: string) => {
    const confirm = window.confirm(
      `WARNING: Are you sure you want to delete the account "${username}"?\n\nThis will permanently delete the account AND ALL event registrations made by this school.`
    );
    if (!confirm) return;

    try {
      const res = await fetch("/api/admin/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete account");
      } else {
        alert("Account and registrations deleted successfully.");
        if (selectedAccount?.id === accountId) {
          setSelectedAccount(null);
          setSelectedRegistrations([]);
        }
        fetchAccounts();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const handleSelectAccount = async (account: Account) => {
    setSelectedAccount(account);
    setSelectedRegistrations([]);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations?memberId=${account.id}`);
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to load registrations");
      } else {
        const data = await res.json();
        setSelectedRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred loading registrations");
    } finally {
      setIsLoading(false);
    }
  };

  // Export registrations of respective school to native Excel .xlsx file
  const handleExportExcel = (schoolName: string, registrations: Registration[]) => {
    if (registrations.length === 0) {
      alert("No registrations available to export.");
      return;
    }

    const rows: any[] = [];

    registrations.forEach((reg) => {
      rows.push([`EVENT NAME: ${reg.event_title.toUpperCase()}`]);
      rows.push(["PARTICIPANT NAME", "PARTICIPANT NUMBER", "CLASS"]);
      reg.participants.forEach((p) => {
        rows.push([
          p.name.toUpperCase(),
          p.number,
          p.class.toUpperCase()
        ]);
      });
      rows.push([]); // blank separator
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    
    // Autowidth columns
    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 25 },
      { wch: 15 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, `${schoolName}_registrations.xlsx`);
  };

  if (isLoading && accounts.length === 0) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-slate-400 font-mono-custom">
        LOADING ADMIN INTERFACE...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full select-none overflow-x-hidden text-slate-100 bg-black">
      <Preloader />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Admin Layout */}
        <div className="flex-grow pt-32 pb-24 px-6 max-w-5xl mx-auto w-full flex flex-col">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-800 pb-6 mb-8 gap-4">
            <div>
              <h1 className="font-orbitron text-2xl md:text-3xl font-black tracking-widest uppercase text-slate-100">
                ADMIN PANEL
              </h1>
              <p className="font-mono-custom text-xs text-cyan-400 mt-1 uppercase">
                logged in as: X-Uberance&apos;26_CORE
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-800 hover:border-red-500/50 hover:bg-red-950/10 text-slate-300 hover:text-red-400 font-orbitron font-bold text-xs tracking-widest transition-all duration-300 cursor-pointer"
            >
              <LogOut size={13} />
              LOGOUT
            </button>
          </div>

          {/* Three Buttons - Action Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border font-orbitron font-extrabold text-xs tracking-widest transition-all duration-300 cursor-pointer ${
                activeTab === "create"
                  ? "bg-cyan-400 border-cyan-450 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.25)]"
                  : "bg-zinc-950 border-zinc-800 text-slate-400 hover:border-zinc-700 hover:text-white"
              }`}
            >
              <UserPlus size={16} />
              CREATE ACCOUNT
            </button>

            <button
              onClick={() => {
                setActiveTab("view");
                setSelectedAccount(null);
                setSelectedRegistrations([]);
              }}
              className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border font-orbitron font-extrabold text-xs tracking-widest transition-all duration-300 cursor-pointer ${
                activeTab === "view"
                  ? "bg-cyan-400 border-cyan-450 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.25)]"
                  : "bg-zinc-950 border-zinc-800 text-slate-400 hover:border-zinc-700 hover:text-white"
              }`}
            >
              <FileText size={16} />
              VIEW REGISTRATIONS
            </button>

            <button
              onClick={() => setActiveTab("delete")}
              className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border font-orbitron font-extrabold text-xs tracking-widest transition-all duration-300 cursor-pointer ${
                activeTab === "delete"
                  ? "bg-cyan-400 border-cyan-450 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.25)]"
                  : "bg-zinc-950 border-zinc-800 text-slate-400 hover:border-zinc-700 hover:text-white"
              }`}
            >
              <Trash2 size={16} />
              DELETE ACCOUNT
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/25 bg-red-950/20 text-red-400 text-sm font-mono-custom text-center">
              {error}
            </div>
          )}

          {/* Tab Contents */}
          <div className="flex-grow bg-zinc-950/50 border border-zinc-900 rounded-3xl p-6 md:p-8">
            <AnimatePresence mode="wait">
              {activeTab === "create" && (
                <motion.div
                  key="create-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-md mx-auto py-4"
                >
                  <h2 className="font-orbitron text-lg md:text-xl font-bold text-center tracking-widest mb-6">
                    NEW MEMBER ACCOUNT
                  </h2>

                  {createError && (
                    <div className="mb-4 p-4 rounded-xl border border-red-500/25 bg-red-950/20 text-red-400 text-xs md:text-sm font-mono-custom text-center">
                      ⚠️ {createError}
                    </div>
                  )}

                  {createSuccess && (
                    <div className="mb-4 p-4 rounded-xl border border-emerald-500/25 bg-emerald-950/20 text-emerald-400 text-xs md:text-sm font-mono-custom text-center">
                      ✓ {createSuccess}
                    </div>
                  )}

                  <form onSubmit={handleCreateAccount} className="space-y-6">
                    <div className="flex flex-col space-y-2">
                      <label className="font-orbitron text-xs font-bold text-white/70 tracking-widest uppercase">
                        Username (e.g. sxcs, mhs)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ENTER USERNAME..."
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="bg-black border border-zinc-800 focus:border-cyan-400 focus:outline-none px-4 py-3 rounded-xl w-full text-slate-100 font-mono-custom text-sm"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="font-orbitron text-xs font-bold text-white/70 tracking-widest uppercase">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="ENTER PASSWORD..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-black border border-zinc-800 focus:border-cyan-400 focus:outline-none px-4 py-3 rounded-xl w-full text-slate-100 font-mono-custom text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isCreating}
                      className="w-full mt-6 py-3 rounded-xl bg-cyan-400 text-slate-950 hover:bg-white font-orbitron font-bold tracking-widest text-xs transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      {isCreating ? "CREATING..." : "CREATE ACCOUNT"}
                    </button>
                  </form>
                </motion.div>
              )}

              {activeTab === "view" && (
                <motion.div
                  key="view-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="font-orbitron text-lg md:text-xl font-bold tracking-widest mb-4">
                      VIEW MEMBER REGISTRATIONS
                    </h2>
                    <p className="font-mono-custom text-xs text-zinc-500 uppercase">
                      Select a school account to view and export registrations
                    </p>
                  </div>

                  {/* Member Buttons */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    {accounts.length === 0 ? (
                      <p className="text-zinc-650 font-mono-custom text-xs uppercase py-4">
                        No member accounts found. Create one to get started.
                      </p>
                    ) : (
                      accounts.map((acc) => (
                        <button
                          key={acc.id}
                          onClick={() => handleSelectAccount(acc)}
                          className={`px-5 py-2.5 rounded-full border font-orbitron font-bold text-xs tracking-wider transition-all duration-300 cursor-pointer ${
                            selectedAccount?.id === acc.id
                              ? "bg-cyan-400 border-cyan-450 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                              : "bg-black border-zinc-800 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400"
                          }`}
                        >
                          {acc.username}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Registrations List */}
                  {selectedAccount && (
                    <div className="border-t border-zinc-900 pt-8 mt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                          <h3 className="font-orbitron text-base md:text-lg font-black tracking-widest text-cyan-400 uppercase">
                            SCHOOL: {selectedAccount.username}
                          </h3>
                          <p className="font-mono-custom text-xs text-zinc-500 uppercase mt-0.5">
                            Total Registered Events: {selectedRegistrations.length}
                          </p>
                        </div>

                        <button
                          onClick={() => handleExportExcel(selectedAccount.username, selectedRegistrations)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-white text-slate-950 font-orbitron font-bold text-xs tracking-widest transition-all duration-300 cursor-pointer"
                        >
                          <Download size={13} />
                          EXPORT TO EXCEL
                        </button>
                      </div>

                      {/* Display in specific format */}
                      <div className="bg-black border border-zinc-900 rounded-2xl p-6 font-mono-custom text-xs md:text-sm text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto space-y-6">
                        {selectedRegistrations.length === 0 ? (
                          <p className="text-zinc-600 uppercase text-center py-8">
                            No registrations recorded for this school.
                          </p>
                        ) : (
                          selectedRegistrations.map((reg) => (
                            <div key={reg.id} className="border-b border-zinc-900/60 pb-6 last:border-b-0 last:pb-0">
                              <span className="text-cyan-400 font-extrabold uppercase tracking-wider block mb-2">
                                EVENT NAME: {reg.event_title}
                              </span>
                              <div className="space-y-1 pl-4 border-l-2 border-zinc-800">
                                {reg.participants.map((p, idx) => (
                                  <div key={idx}>
                                    {p.name.toUpperCase()} {p.number} {p.class.toUpperCase()}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "delete" && (
                <motion.div
                  key="delete-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="font-orbitron text-lg md:text-xl font-bold tracking-widest mb-2">
                      DELETE MEMBER ACCOUNTS
                    </h2>
                    <p className="font-mono-custom text-xs text-zinc-500 uppercase">
                      Deleting an account permanently removes all its registered event entries
                    </p>
                  </div>

                  <div className="max-w-lg mx-auto divide-y divide-zinc-900">
                    {accounts.length === 0 ? (
                      <p className="text-zinc-650 font-mono-custom text-xs uppercase text-center py-6">
                        No member accounts found.
                      </p>
                    ) : (
                      accounts.map((acc) => (
                        <div key={acc.id} className="flex items-center justify-between py-4">
                          <div>
                            <span className="font-orbitron text-sm font-bold text-slate-200">
                              {acc.username}
                            </span>
                            <span className="block font-mono-custom text-[10px] text-zinc-500 uppercase mt-0.5">
                              Created: {new Date(acc.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteAccount(acc.id, acc.username)}
                            className="p-2 rounded-lg border border-zinc-900 hover:border-red-500/50 hover:bg-red-950/10 text-zinc-500 hover:text-red-400 transition-all duration-300 cursor-pointer"
                            title="Delete Account & Registrations"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <FooterDeck />
      </div>
    </main>
  );
}
