import {User} from "@/models/user"

export interface Domain {
  id: number;
  domain: string;
  userId: number;
  DNSProvisioned: boolean;
  active: boolean;
  zone: string;
  advanced: boolean;
  subdomains: boolean;
  subdomainsCreate: boolean;
  customUserEligibility: string[];
  restricted: "disabled" | "user" | "premium";
  user: User;
  users: User[];
  activeUsersCount: number;
}
