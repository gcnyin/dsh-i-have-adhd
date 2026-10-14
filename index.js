/**
 * i-have-adhd for DeepSeek Harness.
 *
 * Host half: registers the canonical i-have-adhd ruleset as one ordered
 * system-prompt section, so every model step is shaped for an ADHD reader.
 * This mirrors the upstream "always-on" adapters (Claude hooks, OpenCode
 * context hook): strip the skill's YAML frontmatter, prepend a short
 * mode header, and inject the body.
 *
 * The section uses the weakest sufficient mechanism (a plain contribution;
 * not `complete`, not the `system-prompt/assemble` waterfall), so every other
 * plugin's prompt contribution is preserved.
 *
 * Row config (plain object; normalized here because this plugin ships no
 * Config schema to stay dependency-free):
 *   enabled    boolean  contribute the section (default true)
 *   extraRules string   extra text appended verbatim after the ruleset
 */

import { readFileSync } from 'node:fs';

/** Upstream frontmatter shape: a leading `--- ... ---` block. */
const FRONTMATTER = /^---[^\S\r\n]*\r?\n[\s\S]*?\r?\n---[^\S\r\n]*(?:\r?\n|$)/;

/** Read the canonical ruleset shipped beside this module, frontmatter stripped. */
function loadRules() {
  const raw = readFileSync(new URL('./SKILL.md', import.meta.url), 'utf8');
  return raw.replace(FRONTMATTER, '').replace(/(?:\r?\n)+$/, '');
}

/** Mode header, adapted from the shared upstream always-on hooks. */
function modeHeader() {
  return (
    'ADHD MODE ACTIVE (always-on). The ruleset below applies to every response. ' +
    '"stop adhd mode" or "normal mode" turns it off for this session; disable the ' +
    'i-have-adhd plugin to turn it off for good.'
  );
}

/** The systemPrompt service is required; profiles without it keep this plugin inactive. */
export const inject = ['systemPrompt'];

export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const extraRules =
    typeof config.extraRules === 'string' ? config.extraRules.trim() : '';
  if (!enabled) return;

  const text = [modeHeader(), loadRules(), extraRules]
    .filter((part) => part.length > 0)
    .join('\n\n');

  ctx.effect(() =>
    ctx.systemPrompt.section({
      name: 'i-have-adhd:rules',
      // Last named allocation; equal order falls through to name order, and
      // 'i-have-adhd:rules' sorts after 'deployment:persona-suffix', so the
      // ruleset closes the system prompt where output shaping matters most.
      order: ctx.systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_SUFFIX'),
      text,
      // The ruleset is literal prose; it must never interpolate {{variables}}.
      interpolate: false,
    }),
  );
}
