"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import type { Conversation, Message } from "@/lib/types";

const STORAGE_KEY = "my-ai-conversations";

function createConversation(): Conversation {
  return {
    id: crypto.randomUUID(),
    title: "Nouvelle discussion",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState("");
  const [dark, setDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let initial: Conversation | null = null;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          setConversations(parsed);
          setActiveId(parsed[0].id);
        } else {
          initial = createConversation();
        }
      } catch {
        initial = createConversation();
      }
    } else {
      initial = createConversation();
    }

    if (initial) {
      setConversations([initial]);
      setActiveId(initial.id);
    }

    if (localStorage.getItem("my-ai-theme") === "dark") setDark(true);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations, loaded]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    if (loaded) localStorage.setItem("my-ai-theme", dark ? "dark" : "light");
  }, [dark, loaded]);

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? conversations[0];

  function newConversation() {
    const c = createConversation();
    setConversations((current) => [c, ...current]);
    setActiveId(c.id);
  }

  function deleteConversation(id: string) {
    setConversations((current) => {
      const remaining = current.filter((c) => c.id !== id);
      if (!remaining.length) {
        const fresh = createConversation();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(remaining[0].id);
      return remaining;
    });
  }

  function updateMessages(messages: Message[]) {
    if (!activeConversation) return;

    setConversations((current) =>
      current.map((c) => {
        if (c.id !== activeConversation.id) return c;
        let title = c.title;
        if (title === "Nouvelle discussion") {
          const first = messages.find((m) => m.role === "user");
          if (first) title = first.content.replace(/\s+/g, " ").trim().slice(0, 40) || title;
        }
        return { ...c, title, messages, updatedAt: Date.now() };
      })
    );
  }

  if (!loaded || !activeConversation) {
    return <div className="loading-screen">Chargement...</div>;
  }

  return (
    <div className="app-shell">
      <Sidebar
        conversations={conversations}
        activeId={activeConversation.id}
        dark={dark}
        onNew={newConversation}
        onSelect={setActiveId}
        onDelete={deleteConversation}
        onToggleTheme={() => setDark((v) => !v)}
      />
      <main className="main">
        <Chat conversation={activeConversation} onMessagesChange={updateMessages} />
      </main>
    </div>
  );
}