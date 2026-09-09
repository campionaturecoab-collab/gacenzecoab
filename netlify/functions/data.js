const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const store = getStore("magazzino");

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    if (event.httpMethod === "GET") {
      const data = await store.get("state", { type: "json" });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data || { cells: [], products: [] })
      };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      await store.setJSON("state", body);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true })
      };
    }

    return { statusCode: 405, headers, body: "Method not allowed" };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: String(err) })
    };
  }
};
