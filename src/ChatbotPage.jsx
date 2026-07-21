import { useState } from "react";
import Chart from "react-apexcharts";

const mockChartConfig = {
  options: {
    chart: {
      id: "mock-chart",
      type: "line",
      toolbar: { show: true },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    title: {
      text: "Mock Sales Trend",
      align: "center",
    },
  },
  series: [{ name: "Sales", data: [30, 40, 35, 50, 49, 60] }],
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      type: "text",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (text.toLowerCase() === "chart") {
      const chartMessage = {
        id: Date.now() + 1,
        role: "assistant",
        type: "chart",
        content: mockChartConfig,
      };
      setMessages((prev) => [...prev, chartMessage]);
    } else {
      const echoMessage = {
        id: Date.now() + 1,
        role: "assistant",
        type: "text",
        content: `Echo: ${text}`,
      };
      setMessages((prev) => [...prev, echoMessage]);
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
            <p className="text-muted">Type something and press send...</p>
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
                {msg.type === "chart" ? (
                  <Chart
                    options={msg.content.options}
                    series={msg.content.series}
                    type="line"
                    width={500}
                    height={300}
                  />
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="card-footer">
          <form onSubmit={handleSend} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
