"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Message from "./Message";
import type { Conversation, Message as MessageType } from "@/lib/types";

type Props = { conversation: Conversation; onMessagesChange: (messages: MessageType[]) => void };

export default function Chat({ conversation, onMessagesChange }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gpt-5.6-luna");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages, loading]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: MessageType = { id: crypto.randomUUID(), role: "user", content: text };
    const updatedMessages = [...conversation.messages, userMessage];
    onMessagesChange(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: updatedMessages.map(({ role, content }) => ({ role, content }))
        })
      });

      if (!response.ok) throw new Error(await response.text());
      if (!response.body) throw new Error("La réponse ne contient aucun flux.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      const assistantMessage: MessageType = { id: crypto.randomUUID(), role: "assistant", content: "" };

      onMessagesChange([...updatedMessages, assistantMessage]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        onMessagesChange([...updatedMessages, { ...assistantMessage, content: assistantText }]);
      }
    } catch (error) {
      console.error(error);
      onMessagesChange([...updatedMessages, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Une erreur est survenue. Vérifie ta clé API et la configuration du modèle."
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div><h1>My AI</h1><span>Assistant IA</span></div>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-5.6-luna">GPT-5.6 Luna</option>
          <option value="gpt-5.6-terra">GPT-5.6 Terra</option>
          <option value="gpt-5.6-sol">GPT-5.6 Sol</option>
        </select>
      </header>

      <section className="messages">
        {conversation.messages.length === 0 ? (
          <div className="empty-state">
            <div className="big-logo">✦</div>
            <h2>Comment puis-je t'aider ?</h2>
            <p>Pose-moi une question, demande-moi du code ou lance une idée.</p>
            <div className="suggestions">
              <button onClick={() => setInput("Explique-moi quelque chose de manière simple.")}>Explique-moi quelque chose</button>
              <button onClick={() => setInput("Aide-moi à créer un projet.")}>Aide-moi à créer un projet</button>
              <button onClick={() => setInput("Écris-moi un exemple de code.")}>Écris du code</button>
            </div>
          </div>
        ) : (
          conversation.messages.map((message) => <Message key={message.id} message={message} />)
        )}

        {loading && (
          <div className="message-row assistant-row">
            <div className="message-avatar ai-avatar">✦</div>
            <div className="message-content">
              <div className="message-author">My AI</div>
              <div className="typing"><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </section>

      <form className="composer" onSubmit={sendMessage}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="Écris un message..." rows={1} disabled={loading} />
        <div className="composer-bottom">
          <span>Entrée pour envoyer · Shift + Entrée pour une nouvelle ligne</span>
          <button type="submit" disabled={loading || !input.trim()}>↑</button>
        </div>
      </form>
    </div>
  );
}