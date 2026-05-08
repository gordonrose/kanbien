import { describe, expect, it, vi } from "vitest";
import {
  createDeterministicProductDiscoveryConversationAdapter,
  createOpenAiProductDiscoveryConversationAdapter,
} from "../../../src/lib/productDiscovery/conversationAdapter";

const baseInput = {
  conversation: {
    conversationId: "conversation-1",
    surfaceContext: {
      moduleKey: "root-admin",
      pageKey: "overview",
      roleContext: "root-builder",
    },
    structuredDiscoveryState: {},
  },
  messages: [
    {
      role: "user" as const,
      body: "I need a chat interface that turns discovery into a packet.",
      createdAt: new Date("2026-05-08T00:00:00.000Z"),
    },
  ],
};

describe("Product Discovery conversation adapter", () => {
  it("uses deterministic local behavior when no OpenAI API key is configured", async () => {
    const adapter = createOpenAiProductDiscoveryConversationAdapter({ apiKey: "" });

    await expect(adapter.generateTurn(baseInput)).resolves.toMatchObject({
      assistantMessage: expect.stringContaining("Captured for Product Discovery"),
      readyForPacket: false,
      assumptions: ["Root-admin page context is prompt context only."],
    });
  });

  it("can be constructed explicitly as deterministic test adapter", async () => {
    const adapter = createDeterministicProductDiscoveryConversationAdapter();

    await expect(adapter.generateTurn(baseInput)).resolves.toMatchObject({
      summary: "I need a chat interface that turns discovery into a packet.",
      confidencePercent: 55,
    });
  });

  it("sends a server-side structured Responses API request when an API key is configured", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({
      output_text: JSON.stringify({
        assistantMessage: "That sounds like a root-admin discovery flow. Who is the first user?",
        summary: "A chat interface should turn discovery into a packet.",
        nextQuestion: "Who is the first user?",
        confidencePercent: 62,
        readyForPacket: false,
        assumptions: ["Root-admin context is prompt-only."],
        packagedTechnicalQuestions: ["How should packet readiness be stored?"],
      }),
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }));
    const adapter = createOpenAiProductDiscoveryConversationAdapter({
      apiKey: "sk-test-key",
      model: "gpt-test",
      endpoint: "https://api.openai.test/v1/responses",
      fetchImpl,
    });

    const turn = await adapter.generateTurn(baseInput);

    expect(turn).toMatchObject({
      assistantMessage: "That sounds like a root-admin discovery flow. Who is the first user?",
      confidencePercent: 62,
    });
    expect(fetchImpl).toHaveBeenCalledWith("https://api.openai.test/v1/responses", expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({
        authorization: "Bearer sk-test-key",
      }),
    }));
    const [, requestInit] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(String(requestInit.body));
    expect(body).toMatchObject({
      model: "gpt-test",
      text: {
        format: {
          type: "json_schema",
          name: "product_discovery_conversation_turn",
          strict: true,
        },
      },
    });
    expect(JSON.stringify(body)).toContain("root-admin");
    expect(JSON.stringify(body)).toContain("turns discovery into a packet");
  });

  it("rejects model output that does not satisfy the Product Discovery turn schema", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({
      output_text: JSON.stringify({
        assistantMessage: "",
      }),
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }));
    const adapter = createOpenAiProductDiscoveryConversationAdapter({
      apiKey: "sk-test-key",
      fetchImpl,
    });

    await expect(adapter.generateTurn(baseInput)).rejects.toThrow();
  });
});
