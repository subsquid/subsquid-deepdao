import { UnknownVersionError } from '../../common/errors'
import { BlockContext } from '../../types/support'
import { DemocracyPublicPropsStorage } from '../../types/storage'

interface DemocracyProposalStorageData {
    index: number
    hash: Uint8Array
    proposer: Uint8Array
}

async function getStorageData(ctx: BlockContext): Promise<DemocracyProposalStorageData[] | undefined> {
    const storage = new DemocracyPublicPropsStorage(ctx)
    if (storage.isV1020) {
        const storageData = await storage.asV1020.get()
        if (!storageData) return undefined

        return storageData.map((proposal): DemocracyProposalStorageData => {
            const [index, , proposer] = proposal
            return {
                index,
                hash: new Uint8Array(32).fill(0),
                proposer,
            }
        })
    } else if (storage.isV1022) {
        const storageData = await storage.asV1022.get()
        if (!storageData) return undefined

        return storageData.map((proposal): DemocracyProposalStorageData => {
            const [index, hash, proposer] = proposal
            return {
                index,
                hash,
                proposer,
            }
        })
    } else if (storage.isV9320) {
        const storageData = await storage.asV9320.get()
        if (!storageData) return undefined

        return storageData.map((proposal): DemocracyProposalStorageData => {
            const [index, , proposer] = proposal
            return {
                index,
                hash: new Uint8Array(32).fill(0),
                proposer,
            }
        })
    } else {
        throw new UnknownVersionError(storage.constructor.name)
    }
}

export async function getProposals(ctx: BlockContext) {
    return await getStorageData(ctx)
}
