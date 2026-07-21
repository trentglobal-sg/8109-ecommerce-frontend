import { useState, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { Link } from "wouter";
import { useJWT } from "./UserStore";
import { useFlashMessage } from "./FlashMessageStore";
import { useCart } from "./CartStore";
import { createSession, sendChatMessage } from "./chatbotApi";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const { jwt } = useJWT();
  const { showMessage } = useFlashMessage();
  const { fetchCart } = useCart();

  useEffect(() => {
    let mounted = true;
    createSession(jwt).then((id) => {
      if (mounted) setSessionId(id);
    });
    return () => {
      mounted = false;
    };
  }, [jwt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !sessionId) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      type: "text",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      for await (const chunk of sendChatMessage(sessionId, userMessage, jwt)) {
        setMessages((prev) => mergeChunk(prev, chunk));
        if (chunk.type === "cart_update" && jwt) {
          fetchCart();
        }
      }
    } catch (error) {
      showMessage("Chat error: " + error.message, "danger");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container my-4">
      <h2 className="mb-3">Chat with us</h2>
      <div className="card">
        <div
          className="card-body"
          style={{ height: "400px", overflowY: "auto" }}
        >
          {messages.length === 0 && (
            <p className="text-muted">
              Type something and press send. Try &quot;chart&quot;, &quot;products&quot;, or &quot;cart&quot;.
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex mb-3 ${
                msg.role === "user" ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  msg.role === "user"
                    ? "bg-primary text-white"
                    : "bg-light border"
                }`}
                style={{ maxWidth: "80%" }}
              >
                {renderMessage(msg)}
              </div>
            </div>
          ))}
          {isLoading && (
            <p className="text-muted small">Assistant is typing...</p>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="card-footer">
          <form onSubmit={handleSend} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function mergeChunk(messages, chunk) {
  const existingIndex = messages.findIndex((m) => m.id === chunk.id);
  if (existingIndex === -1) {
    return [...messages, chunk];
  }

  const existing = messages[existingIndex];
  const merged = {
    ...existing,
    ...chunk,
    content:
      typeof chunk.content === "string" && typeof existing.content === "string"
        ? existing.content + chunk.content
        : chunk.content,
  };

  return [
    ...messages.slice(0, existingIndex),
    merged,
    ...messages.slice(existingIndex + 1),
  ];
}

function renderMessage(msg) {
  switch (msg.type) {
    case "text":
      return <span>{msg.content}</span>;

    case "thinking":
      return (
        <div className="text-muted small fst-italic">
          <span className="me-1">🤔</span>
          {msg.content}
        </div>
      );

    case "planning":
      return (
        <ol className="mb-0 ps-3">
          {(msg.content || []).map((step) => (
            <li
              key={step.step}
              className={step.status === "failed" ? "text-danger" : ""}
            >
              {step.description}{" "}
              <span className="badge bg-secondary">{step.status}</span>
            </li>
          ))}
        </ol>
      );

    case "tool_call":
      return (
        <div className="small text-muted">
          <strong>Tool call:</strong> {msg.toolCall?.name}(
          {JSON.stringify(msg.toolCall?.arguments)})
        </div>
      );

    case "tool_output":
      return (
        <div className="small text-muted">
          <strong>Tool result:</strong>
          <pre className="mb-0" style={{ fontSize: "0.75rem" }}>
            {JSON.stringify(msg.toolOutput?.result, null, 2)}
          </pre>
        </div>
      );

    case "chart":
      return msg.content ? (
        <Chart
          options={msg.content.options}
          series={msg.content.series}
          type={msg.content.options?.chart?.type || "line"}
          width={400}
          height={300}
        />
      ) : null;

    case "products":
      return (
        <div>
          <p className="fw-bold mb-2">
            {msg.content?.heading || "Products"}
          </p>
          <div className="row g-2">
            {(msg.content?.products || []).map((product) => (
              <div key={product.id} className="col-12">
                <div className="d-flex align-items-center border rounded p-2">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: "60px", height: "45px", objectFit: "cover" }}
                    className="rounded me-2"
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{product.name}</div>
                    <div className="small text-muted">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <Link href="/cart" className="btn btn-sm btn-primary">
                    View Cart
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "cart_update":
      return (
        <div>
          <div>{msg.content?.message}</div>
          <Link href="/cart" className="btn btn-sm btn-primary mt-2">
            Go to Cart
          </Link>
        </div>
      );

    case "error":
      return (
        <div className="text-danger">
          <strong>Error:</strong>{" "}
          {typeof msg.content === "string"
            ? msg.content
            : msg.content?.message}
        </div>
      );

    default:
      return <span>{JSON.stringify(msg.content)}</span>;
  }
}
