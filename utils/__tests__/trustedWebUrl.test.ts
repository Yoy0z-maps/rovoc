import { getTrustedWebTitle, parseTrustedWebUrl } from "../trustedWebUrl";

describe("trusted web URLs", () => {
  it("accepts only HTTPS links on the allowlist", () => {
    expect(parseTrustedWebUrl("https://yoy0z-maps.com/rovoca/privacy")).not.toBeNull();
    expect(parseTrustedWebUrl("https%3A%2F%2Fwww.yoy0z-maps.com%2Frovoca%2Fterms")).not.toBeNull();
    expect(parseTrustedWebUrl("http://yoy0z-maps.com/rovoca/privacy")).toBeNull();
    expect(parseTrustedWebUrl("https://yoy0z-maps.com.attacker.example/")).toBeNull();
    expect(parseTrustedWebUrl("javascript:alert(1)")).toBeNull();
  });

  it("derives the title from the trusted destination", () => {
    const donationUrl = parseTrustedWebUrl("https://buymeacoffee.com/yoy0zmaps");
    expect(donationUrl && getTrustedWebTitle(donationUrl)).toBe("Donate");

    const privacyUrl = parseTrustedWebUrl(
      "https://www.yoy0z-maps.com/rovoca/privacy"
    );
    expect(privacyUrl && getTrustedWebTitle(privacyUrl)).toBe("Privacy Policy");
  });
});
