import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Create a new chat session on the backend.
 * Falls back to a local session id if the endpoint is unavailable.
 */
export async function createSession(jwt) {
  try {
    const response = await axios.post(
      `${API_URL}/chat/sessions`,
      {},
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    return response.data.sessionId;
  } catch (error) {
    console.warn("Chat sessions endpoint unavailable, using local session id.", error.message);
    return `local-${Date.now()}`;
  }
}

/**
 * Send a user message and yield streamed assistant message chunks.
 *
 * Yields objects like:
 *   { id, parentId, role, type, content, toolCall, toolOutput, done, ... }
 *
 * If the backend is unavailable, a mock fallback is used so the UI still works.
 */
export async function* sendChatMessage(sessionId, message, jwt) {
  try {
    const response = await fetch(`${API_URL}/chat/${sessionId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() || "";

      for (const chunk of chunks) {
        const event = parseSSE(chunk);
        if (event) yield event;
      }
    }

    if (buffer.trim()) {
      const event = parseSSE(buffer);
      if (event) yield event;
    }
  } catch (error) {
    console.warn("Chat API unavailable, using mock fallback:", error.message);
    yield* mockChatStream(sessionId, message);
  }
}

function parseSSE(raw) {
  const lines = raw.split("\n");
  const dataLine = lines.find((line) => line.trimStart().startsWith("data:"));
  if (!dataLine) return null;
  try {
    return JSON.parse(dataLine.trim().slice("data:".length));
  } catch {
    return null;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock fallback that simulates a backend chat response.
 * Useful for local development when the chat backend is not running.
 */
async function* mockChatStream(sessionId, message) {
  const userId = message.id || Date.now();
  const assistantId = `${userId}-assistant`;
  const text = typeof message.content === "string" ? message.content.toLowerCase() : "";

  yield {
    id: `${assistantId}-thinking`,
    parentId: String(userId),
    role: "assistant",
    type: "thinking",
    content: "Thinking about your request...",
    timestamp: new Date().toISOString(),
  };

  await delay(300);

  if (text.includes("chart") || text.includes("sales") || text.includes("graph")) {
    yield {
      id: `${assistantId}-chart`,
      parentId: String(userId),
      role: "assistant",
      type: "chart",
      content: {
        options: {
          chart: { id: "mock-chart", type: "line", toolbar: { show: true } },
          xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
          title: { text: "Mock Sales Trend", align: "center" },
        },
        series: [{ name: "Sales", data: [30, 40, 35, 50, 49, 60] }],
      },
      timestamp: new Date().toISOString(),
      done: true,
    };
  } else if (text.includes("product") || text.includes("watch") || text.includes("camera") || text.includes("laptop")) {
    const products = [
      { id: 1, name: "Sleek Smartwatch", price: 199.99, imageUrl: "https://picsum.photos/id/20/300/200" },
      { id: 2, name: "GoPro Camera", price: 299.99, imageUrl: "https://picsum.photos/id/21/300/200" },
      { id: 3, name: "Mini Laptop", price: 299.99, imageUrl: "https://picsum.photos/id/22/300/200" },
    ];

    yield {
      id: `${assistantId}-toolcall`,
      parentId: String(userId),
      role: "assistant",
      type: "tool_call",
      toolCall: {
        id: "call_1",
        name: "search_products",
        arguments: { query: message.content, limit: 3 },
      },
      timestamp: new Date().toISOString(),
    };

    await delay(300);

    yield {
      id: `${assistantId}-tooloutput`,
      parentId: `${assistantId}-toolcall`,
      role: "tool",
      type: "tool_output",
      toolOutput: {
        id: "call_1",
        name: "search_products",
        result: products,
      },
      timestamp: new Date().toISOString(),
    };

    await delay(200);

    yield {
      id: `${assistantId}-products`,
      parentId: String(userId),
      role: "assistant",
      type: "products",
      content: {
        heading: "Here are some products you might like",
        products,
      },
      timestamp: new Date().toISOString(),
      done: true,
    };
  } else if (text.includes("cart") || text.includes("add")) {
    yield {
      id: `${assistantId}-cart`,
      parentId: String(userId),
      role: "assistant",
      type: "cart_update",
      content: {
        action: "add",
        productId: 1,
        quantity: 1,
        message: "Added 1 Sleek Smartwatch to your cart.",
      },
      timestamp: new Date().toISOString(),
      done: true,
    };
  } else {
    yield {
      id: `${assistantId}-text`,
      parentId: String(userId),
      role: "assistant",
      type: "text",
      content: `Echo: ${message.content}`,
      timestamp: new Date().toISOString(),
      done: true,
    };
  }
}
