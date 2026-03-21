import request from "supertest";
import type { Express } from "express";

export function getJson(app: Express, path: string) {
  return request(app)
    .get(path)
    .set("Accept", "application/json");
}