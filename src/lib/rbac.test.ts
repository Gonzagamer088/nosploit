import { describe, expect, it } from "vitest";
import { canAssignClients, canInvestigation, canSales, canSeeAllTasks, isPubliclyVisible } from "./rbac";

describe("rbac", () => {
  it("sales cannot access investigation", () => {
    expect(canInvestigation("SALES")).toBe(false);
    expect(canSales("SALES")).toBe(true);
  });
  it("only director of sales and execs assign clients", () => {
    expect(canAssignClients("SALES")).toBe(false);
    expect(canAssignClients("DIRECTOR_SALES")).toBe(true);
    expect(canAssignClients("COO")).toBe(true);
  });
  it("developers cannot see all tasks", () => {
    expect(canSeeAllTasks("DEVELOPER")).toBe(false);
    expect(canSeeAllTasks("DIRECTOR_ENGINEERING")).toBe(true);
  });
  it("suspended clients are hidden", () => {
    expect(isPubliclyVisible("SUSPENDED")).toBe(false);
    expect(isPubliclyVisible("AFFILIATE")).toBe(true);
  });
});
