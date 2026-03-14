import { Connection, clusterApiUrl } from '@solana/web3.js';

export const NETWORK    = import.meta.env.VITE_SOLANA_NETWORK || 'devnet';
const RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
export const connection = new Connection(RPC_URL, 'confirmed');
export const AIRDROP_AMOUNT = 1_000_000_000; // 1 SOL in lamports
