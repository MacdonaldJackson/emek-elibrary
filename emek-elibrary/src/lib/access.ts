import type { AccessLevel } from "@prisma/client";
import type { Session } from "next-auth";

/**
 * Single choke point for entitlement checks.
 *
 * Today there's only one subscription tier, so every signed-in user can read
 * every book regardless of `accessLevel`. When a paid/licensed tier is
 * introduced, this is the only function that needs to change — e.g. check
 * `session.user.role`, a future `entitlements` table, or an institutional
 * login — rather than scattering access checks across every page/route that
 * renders book content.
 */
export function canAccessBook(
    session: Session | null,
    accessLevel: AccessLevel
  ): boolean {
    if (!session?.user) return false;
    // TODO(licensing): once RESTRICTED books require a paid/institutional
  // entitlement, branch on accessLevel here instead of always returning true.
  return Boolean(accessLevel);
}
