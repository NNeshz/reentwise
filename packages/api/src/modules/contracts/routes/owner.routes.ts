import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { contractsModule } from "@reentwise/api/src/modules/contracts/contracts.module";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";
import { ContractNotFoundError } from "@reentwise/api/src/modules/contracts/lib/contract-not-found-error";
import {
  contractIdParamsSchema,
  contractsListQuerySchema,
  createContractBodySchema,
  updateContractBodySchema,
  setPdfUrlBodySchema,
  contractsSuccessSchema,
  contractsError404Schema,
  contractsError500Schema,
} from "@reentwise/api/src/modules/contracts/contracts.schema";
import { openApiTags } from "@reentwise/api/src/utils/openapi-meta";

function mapContractRouteError(
  e: unknown,
  set: { status?: number | string },
) {
  if (e instanceof ContractNotFoundError) {
    set.status = 404;
    return apiError(404, e.message);
  }
  const message =
    e instanceof Error ? e.message : "Error desconocido";
  set.status = 500;
  return apiError(500, message);
}

export const ownerContractRoutes = new Elysia({
  name: "ownerContractRoutes",
  prefix: "/contracts/owner",
})
  .use(betterAuthPlugin)
  .use(contractsModule)
  .get(
    "/",
    async ({ user, query, contractsService, set }) => {
      try {
        const data = await contractsService.getContractsByOwner(user.id, {
          search: query.search,
        });
        return apiSuccess("Contratos obtenidos", data);
      } catch (e) {
        return mapContractRouteError(e, set);
      }
    },
    {
      authenticated: true,
      query: contractsListQuerySchema,
      detail: {
        tags: [openApiTags.Contracts],
        summary: "Listar contratos del dueño",
      },
      response: { 200: contractsSuccessSchema, 500: contractsError500Schema },
    },
  )
  .patch(
    "/:contractId",
    async ({ user, params, body, contractsService, set }) => {
      try {
        const data = await contractsService.updateContract(
          params.contractId,
          user.id,
          body,
        );
        if (!data) throw new ContractNotFoundError();
        return apiSuccess("Contrato actualizado", data);
      } catch (e) {
        return mapContractRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: contractIdParamsSchema,
      body: updateContractBodySchema,
      detail: {
        tags: [openApiTags.Contracts],
        summary: "Actualizar campos editables del contrato",
      },
      response: {
        200: contractsSuccessSchema,
        404: contractsError404Schema,
        500: contractsError500Schema,
      },
    },
  )
  .get(
    "/:contractId",
    async ({ user, params, contractsService, set }) => {
      try {
        const data = await contractsService.getContractById(
          params.contractId,
          user.id,
        );
        if (!data) throw new ContractNotFoundError();
        return apiSuccess("Contrato obtenido", data);
      } catch (e) {
        return mapContractRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: contractIdParamsSchema,
      detail: {
        tags: [openApiTags.Contracts],
        summary: "Obtener contrato por ID",
      },
      response: {
        200: contractsSuccessSchema,
        404: contractsError404Schema,
        500: contractsError500Schema,
      },
    },
  )
  .post(
    "/",
    async ({ user, body, contractsService, set }) => {
      try {
        const data = await contractsService.createContract(user.id, {
          ...body,
          startsAt: new Date(body.startsAt),
          endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
        });
        set.status = 201;
        return apiSuccess("Contrato creado", data);
      } catch (e) {
        return mapContractRouteError(e, set);
      }
    },
    {
      authenticated: true,
      body: createContractBodySchema,
      detail: {
        tags: [openApiTags.Contracts],
        summary: "Crear contrato (borrador)",
      },
      response: { 200: contractsSuccessSchema, 500: contractsError500Schema },
    },
  )
  .post(
    "/:contractId/activate",
    async ({ user, params, contractsService, set }) => {
      try {
        const data = await contractsService.activateContract(
          params.contractId,
          user.id,
        );
        if (!data) throw new ContractNotFoundError();
        return apiSuccess("Contrato activado", data);
      } catch (e) {
        return mapContractRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: contractIdParamsSchema,
      detail: {
        tags: [openApiTags.Contracts],
        summary: "Activar (firmar) contrato",
      },
      response: {
        200: contractsSuccessSchema,
        404: contractsError404Schema,
        500: contractsError500Schema,
      },
    },
  )
  .post(
    "/:contractId/terminate",
    async ({ user, params, contractsService, set }) => {
      try {
        const data = await contractsService.terminateContract(
          params.contractId,
          user.id,
        );
        if (!data) throw new ContractNotFoundError();
        return apiSuccess("Contrato terminado", data);
      } catch (e) {
        return mapContractRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: contractIdParamsSchema,
      detail: {
        tags: [openApiTags.Contracts],
        summary: "Terminar contrato",
      },
      response: {
        200: contractsSuccessSchema,
        404: contractsError404Schema,
        500: contractsError500Schema,
      },
    },
  )
  .patch(
    "/:contractId/pdf",
    async ({ user, params, body, contractsService, set }) => {
      try {
        const data = await contractsService.setPdfUrl(
          params.contractId,
          user.id,
          body.pdfUrl,
        );
        if (!data) throw new ContractNotFoundError();
        return apiSuccess("PDF actualizado", data);
      } catch (e) {
        return mapContractRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: contractIdParamsSchema,
      body: setPdfUrlBodySchema,
      detail: {
        tags: [openApiTags.Contracts],
        summary: "Actualizar URL del PDF del contrato",
      },
      response: {
        200: contractsSuccessSchema,
        404: contractsError404Schema,
        500: contractsError500Schema,
      },
    },
  );
