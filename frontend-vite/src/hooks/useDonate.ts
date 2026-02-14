/**
 * useDonate Hook
 * Handles on-chain donation transactions via wagmi
 */

import { useState, useCallback } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { createDonation } from '../lib/api';
import type { TokenType } from '../types';

interface UseDonateOptions {
    campaignId: string;
    onSuccess?: (txHash: string) => void;
    onError?: (error: Error) => void;
}

interface UseDonateReturn {
    donate: (amount: number) => Promise<void>;
    isLoading: boolean;
    isPending: boolean;
    isSuccess: boolean;
    error: Error | null;
    txHash: string | null;
}

export function useDonate({ campaignId, onSuccess, onError }: UseDonateOptions): UseDonateReturn {
    const { address, isConnected } = useAccount();
    const [error, setError] = useState<Error | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);

    const { sendTransactionAsync, isPending } = useSendTransaction();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash as `0x${string}` | undefined,
    });

    const donate = useCallback(async (amount: number) => {
        if (!isConnected || !address) {
            const err = new Error('Wallet not connected');
            setError(err);
            onError?.(err);
            return;
        }

        if (amount <= 0) {
            const err = new Error('Amount must be greater than 0');
            setError(err);
            onError?.(err);
            return;
        }

        try {
            setError(null);

            // Get treasury address from campaign (TODO: fetch from API)
            // For now, we'll use the campaign ID to look up the treasury
            const treasuryAddress = await getTreasuryAddress(campaignId);

            // Send transaction
            const hash = await sendTransactionAsync({
                to: treasuryAddress as `0x${string}`,
                value: parseEther(amount.toString()),
            });

            setTxHash(hash);

            // Record donation in backend
            await createDonation(campaignId, {
                donor_address: address,
                amount,
                token_type: 'MON' as TokenType, // Native token
                tx_hash: hash,
            });

            onSuccess?.(hash);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Transaction failed');
            setError(error);
            onError?.(error);
        }
    }, [isConnected, address, campaignId, sendTransactionAsync, onSuccess, onError]);

    return {
        donate,
        isLoading: isPending || isConfirming,
        isPending,
        isSuccess,
        error,
        txHash,
    };
}

/**
 * Helper to get treasury address for a campaign
 */
async function getTreasuryAddress(campaignId: string): Promise<string> {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/campaigns/${campaignId}/treasury`);
    if (!response.ok) {
        throw new Error('Failed to get treasury address');
    }
    const data = await response.json();
    return data.treasuryAddress;
}
