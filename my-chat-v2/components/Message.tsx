"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message as MessageType } from "@/lib/types";

export default function Message({ message }: { message: MessageType }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  async function copy() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={`message-row ${isUser ? "user-row" : "assistant-row"}`}>
      <div className={`message-avatar ${isUser ? "user-avatar" : "ai-avatar"}`}>
        {isUser ? "U" : "✦"}
      </div>
      <div className="message-content">
        <div className="message-author">{isUser ? "Vous" : "My AI"}</div>
        <div className="markdown">
          {isUser ? <p>{message.content}</p> : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const inline = !className;
                  return inline ? (
                    <code className="inline-code" {...props}>{children}</code>
                  ) : (
                    <div className="code-block">
                      <div className="code-header"><span>code</span>
                        <button onClick={() => navigator.clipboard.writeText(String(children))}>Copier</button>
                      </div>
                      <pre><code className={className} {...props}>{children}</code></pre>
                    </div>
                  );
                }
              }}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        {!isUser && <button className="copy-message" onClick={copy}>{copied ? "✓ Copié" : "Copier"}</button>}
      </div>
    </div>
  );
}