import request, { Test } from "supertest";
import type { Express } from "express";

export function getJson(app: Express, path: string): Test {
  return request(app)
    .get(path)
    .set("Accept", "application/json");
}

export function postJson(app: Express, path: string, body: unknown): Test {
  return request(app)
    .post(path)
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .send(body);
}

export function putJson(app: Express, path: string, body: unknown): Test {
  return request(app)
    .put(path)
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .send(body);
}

export function deleteJson(app: Express, path: string): Test {
  return request(app)
    .delete(path)
    .set("Accept", "application/json");
}
