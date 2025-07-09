export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          customer_name: string | null;
          site_address: string | null;
          system_size_kw: number | null;
          project_type: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          customer_name?: string | null;
          site_address?: string | null;
          system_size_kw?: number | null;
          project_type?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          customer_name?: string | null;
          site_address?: string | null;
          system_size_kw?: number | null;
          project_type?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          project_id: string;
          file_name: string;
          file_type: string | null;
          file_size: number | null;
          storage_path: string | null;
          document_type: string | null;
          processed: boolean | null;
          extracted_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          file_name: string;
          file_type?: string | null;
          file_size?: number | null;
          storage_path?: string | null;
          document_type?: string | null;
          processed?: boolean | null;
          extracted_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          file_name?: string;
          file_type?: string | null;
          file_size?: number | null;
          storage_path?: string | null;
          document_type?: string | null;
          processed?: boolean | null;
          extracted_data?: Json | null;
          created_at?: string;
        };
      };
      calculations: {
        Row: {
          id: string;
          project_id: string;
          calculation_type: string | null;
          input_parameters: Json | null;
          results: Json | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          calculation_type?: string | null;
          input_parameters?: Json | null;
          results?: Json | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          calculation_type?: string | null;
          input_parameters?: Json | null;
          results?: Json | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string | null;
          project_id: string | null;
          messages: Json[] | null;
          context: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          project_id?: string | null;
          messages?: Json[] | null;
          context?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          project_id?: string | null;
          messages?: Json[] | null;
          context?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          project_id: string;
          report_type: string | null;
          file_path: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          report_type?: string | null;
          file_path?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          report_type?: string | null;
          file_path?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      project_type: 'commercial' | 'industrial' | 'utility';
      project_status: 'draft' | 'active' | 'completed' | 'archived';
      document_type: 'rfp' | 'drawing' | 'datasheet' | 'permit' | 'other';
      calculation_type: 'sizing' | 'financial' | 'production' | 'other';
      report_type: 'proposal' | 'financial' | 'technical' | 'permit' | 'other';
    };
  };
}
