import axios from "axios";

export type ProposalInput = { address: string };
export type ProposalResult = {
  address: string;
  lat: number;
  lng: number;
  utilityRates?: any;
};

export const getGeocode = async (address: string) => {
  const res = await axios.post("/api/mcp-geocode", { address });
  return res.data;
};

export const getUtilityRates = async (lat: number, lng: number) => {
  const res = await axios.post("/api/mcp-firecrawl", { lat, lng });
  return res.data;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const addressToProposal = async (input: any): Promise<any> => {
  return { message: 'Dummy proposal result. MCP integration not implemented yet.' };
}; 