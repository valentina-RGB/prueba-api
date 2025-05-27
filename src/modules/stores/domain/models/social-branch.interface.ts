import { IBranches } from "./branches.interface";
import { ISocialNetwork } from "./social-network.interface";

export interface ISocialBranch {
    id: number;
    branch:IBranches;
    social_network: ISocialNetwork;
    description: string;
    value: string;
  }
  