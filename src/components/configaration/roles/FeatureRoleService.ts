import API from "../../../service/Api";

export default {
  save: async (data: any) => API.post("/feature-role", { ...data}),
  get: async (roleId: number) => API.get(`/feature-role/${roleId}`)
}