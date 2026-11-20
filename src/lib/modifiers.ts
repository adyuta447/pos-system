import type { CartModifier } from './cart.ts';

interface Option {
  id: string;
  name: string;
  priceDelta: number;
  isDefault: boolean;
}

interface Group {
  id: string;
  required: boolean;
  maxSelect: number;
  options: Option[];
}

function toCartModifier(group: Group, option: Option): CartModifier {
  return { optionId: option.id, groupId: group.id, name: option.name, priceDelta: option.priceDelta };
}

/** Preselected options: the defaults of each group (spec 3.1, so the cashier can just tap Tambah). */
export function defaultModifiers(groups: Group[]): CartModifier[] {
  return groups.flatMap((group) => group.options.filter((o) => o.isDefault).map((o) => toCartModifier(group, o)));
}

/**
 * Tapping an option:
 * - single-choice group: replaces the current choice
 * - multi-choice group: toggles, up to maxSelect
 * - a required group can never be left empty
 */
export function toggleModifier(selected: CartModifier[], group: Group, option: Option): CartModifier[] {
  const inGroup = selected.filter((m) => m.groupId === group.id);
  const otherGroups = selected.filter((m) => m.groupId !== group.id);

  if (inGroup.some((m) => m.optionId === option.id)) {
    if (group.required && inGroup.length === 1) return selected;
    return [...otherGroups, ...inGroup.filter((m) => m.optionId !== option.id)];
  }
  if (group.maxSelect <= 1) return [...otherGroups, toCartModifier(group, option)];
  if (inGroup.length >= group.maxSelect) return selected;
  return [...selected, toCartModifier(group, option)];
}

export function missingRequiredGroup(selected: CartModifier[], groups: Group[]): boolean {
  return groups.some((group) => group.required && !selected.some((m) => m.groupId === group.id));
}
