import { Router } from "express";
import { RootAccessError } from "../contract/errors";
import {
  parseBeginRootAuthenticationRequest,
  parseCompleteRootAuthenticationRequest,
  parseCreateRootUserRequest,
  parseDeleteRootUserRequest,
  parseGetRootUserProfileQuery,
  parseUpdateRootUserPasswordRequest,
  parseUpdateRootUserProfileRequest,
  parseUpdateRootUserSshKeysRequest,
} from "../contract/schemas";
import { RootAccessService } from "../domain/service";

function mapUnknownError(error: unknown): { status: number; body: Record<string, string> } {
  if (error instanceof RootAccessError) {
    return {
      status: error.status,
      body: {
        code: error.code,
        message: error.message,
      },
    };
  }

  if (error instanceof Error) {
    return {
      status: 400,
      body: {
        code: "INVALID_REQUEST",
        message: error.message,
      },
    };
  }

  return {
    status: 500,
    body: {
      code: "INTERNAL_ERROR",
      message: "Unexpected error",
    },
  };
}

export function createRootAccessRouter(service = new RootAccessService()): Router {
  const router = Router();

  router.post("/root-users", async (req, res) => {
    try {
      const request = parseCreateRootUserRequest(req.body);
      const response = await service.createRootUser(request);
      res.status(201).json(response);
    } catch (error) {
      const mapped = mapUnknownError(error);
      res.status(mapped.status).json(mapped.body);
    }
  });

  router.get("/root-users", async (req, res) => {
    try {
      const query = parseGetRootUserProfileQuery(req.query);
      const response = await service.getRootUserProfile(query);
      res.status(200).json(response);
    } catch (error) {
      const mapped = mapUnknownError(error);
      res.status(mapped.status).json(mapped.body);
    }
  });

  router.put("/root-users", async (req, res) => {
    try {
      const request = parseUpdateRootUserProfileRequest(req.body);
      const response = await service.updateRootUserProfile(request);
      res.status(200).json(response);
    } catch (error) {
      const mapped = mapUnknownError(error);
      res.status(mapped.status).json(mapped.body);
    }
  });

  router.put("/root-users/password", async (req, res) => {
    try {
      const request = parseUpdateRootUserPasswordRequest(req.body);
      const response = await service.updateRootUserPassword(request);
      res.status(200).json(response);
    } catch (error) {
      const mapped = mapUnknownError(error);
      res.status(mapped.status).json(mapped.body);
    }
  });

  router.put("/root-users/ssh-keys", async (req, res) => {
    try {
      const request = parseUpdateRootUserSshKeysRequest(req.body);
      const response = await service.updateRootUserSshKeys(request);
      res.status(200).json(response);
    } catch (error) {
      const mapped = mapUnknownError(error);
      res.status(mapped.status).json(mapped.body);
    }
  });

  router.delete("/root-users", async (req, res) => {
    try {
      const request = parseDeleteRootUserRequest(req.body);
      const response = await service.deleteRootUser(request);
      res.status(200).json(response);
    } catch (error) {
      const mapped = mapUnknownError(error);
      res.status(mapped.status).json(mapped.body);
    }
  });

  router.post("/root-auth/begin", async (req, res) => {
    try {
      const request = parseBeginRootAuthenticationRequest(req.body);
      const response = await service.beginRootAuthentication(request);
      res.status(200).json(response);
    } catch (error) {
      const mapped = mapUnknownError(error);
      res.status(mapped.status).json(mapped.body);
    }
  });

  router.post("/root-auth/complete", async (req, res) => {
    try {
      const request = parseCompleteRootAuthenticationRequest(req.body);
      const response = await service.completeRootAuthentication(request);
      res.status(200).json(response);
    } catch (error) {
      const mapped = mapUnknownError(error);
      res.status(mapped.status).json(mapped.body);
    }
  });

  router.post("/root-auth/refresh", async (_req, res) => {
    try {
      const response = await service.refreshRootSession();
      res.status(200).json(response);
    } catch (error) {
      const mapped = mapUnknownError(error);
      res.status(mapped.status).json(mapped.body);
    }
  });

  router.post("/root-auth/revoke", async (_req, res) => {
    try {
      const response = await service.revokeRootSession();
      res.status(200).json(response);
    } catch (error) {
      const mapped = mapUnknownError(error);
      res.status(mapped.status).json(mapped.body);
    }
  });

  return router;
}
