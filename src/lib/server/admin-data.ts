import { supabaseAdmin } from "./supabase-admin";

export type AdminClientsView = {
  id: string;
  name: string;
  company: string;
  client_code: string;
  project_count: number;
};

export type AdminProjectsView = {
  id: string;
  name: string;
  client_id: string;
  client_name: string;
  client_company: string;
  category: string;
  status: string;
  phase: string;
  progress: number;
  expected_launch: string;
};

type ClientRow = {
  id: string;
  name: string | null;
  company: string | null;
  client_code: string | null;
};

type ProjectRow = {
  id: string;
  client_id: string | null;
  name: string | null;
  type: string | null;
  category: string | null;
  status: string | null;
  phase: string | null;
  progress: number | null;
  expected_launch: string | null;
};

export async function fetchAdminClients(): Promise<AdminClientsView[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    const { data: clients, error: clientsError } = await supabaseAdmin
      .from("clients")
      .select("*");

    if (clientsError || !clients) {
      console.error("Failed to fetch clients:", clientsError?.message);
      return [];
    }

    // Fetch project counts per client
    const { data: projects, error: projectsError } = await supabaseAdmin
      .from("projects")
      .select("client_id");

    if (projectsError) {
      console.error("Failed to fetch project counts:", projectsError?.message);
    }

    const projectCountMap = new Map<string, number>();
    (projects ?? []).forEach((project: { client_id: string | null }) => {
      if (!project.client_id) return;
      const count = projectCountMap.get(project.client_id) ?? 0;
      projectCountMap.set(project.client_id, count + 1);
    });

    return (clients as ClientRow[]).map((client) => ({
      id: client.id,
      name: client.name ?? "Unnamed",
      company: client.company ?? "Company",
      client_code: client.client_code ?? "",
      project_count: projectCountMap.get(client.id) ?? 0,
    }));
  } catch (error) {
    console.error("Error in fetchAdminClients:", error);
    return [];
  }
}

export async function fetchAdminProjects(): Promise<AdminProjectsView[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    const { data: projects, error: projectsError } = await supabaseAdmin
      .from("projects")
      .select("*");

    if (projectsError || !projects) {
      console.error("Failed to fetch projects:", projectsError?.message);
      return [];
    }

    // Fetch client info for each project
    const { data: clients, error: clientsError } = await supabaseAdmin
      .from("clients")
      .select("*");

    if (clientsError) {
      console.error(
        "Failed to fetch clients for projects:",
        clientsError?.message,
      );
    }

    const clientMap = new Map<string, ClientRow>();
    (clients ?? []).forEach((client: ClientRow) => {
      clientMap.set(client.id, client);
    });

    return (projects as ProjectRow[]).map((project) => {
      const client = project.client_id
        ? clientMap.get(project.client_id)
        : undefined;
      return {
        id: project.id,
        name: project.name ?? "Unnamed Project",
        client_id: project.client_id ?? "",
        client_name: client?.name ?? "Unknown Client",
        client_company: client?.company ?? "Unknown",
        category: project.category ?? project.type ?? "web-development",
        status: project.status ?? "Unknown",
        phase: project.phase ?? "Unknown",
        progress: Number(project.progress ?? 0),
        expected_launch: project.expected_launch ?? "—",
      };
    });
  } catch (error) {
    console.error("Error in fetchAdminProjects:", error);
    return [];
  }
}
