import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/lib/password.ts";
import { csvCell, toCsv } from "../src/lib/csv.ts";
import { formatDate, formatTime, isValidDate, rsvpIsOpen } from "../src/lib/dates.ts";

test("passwords are salted and verified; wrong and malformed hashes are rejected", async () => {
  const password = "a-long-wedding-password-💛";
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.notEqual(first, second);
  assert.ok(!first.includes(password));
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword("wrong-password", first), false);
  for (const malformed of ["", "scrypt:abc:xyz", "scrypt", `${first}:extra`, first.replace("scrypt", "unknown")]) {
    assert.equal(await verifyPassword(password, malformed), false);
  }
});

test("CSV exports neutralize guest-controlled spreadsheet formulas and escape quotes", () => {
  for (const dangerous of ["=1+1", "+CMD()", "-1+2", "@SUM(A1)", "  =HYPERLINK(\"https://example.com\")", "\t=1+1", "\n=1+1"]) {
    assert.ok(csvCell(dangerous).startsWith('"\''));
  }
  assert.equal(csvCell('Aarav, "the groom"'), '"Aarav, ""the groom"""');
  assert.equal(csvCell("Ananya & Aarav"), '"Ananya & Aarav"');
  assert.equal(toCsv([["Name", "Attending"], ["Priya", true]]), '\uFEFF"Name","Attending"\r\n"Priya","true"');
});

test("date validation rejects impossible dates and preserves wedding dates without timezone drift", () => {
  assert.equal(isValidDate("2027-02-29"), false);
  assert.equal(isValidDate("2028-02-29"), true);
  assert.equal(isValidDate("2027-13-01"), false);
  assert.equal(isValidDate("2027-2-14"), false);
  assert.equal(formatDate("2027-02-14"), "14 February 2027");
  assert.equal(formatTime("00:05"), "12:05 AM");
  assert.equal(formatTime("18:30"), "6:30 PM");
});

test("RSVP deadlines use the end of the calendar day in India and paused invitations reject replies", () => {
  const event = { isOpen: true, deadline: "2027-02-01" };
  assert.equal(rsvpIsOpen(event, new Date("2027-02-01T18:29:59Z")), true);
  assert.equal(rsvpIsOpen(event, new Date("2027-02-01T18:30:00Z")), false);
  assert.equal(rsvpIsOpen({ ...event, isOpen: false }, new Date("2027-01-01")), false);
  assert.equal(rsvpIsOpen({ isOpen: true, deadline: null }), true);
});
