import dns from "dns";

export async function domain_exists(domain: string): Promise<boolean> {
  return new Promise((resolve) => {
    dns.resolve(domain, "A", (err) => {
      if (err && err.code === "ENOTFOUND") {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}
