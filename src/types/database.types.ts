export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          weather_city: string | null
          weather_lat: number | null
          weather_lng: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          weather_city?: string | null
          weather_lat?: number | null
          weather_lng?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          weather_city?: string | null
          weather_lat?: number | null
          weather_lng?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      plants: {
        Row: {
          id: string
          user_id: string
          name: string
          species: string | null
          cover_photo_url: string | null
          acquired_date: string
          status: 'active' | 'archived' | 'deceased' | 'gifted'
          location: string | null
          light_level: string | null
          watering_frequency_days: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          species?: string | null
          cover_photo_url?: string | null
          acquired_date: string
          status?: 'active' | 'archived' | 'deceased' | 'gifted'
          location?: string | null
          light_level?: string | null
          watering_frequency_days?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          species?: string | null
          cover_photo_url?: string | null
          acquired_date?: string
          status?: 'active' | 'archived' | 'deceased' | 'gifted'
          location?: string | null
          light_level?: string | null
          watering_frequency_days?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      diary_entries: {
        Row: {
          id: string
          plant_id: string
          user_id: string
          entry_date: string
          entry_time: string | null
          content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          plant_id: string
          user_id: string
          entry_date: string
          entry_time?: string | null
          content?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          plant_id?: string
          user_id?: string
          entry_date?: string
          entry_time?: string | null
          content?: string | null
          created_at?: string
        }
      }
      entry_photos: {
        Row: {
          id: string
          entry_id: string
          user_id: string
          storage_path: string
          display_order: number | null
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          entry_id: string
          user_id: string
          storage_path: string
          display_order?: number | null
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          entry_id?: string
          user_id?: string
          storage_path?: string
          display_order?: number | null
          caption?: string | null
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string | null
        }
      }
      entry_tags: {
        Row: {
          entry_id: string
          tag_id: string
        }
        Insert: {
          entry_id: string
          tag_id: string
        }
        Update: {
          entry_id?: string
          tag_id?: string
        }
      }
      plant_events: {
        Row: {
          id: string
          plant_id: string
          user_id: string
          event_type: 'rega' | 'adubacao' | 'replantio' | 'poda' | 'tratamento_pragas' | 'outro'
          event_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          plant_id: string
          user_id: string
          event_type: 'rega' | 'adubacao' | 'replantio' | 'poda' | 'tratamento_pragas' | 'outro'
          event_date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          plant_id?: string
          user_id?: string
          event_type?: 'rega' | 'adubacao' | 'replantio' | 'poda' | 'tratamento_pragas' | 'outro'
          event_date?: string
          notes?: string | null
          created_at?: string
        }
      }
      weather_alert_settings: {
        Row: {
          id: string
          user_id: string
          rain_alert: boolean
          temp_swing_alert: boolean
          wind_alert: boolean
          severe_alert: boolean
          sensitivity: 'baixa' | 'media' | 'alta'
          quiet_hours_start: string | null
          quiet_hours_end: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rain_alert?: boolean
          temp_swing_alert?: boolean
          wind_alert?: boolean
          severe_alert?: boolean
          sensitivity?: 'baixa' | 'media' | 'alta'
          quiet_hours_start?: string | null
          quiet_hours_end?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rain_alert?: boolean
          temp_swing_alert?: boolean
          wind_alert?: boolean
          severe_alert?: boolean
          sensitivity?: 'baixa' | 'media' | 'alta'
          quiet_hours_start?: string | null
          quiet_hours_end?: string | null
          updated_at?: string
        }
      }
      push_subscriptions: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          p256dh: string
          auth_key: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          endpoint: string
          p256dh: string
          auth_key: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          endpoint?: string
          p256dh?: string
          auth_key?: string
          created_at?: string
        }
      }
      educational_content: {
        Row: {
          id: string
          category: string
          title: string
          body: string
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          category: string
          title: string
          body: string
          display_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          category?: string
          title?: string
          body?: string
          display_order?: number | null
          created_at?: string
        }
      }
    }
  }
}
