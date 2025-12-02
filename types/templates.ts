// types/templates.ts
export interface Template {
  id: number;
  name: string;
  description: string;
  active?: boolean;
}

export interface TeamTemplate {
  id: string;
  team_id: string;
  template_id: number;
  active: boolean;
  config?: any;
  activated_at?: string;
  created_at: string;
}

export interface TemplatesResponse {
  templates: Template[];
  team_id: string;
}

export interface ActivationResponse {
  success: boolean;
  team_template_id: string;
  message?: string;
}