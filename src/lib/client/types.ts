export type ClientStatus =
| 'active'
| 'paused'
| 'completed';

export type TimelineStatus =
| 'completed'
| 'active'
| 'upcoming';

export type ProjectCategory =
| 'web-development'
| 'web-redesign'
| 'saas'
| 'ai-tool'
| 'ai-automation'
| 'demo';

export type ProjectRecord = {
id: string;
client_id: string;
project_code: string;
name: string;
description: string;
type: string;
category: ProjectCategory;
status: ClientStatus | string;
phase: string;
progress: number;
expected_launch: string;
live_demo_url?: string | null;
images: string[];
created_at?: string;
updated_at?: string;
};

export type TimelineRecord = {
id: string;
project_id: string;
title: string;
description: string;
status: TimelineStatus;
date: string;
order: number;
created_at?: string;
updated_at?: string;
};

export type ProjectHoursRecord = {
id: string;
project_id: string;
hours_allocated: number;
hours_used: number;
updated_at?: string;
};

export type ProjectUpdateRecord = {
id: string;
project_id: string;
title: string;
description: string;
update_type: string;
published: boolean;
created_at?: string;
updated_at?: string;
};

export type ProjectMilestoneStatus =
| 'completed'
| 'active'
| 'upcoming';

export type ProjectMilestoneRecord = {
id: string;
project_id: string;
title: string;
description: string;
status: ProjectMilestoneStatus;
date: string;
order: number;
created_at?: string;
updated_at?: string;
};

export type ProjectProgressHistoryRecord = {
id: string;
project_id: string;
progress: number;
phase: string;
note: string;
recorded_at: string;
created_at?: string;
};

export type ClientRecord = {
  id: string;
  name: string;
  company: string;
  client_code: string;
};

export type ClientProjectSummary = {
  id: string;
  project_code: string;
  name: string;
  description: string;
  type: string;
  category: ProjectCategory;
  status: ClientStatus | string;
  phase: string;
  progress: number;
  expected_launch: string;
  live_demo_url?: string | null;
  images: string[];
  created_at?: string;
  updated_at?: string;
};

export type ClientProjectsData = {
  client: ClientRecord;
  projects: ClientProjectSummary[];
};

export type ClientPortalData = {
project: ProjectRecord;
timeline: TimelineRecord[];
hours: ProjectHoursRecord;
updates: ProjectUpdateRecord[];
milestones: ProjectMilestoneRecord[];
progressHistory: ProjectProgressHistoryRecord[];
};

export function normalizeProjectCategory(
value?: string | null,
): ProjectCategory {
const normalized = value?.trim().toLowerCase();

switch (normalized) {
case 'web-development':
case 'web development':
case 'website development':
case 'website':
case 'web application':
return 'web-development';


case 'web-redesign':
case 'redesign':
case 'website redesign':
case 'web redesign':
  return 'web-redesign';

case 'saas':
case 'saas platform':
  return 'saas';

case 'ai-tool':
case 'ai tool':
case 'ai application':
  return 'ai-tool';

case 'ai-automation':
case 'ai automation':
case 'automation':
case 'ai workflow':
  return 'ai-automation';

case 'demo':
case 'demo workspace':
  return 'demo';

default:
  return 'web-development';
  

}
}
