export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'exporter' | 'importer' | 'admin';
export type BusinessType = 'msme' | 'startup' | 'enterprise';
export type TrendingStatus = 'hot' | 'stable' | 'cold';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: UserRole;
          company_name: string;
          iec_code: string;
          country: string;
          phone_number: string;
          business_type: BusinessType;
          avatar_url: string | null;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role: UserRole;
          company_name: string;
          iec_code: string;
          country?: string;
          phone_number: string;
          business_type: BusinessType;
          avatar_url?: string | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: UserRole;
          company_name?: string;
          iec_code?: string;
          country?: string;
          phone_number?: string;
          business_type?: BusinessType;
          avatar_url?: string | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_hs_codes: {
        Row: {
          id: string;
          user_id: string;
          hs_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hs_code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          hs_code?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          hs_code: string;
          product_name: string;
          category: string | null;
          description: string | null;
          trending_status: TrendingStatus;
          market_size: number | null;
          estimated_margin_min: number | null;
          estimated_margin_max: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hs_code: string;
          product_name: string;
          category?: string | null;
          description?: string | null;
          trending_status?: TrendingStatus;
          market_size?: number | null;
          estimated_margin_min?: number | null;
          estimated_margin_max?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hs_code?: string;
          product_name?: string;
          category?: string | null;
          description?: string | null;
          trending_status?: TrendingStatus;
          market_size?: number | null;
          estimated_margin_min?: number | null;
          estimated_margin_max?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      trade_statistics: {
        Row: {
          id: string;
          hs_code: string;
          country: string;
          year: number;
          export_value: number;
          import_value: number;
          growth_rate: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          hs_code: string;
          country: string;
          year: number;
          export_value?: number;
          import_value?: number;
          growth_rate?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          hs_code?: string;
          country?: string;
          year?: number;
          export_value?: number;
          import_value?: number;
          growth_rate?: number | null;
          created_at?: string;
        };
      };
      country_relations: {
        Row: {
          id: string;
          country_code: string;
          country_name: string;
          trade_agreement_type: string | null;
          fta_status: boolean;
          trade_balance: number | null;
          last_updated: string;
        };
        Insert: {
          id?: string;
          country_code: string;
          country_name: string;
          trade_agreement_type?: string | null;
          fta_status?: boolean;
          trade_balance?: number | null;
          last_updated?: string;
        };
        Update: {
          id?: string;
          country_code?: string;
          country_name?: string;
          trade_agreement_type?: string | null;
          fta_status?: boolean;
          trade_balance?: number | null;
          last_updated?: string;
        };
      };
      tariffs: {
        Row: {
          id: string;
          hs_code: string;
          country: string;
          mfn_tariff: number | null;
          preferential_tariff: number | null;
          required_certifications: string[] | null;
          import_documents: string[] | null;
          last_updated: string;
        };
        Insert: {
          id?: string;
          hs_code: string;
          country: string;
          mfn_tariff?: number | null;
          preferential_tariff?: number | null;
          required_certifications?: string[] | null;
          import_documents?: string[] | null;
          last_updated?: string;
        };
        Update: {
          id?: string;
          hs_code?: string;
          country?: string;
          mfn_tariff?: number | null;
          preferential_tariff?: number | null;
          required_certifications?: string[] | null;
          import_documents?: string[] | null;
          last_updated?: string;
        };
      };
      government_schemes: {
        Row: {
          id: string;
          scheme_name: string;
          scheme_type: string;
          eligible_hs_codes: string[] | null;
          eligible_countries: string[] | null;
          eligible_business_types: string[] | null;
          description: string | null;
          official_link: string | null;
          benefits: string | null;
          eligibility_criteria: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          scheme_name: string;
          scheme_type: string;
          eligible_hs_codes?: string[] | null;
          eligible_countries?: string[] | null;
          eligible_business_types?: string[] | null;
          description?: string | null;
          official_link?: string | null;
          benefits?: string | null;
          eligibility_criteria?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          scheme_name?: string;
          scheme_type?: string;
          eligible_hs_codes?: string[] | null;
          eligible_countries?: string[] | null;
          eligible_business_types?: string[] | null;
          description?: string | null;
          official_link?: string | null;
          benefits?: string | null;
          eligibility_criteria?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      news_feed: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          category: string | null;
          sector: string | null;
          source: string | null;
          source_url: string | null;
          published_at: string;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content?: string | null;
          category?: string | null;
          sector?: string | null;
          source?: string | null;
          source_url?: string | null;
          published_at?: string;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string | null;
          category?: string | null;
          sector?: string | null;
          source?: string | null;
          source_url?: string | null;
          published_at?: string;
          is_featured?: boolean;
          created_at?: string;
        };
      };
      importer_ratings: {
        Row: {
          id: string;
          importer_id: string;
          rated_by: string;
          overall_score: number;
          payment_reliability: number;
          compliance_score: number;
          dispute_history: number;
          review_text: string | null;
          is_verified: boolean;
          is_anonymous: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          importer_id: string;
          rated_by: string;
          overall_score: number;
          payment_reliability: number;
          compliance_score: number;
          dispute_history: number;
          review_text?: string | null;
          is_verified?: boolean;
          is_anonymous?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          importer_id?: string;
          rated_by?: string;
          overall_score?: number;
          payment_reliability?: number;
          compliance_score?: number;
          dispute_history?: number;
          review_text?: string | null;
          is_verified?: boolean;
          is_anonymous?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      service_providers: {
        Row: {
          id: string;
          service_type: string;
          provider_name: string;
          description: string | null;
          contact_info: Json | null;
          rating: number;
          review_count: number;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_type: string;
          provider_name: string;
          description?: string | null;
          contact_info?: Json | null;
          rating?: number;
          review_count?: number;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_type?: string;
          provider_name?: string;
          description?: string | null;
          contact_info?: Json | null;
          rating?: number;
          review_count?: number;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          related_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          related_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          related_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
