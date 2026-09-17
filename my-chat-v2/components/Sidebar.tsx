"use client";

import type { Conversation } from "@/lib/types";

type Props = {
  conversations: Conversation[];
  activeId: string;
  dark: boolean;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleTheme: () => void;
};

export default function Sidebar({
  conversations, activeId, dark, onNew, onSelect, onDelete, onToggleTheme
}: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand"><div className="brand-icon">✦</div><span>My AI</span></div>
        <button className="new-chat" onClick={onNew}><span>＋</span>Nouvelle discussion</button>
      </div>

      <div className="history">
        <div className="history-label">Discussions</div>
        {conversations.map((conversation) => (
          <div key={conversation.id} className={`conversation ${conversation.id === activeId ? "active" : ""}`}>
            <button className="conversation-main" onClick={() => onSelect(conversation.id)}>
              <span className="conversation-icon">◇</span>
              <span className="conversation-title">{conversation.title}</span>
            </button>
            <button className="delete-button" onClick={() => onDelete(conversation.id)} aria-label="Supprimer">×</button>
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <button className="sidebar-action" onClick={onToggleTheme}>
          <span>{dark ? "☀" : "☾"}</span>{dark ? "Mode clair" : "Mode sombre"}
        </button>
        <div className="account">
          <div className="avatar">U</div>
          <div><strong>Utilisateur</strong><small>Mon assistant IA</small></div>
        </div>
      </div>
    </aside>
  );
}