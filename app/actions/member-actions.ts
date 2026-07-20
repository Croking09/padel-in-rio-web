"use server";

import { cacheLife, cacheTag, updateTag } from "next/cache";
import { memberService } from "@/server/services/member-service";
import type { CreateMemberInput, MemberUpdate } from "@/lib/types/member";

export async function getMembersCount(onlyActive?: boolean) {
  "use cache";
  cacheLife("days");
  cacheTag("members-count");
  return memberService.getCount(onlyActive);
}

export async function getAllMembers(onlyActive?: boolean) {
  "use cache";
  cacheLife("days");
  cacheTag("members");
  return memberService.getAll(onlyActive);
}

export async function toggleActiveMember(id: number, active: boolean) {
  const result = await memberService.toggleActive(id, active);
  if (result.success) {
    updateTag("members");
    updateTag("members-count");
  }
  return result;
}

export async function editMember(id: number, data: MemberUpdate) {
  const result = await memberService.update(id, data);
  if (result.success) updateTag("members");
  return result;
}

export async function createMember(data: CreateMemberInput) {
  const result = await memberService.create(data);
  if (result.success) {
    updateTag("members");
    updateTag("members-count");
  }
  return result;
}
