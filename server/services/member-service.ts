import "server-only";

import { isPgError } from "@/lib/errors";
import { memberRepository } from "@/server/repositories/member-repository";
import type { CreateMemberInput, UpdateMemberInput } from "@/lib/types/member";

export const memberService = {
  async getCount(onlyActive?: boolean) {
    return memberRepository.count(onlyActive);
  },

  async getAll(onlyActive?: boolean) {
    return memberRepository.findAll(onlyActive);
  },

  async toggleActive(id: number, active: boolean) {
    try {
      await memberRepository.updateActive(id, active);
      return { success: true as const };
    } catch (error) {
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No estás autorizado a cambiar el estado del socio.",
        };
      }
      return {
        success: false as const,
        error: "Hubo un error al cambiar el estado del socio.",
      };
    }
  },

  async update(id: number, data: UpdateMemberInput) {
    try {
      await memberRepository.update(id, data);
      return { success: true as const };
    } catch (error) {
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No estás autorizado a cambiar el socio.",
        };
      }
      return {
        success: false as const,
        error: "Hubo un error al cambiar el socio.",
      };
    }
  },

  async create(data: CreateMemberInput) {
    try {
      if (!data.full_name) {
        return { success: false as const, error: "El nombre es obligatorio." };
      }

      await memberRepository.insert({
        full_name: data.full_name,
        nickname: data.nickname,
        is_active: true,
      });
      return { success: true as const };
    } catch (error) {
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No estás autorizado a crear un socio.",
        };
      }
      return {
        success: false as const,
        error: "Hubo un error al crear el socio.",
      };
    }
  },
};
