import { describe, expect, it, vi } from "vitest";
import {
  createDeterministicProductDiscoveryConversationAdapter,
  createOpenAiProductDiscoveryConversationAdapter,
  ProductDiscoveryConversationGuardrailError,
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
      assistantMessage: expect.stringContaining("Product Discovery request"),
      nextQuestion: "What should the normal successful version let the requester do?",
      nextStep: "ask_business_question",
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
        nextStep: "ask_business_question",
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
      nextStep: "ask_business_question",
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
      max_output_tokens: 700,
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
    expect(JSON.stringify(body)).toContain("not a terse support acknowledgement");
    expect(JSON.stringify(body)).toContain("materially change product meaning");
    expect(JSON.stringify(body)).toContain("Do not interrogate every UI micro-detail");
    expect(JSON.stringify(body)).toContain("if not you will produce the packet for download");
    expect(body.text.format.schema.required).toContain("nextStep");
  });

  it("does not call OpenAI when the adapter is disabled", async () => {
    const fetchImpl = vi.fn();
    const adapter = createOpenAiProductDiscoveryConversationAdapter({
      apiKey: "sk-test-key",
      enabled: false,
      fetchImpl,
    });

    await expect(adapter.generateTurn(baseInput)).resolves.toMatchObject({
      assistantMessage: expect.stringContaining("Product Discovery request"),
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("blocks requests after the local daily guardrail is reached", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({
      output_text: JSON.stringify({
        assistantMessage: "First reply.",
        summary: "Summary.",
        nextQuestion: "Next?",
        nextStep: "ask_business_question",
        confidencePercent: 50,
        readyForPacket: false,
        assumptions: [],
        packagedTechnicalQuestions: [],
      }),
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }));
    const adapter = createOpenAiProductDiscoveryConversationAdapter({
      apiKey: "sk-test-key",
      dailyRequestLimit: 1,
      monthlyRequestLimit: 10,
      fetchImpl,
      now: () => new Date("2026-05-08T00:00:00.000Z"),
    });

    await adapter.generateTurn(baseInput);
    await expect(adapter.generateTurn(baseInput)).rejects.toThrow(ProductDiscoveryConversationGuardrailError);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("trims transcript payloads before sending them to OpenAI", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({
      output_text: JSON.stringify({
        assistantMessage: "Trimmed reply.",
        summary: "Summary.",
        nextQuestion: "Next?",
        nextStep: "ask_business_question",
        confidencePercent: 50,
        readyForPacket: false,
        assumptions: [],
        packagedTechnicalQuestions: [],
      }),
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }));
    const adapter = createOpenAiProductDiscoveryConversationAdapter({
      apiKey: "sk-test-key",
      maxTranscriptMessages: 1,
      maxInputChars: 250,
      maxOutputTokens: 123,
      fetchImpl,
    });

    await adapter.generateTurn({
      ...baseInput,
      messages: [
        {
          role: "user",
          body: "Older message",
          createdAt: new Date("2026-05-08T00:00:00.000Z"),
        },
        {
          role: "user",
          body: "Latest message " + "x".repeat(500),
          createdAt: new Date("2026-05-08T00:01:00.000Z"),
        },
      ],
    });

    const [, requestInit] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(String(requestInit.body));
    const payloadText = body.input[1].content[0].text;
    expect(body.max_output_tokens).toBe(123);
    expect(payloadText.length).toBeLessThanOrEqual(320);
    expect(payloadText).not.toContain("Older message");
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

  it("accepts calibrated turns that state assumptions without forcing another question", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({
      output_text: JSON.stringify({
        assistantMessage:
          "I will assume the save action uses the only available behavior: save and rewrite.",
        summary: "Message edits should rewrite the downstream chat in place.",
        nextQuestion: "",
        nextStep: "state_assumption",
        confidencePercent: 86,
        readyForPacket: false,
        assumptions: [
          "Rule: only the original author can edit their own message.",
          "Usual case: low-risk button copy can use the product's standard wording unless corrected.",
        ],
        packagedTechnicalQuestions: ["How should downstream regenerated messages be versioned durably?"],
      }),
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }));
    const adapter = createOpenAiProductDiscoveryConversationAdapter({
      apiKey: "sk-test-key",
      fetchImpl,
    });

    await expect(adapter.generateTurn({
      ...baseInput,
      messages: [
        ...baseInput.messages,
        {
          role: "assistant",
          body: "Should old downstream replies be replaced or kept accessible?",
          createdAt: new Date("2026-05-08T00:01:00.000Z"),
        },
        {
          role: "user",
          body: "they should be replaced in place",
          createdAt: new Date("2026-05-08T00:02:00.000Z"),
        },
      ],
    })).resolves.toMatchObject({
      nextQuestion: "",
      nextStep: "state_assumption",
      readyForPacket: false,
    });
  });

  it("accepts ready turns only when they include the final packet confirmation question", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({
      output_text: JSON.stringify({
        assistantMessage:
          "That is enough to define the first version: editing your own message rewrites the conversation from that point, with a clear edited label.",
        summary: "Message edits should rewrite the downstream chat in place.",
        nextQuestion: "I think I have everything needed. Do you have any final follow-up, or should I produce the packet for download?",
        nextStep: "ready_for_packet",
        confidencePercent: 90,
        readyForPacket: true,
        assumptions: [
          "Rule: only the original author can edit their own message.",
          "Rule: saving an edit rewrites the conversation from that point.",
        ],
        packagedTechnicalQuestions: ["How should downstream regenerated messages be versioned durably?"],
      }),
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }));
    const adapter = createOpenAiProductDiscoveryConversationAdapter({
      apiKey: "sk-test-key",
      fetchImpl,
    });

    await expect(adapter.generateTurn(baseInput)).resolves.toMatchObject({
      nextQuestion: expect.stringContaining("produce the packet for download"),
      nextStep: "ready_for_packet",
      readyForPacket: true,
    });
  });
});
