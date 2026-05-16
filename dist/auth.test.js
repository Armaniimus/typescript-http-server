import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./auth.js";
import { config } from "./config.js";
describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1;
    let hash2;
    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });
    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });
});
describe("JWT token validation", () => {
    const userId1 = "lane@gmail.com";
    const userId2 = "john@gmail.com";
    it("should create token correctly", async () => {
        const result = await makeJWT(userId1, 20000, config.api.secret);
        expect(result).toBeTypeOf("string");
    });
    it("should validate token correctly", async () => {
        const token = await makeJWT(userId2, 20000, config.api.secret);
        const result = validateJWT(token, config.api.secret);
        expect(result).toBe(userId2);
    });
});
